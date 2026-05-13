import { parseBody, status, Router } from "@bepalo/router";
import { json, parseCookie, authenticate } from "@bepalo/router";
import type {
  FreeHandler,
  Handler,
  RouterContext,
  CTXAddress,
  CTXBody,
  RouterHandlers,
  CTXCookie,
  CTXAuth,
  HandlerType,
  HttpMethod,
} from "@bepalo/router";
import { Status } from "@bepalo/router";
import type { AnyColumn, BinaryOperator, Column, Table } from "drizzle-orm";
import type { SQL, SQLWrapper } from "drizzle-orm";
import {
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  like,
  ilike,
  notLike,
  notIlike,
  inArray,
  isNull,
  isNotNull,
  and,
  asc,
  desc,
  DrizzleQueryError,
  sql,
  or,
} from "drizzle-orm";
import { type, ArkErrors, type Type } from "arktype";

import { db } from "~/db";
import { parseAuth, parseSession } from "~/middleware";
import {
  HttpError,
  type QueryAuth,
  type QueryAuthEntries,
  type QueryAuthEntry,
} from "./bepalo-query-utils";

export const MAX_BODY_SIZE = 4 * 1024;
// const QUERY_PREFIX_LEN = "/query/v1/".length;
// const FIELD_MATCH_PREFIX = "~";
const FILTER_QUERY_RE = /^~(?:\w+(?:\.\w+){0,2})=(?:(.*?)(?:$|(?<!\\)[\|,]))+$/;
const FILTER_QUERY_KEY_VAL_RE =
  /~(\w+(?:\.\w+){0,2})=(?:(.*?)(?:$|(?<!\\)([\|,])))/g;

export const variables = {
  $sessionId: (req, ctx) => ctx.session.id,
  $userId: (req, ctx) => ctx.session.userId,
  $organizationId: (req, ctx) => ctx.session.organization.id,
  $employeeId: (req, ctx) => ctx.session.employee.id,
  $now: () => new Date(),
} as Record<string, (req: Request, ctx: RouterContext<any>) => unknown>;

export const operatorMap: Record<
  string,
  | BinaryOperator
  | { (column: Column | SQL.Aliased | SQL, value: string | SQLWrapper): SQL }
  | { (column: Column, val: string): SQL }
  | { (column: Column): SQL }
> = {
  eq,
  ne,
  gt,
  gte,
  lt,
  lte,
  like,
  ilike,
  notLike,
  notIlike,
  in: (col: Column, val: string) => inArray(col, val.split(",")), // handle comma-separated lists
  null: (col: Column) => isNull(col),
  notNull: (col: Column) => isNotNull(col),
};

export const orderMap: Record<string, (column: AnyColumn | SQLWrapper) => SQL> =
  {
    asc,
    desc,
  };

// const tableInfoIndices = Object.fromEntries(
//   Object.entries(tables).map(([n, t]) => [
//     n,
//     {
//       columns: Object.fromEntries(Object.keys(t).map((t, i) => [t, i])),
//     },
//   ]),
// );

// writeFileSync("./query-info.json", JSON.stringify(tableInfoIndices, null, 2));
// writeFileSync(
//   "./operator-list.json",
//   JSON.stringify(Object.keys(operatorMap), null, 2),
// );

const join = (
  tables: Record<string, Table>,
  query: any,
  include: any[],
  cur: number,
) => {
  if (cur >= include.length) return query;
  let [alias, [, filter, tableId, joinType]] = include[cur];
  if (!tableId) tableId = alias;
  const table = tables[tableId as keyof typeof tables];
  switch (joinType) {
    case "middle":
      return join(tables, query.middleJoin(table, filter), include, cur + 1);
    case "right":
      return join(tables, query.rightJoin(table, filter), include, cur + 1);
    default:
    case "left":
      return join(tables, query.leftJoin(table, filter), include, cur + 1);
  }
};

const filter = (query: any, where?: SQL | SQLWrapper) => {
  if (where == null) return query;
  return query.where(where);
};

const order = (query: any, orderRules?: any[]) => {
  if (orderRules == null || orderRules.length === 0) return query;
  return query.orderBy(...orderRules);
};

const offsetLimit = (
  query: any,
  { offset, limit }: { offset?: number; limit?: number },
) => {
  if (offset == null && limit == null) return query;
  else if (offset == null) return query.limit(limit);
  else if (limit == null) return query.offset(offset);
  return query.offset(offset).limit(limit);
};

const parseBoolean = (input?: string | null) => {
  switch (input) {
    case "0":
    case "false":
    case undefined:
    case null:
      return false;
    default:
      return true;
  }
};

export const getBepaloQueryRouter = <
  S extends Record<string, Table>,
  XContext = {},
>({
  tables,
  pathPrefix,
  queryAuth,
  isProduction,
  currentTableSelectorId = "",
}: {
  tables: S;
  pathPrefix: string;
  queryAuth: QueryAuth<S, XContext>;
  isProduction?: boolean;
  currentTableSelectorId?: string;
}) => {
  const IS_PRODUCTION = isProduction;
  const QUERY_PREFIX_LEN = pathPrefix.length;
  const MAIN_TABLE_SELECT_ID = currentTableSelectorId;

  const select = <
    T extends Table | Record<string, unknown>,
    P extends Array<keyof T>,
    O extends Array<keyof T>,
  >(
    tables: Record<string, Table>,
    table: T,
    options?: {
      select?: [string, [P, string]];
      omit?: [string, [O, string]];
    },
  ): Omit<Pick<T, P[number]>, O[number]> => {
    if (options == null) return { ...table };
    const picked = (options.select == null ? { ...table } : {}) as Omit<
      Pick<T, P[number]>,
      O[number]
    >;
    if (options.select != null) {
      for (const [alias, _fields] of options.select) {
        if (!_fields) continue;
        const isMainTable = alias === MAIN_TABLE_SELECT_ID;
        const isFieldsArray = Array.isArray(_fields);
        const fields = isFieldsArray ? _fields[0] : _fields;
        const tableId = isFieldsArray ? _fields[1] : alias;
        if (isMainTable) {
          // const table = tables[tableId as keyof typeof tables];
          for (const [field, value] of fields) {
            picked[field] = value;
          }
        } else {
          const cur = {};
          // const table = tables[tableId] as Table;
          for (const [field, value] of fields) {
            cur[field] = value;
          }
          picked[alias] = cur;
        }
      }
    }
    if (options.omit != null) {
      for (const [alias, _fields] of options.omit) {
        if (!_fields) continue;
        const isMainTable = alias === MAIN_TABLE_SELECT_ID;
        const isFieldsArray = Array.isArray(_fields);
        const fields = isFieldsArray ? _fields[0] : _fields;
        // const tableId = isFieldsArray ? _fields[1] : alias;
        const aliasId = isMainTable && isFieldsArray ? _fields[1] : alias;
        if (isMainTable) {
          for (const [field] of fields) {
            delete picked[field];
          }
        } else {
          picked[aliasId] = { ...picked[aliasId] };
          for (const [field] of fields) {
            if (picked[aliasId]) {
              delete picked[aliasId][field];
            }
          }
        }
      }
    }
    return picked;
  };

  const tableInfo = Object.fromEntries(
    Object.entries(tables).map(([n, t]) => [
      n,
      {
        columns: Object.keys(t),
      },
    ]),
  );
  const parseFilter = (
    [p, v]: [string, string],
    { tableId, table, tables, authProtected }: any,
  ) => {
    let [t, k, op] = p.split(".", 3);
    let selectTable: Table | undefined;
    if (!k) {
      op = "eq";
      k = t;
      selectTable = table;
    } else if (!op) {
      op = k;
      k = t;
      selectTable = table;
    } else {
      selectTable = tables[t];
    }
    if (selectTable == null) {
      throw new HttpError("Invalid table", Status._400_BadRequest);
    }
    const operator = operatorMap[op];
    if (!operator) {
      throw new HttpError(`Invalid operation '${op}'`, Status._400_BadRequest);
    }
    let rv = v;
    if (typeof v === "string") {
      const reMatch = /(?<!\\)\{([^}\\]+)\}/g.exec(v);
      if (reMatch) {
        const k = reMatch[1]?.trim() || "";
        if (k[0] === "$") {
          const match = variables[k];
          if (!match) {
            throw new HttpError(
              `Invalid variable '${k}'`,
              Status._400_BadRequest,
            );
          }
          rv = match(req, ctx);
        } else {
          let [t, c] = k.split(".", 2);
          let refTable: Table | undefined;
          if (!c) {
            c = t;
            t = tableId;
            refTable = table;
          } else {
            refTable = tables[t];
          }
          if (refTable == null) {
            throw new HttpError(`Invalid table ${t}`, Status._400_BadRequest);
          }
          const col = refTable[c as keyof typeof refTable];
          if (col == null) {
            throw new HttpError(
              `Invalid column '${t}.${c}'`,
              Status._400_BadRequest,
            );
          }
          rv = col;
        }
      }
    }
    if (typeof rv === "string") {
      rv = rv.replace(/\\(\\|\{|\})/g, "$1");
    }
    if (authProtected.allowedFilters && !authProtected.allowedFilters[k]) {
      throw new HttpError(
        `Invalid or forbidden field '${k}' in filter query`,
        Status._400_BadRequest,
      );
    }
    return operator(selectTable[k as keyof typeof selectTable] as Column, rv);
  };

  const parseTableAuth =
    (): FreeHandler<
      CTXAuth & { query: { guest: boolean; mine: boolean } } & {
        resId: string;
        queryAuthEntry: QueryAuthEntries<typeof tables, keyof typeof tables>;
        authProtected: QueryAuthEntry<typeof tables, keyof typeof tables>;
      }
    > =>
    async (req, ctx) => {
      const { url, auth } = ctx;
      const queryGuest = parseBoolean(url.searchParams.get("guest"));
      const queryThisSession = parseBoolean(url.searchParams.get("mine"));
      if (!ctx.query) {
        ctx.query = { guest: queryGuest, mine: queryThisSession };
      } else {
        ctx.query.guest = queryGuest;
        ctx.query.mine = queryThisSession;
      }
      const resId = url.pathname.slice(QUERY_PREFIX_LEN);
      ctx.resId = resId;
      const tablePermissions = queryAuth[
        resId as keyof typeof queryAuth
      ] as QueryAuth<S, XContext>[keyof QueryAuth<S, XContext>];
      if (tablePermissions == null) {
        return req.method === "OPTIONS" || req.method === "HEAD"
          ? status(Status._404_NotFound, null)
          : json(
              {
                error: "Table not found",
              },
              {
                status: Status._404_NotFound,
              },
            );
      }
      if (req.method !== "OPTIONS") {
        const queryAuthEntry = tablePermissions[
          (req.method === "HEAD" ? "GET" : req.method) as HttpMethod
        ] as QueryAuthEntries<S, keyof S>;
        if (queryAuthEntry == null) {
          return req.method === "OPTIONS" || req.method === "HEAD"
            ? status(Status._403_Forbidden, null)
            : json(
                {
                  error: "Forbidden",
                },
                { status: Status._403_Forbidden },
              );
        }
        if (auth == null && queryAuthEntry.guest == null) {
          return req.method === "OPTIONS" || req.method === "HEAD"
            ? status(Status._403_Forbidden, null)
            : json(
                {
                  error: "Forbidden",
                },
                { status: Status._403_Forbidden },
              );
        }
        const authProtected =
          queryGuest || auth?.role == null
            ? queryAuthEntry.guest
            : queryThisSession
              ? (queryAuthEntry.mine ??
                queryAuthEntry[auth.role as keyof typeof queryAuthEntry] ??
                queryAuthEntry.allUsers ??
                undefined)
              : (queryAuthEntry[auth.role as keyof typeof queryAuthEntry] ??
                queryAuthEntry.allUsers ??
                queryAuthEntry.mine ??
                undefined);
        if (authProtected == null) {
          return req.method === "OPTIONS" || req.method === "HEAD"
            ? status(Status._403_Forbidden, null)
            : json(
                {
                  error: "Forbidden",
                },
                { status: Status._403_Forbidden },
              );
        }
        ctx.authProtected = authProtected;
        ctx.queryAuthEntry = queryAuthEntry;
      }
    };

  const commonFilters: Handler<
    CTXAddress &
      CTXCookie &
      CTXAuth &
      CTXSession & { query: { guest: boolean; mine: boolean } } & {
        resId: string;
        queryAuthEntry: QueryAuthEntries<S, keyof S>;
        authProtected: QueryAuthEntry<S, keyof S>;
      }
  >[] = [
    // auth
    parseCookie(),
    authenticate({
      parseAuth,
      checkOnly: true,
    }),
    parseSession({ optional: true }),
    parseTableAuth(),
  ];

  const route = {
    OPTIONS: {
      FILTER: [
        authenticate({
          parseAuth,
          checkOnly: true,
        }),
        parseTableAuth(),
      ],
      HANDLER: [
        async (req, ctx) => {
          const { query, auth, resId } = ctx;
          const { mine: queryThisSession, guest: queryGuest } = query;
          const tableId = resId as keyof S;
          const table = tables[tableId] as Table;
          if (table == null) {
            return status(Status._404_NotFound, null);
          }
          const tablePermissions = queryAuth[tableId];
          let allowedMethods;
          if (queryGuest && queryThisSession) {
            allowedMethods = Object.entries(tablePermissions)
              .filter(([method, perm]) => perm.mine || perm.guest)
              .map(([method]) => method);
          } else if (queryGuest) {
            allowedMethods = Object.entries(tablePermissions)
              .filter(([method, perm]) => perm.guest)
              .map(([method]) => method);
          } else if (queryThisSession) {
            allowedMethods = Object.entries(tablePermissions)
              .filter(([method, perm]) => perm.mine)
              .map(([method]) => method);
          } else {
            allowedMethods = Object.entries(tablePermissions)
              .filter(
                ([method, perm]) =>
                  (auth?.role && perm[auth.role]) || perm.allUsers,
              )
              .map(([method]) => method);
          }
          if (allowedMethods.length > 0) {
            if (allowedMethods.includes("GET")) {
              ctx.headers.append(
                "Allow",
                `OPTIONS,HEAD,${allowedMethods.join(",")}`,
              );
            } else {
              ctx.headers.append(
                "Allow",
                `OPTIONS,${allowedMethods.join(",")}`,
              );
            }
          } else {
            ctx.headers.append("Allow", `OPTIONS`);
          }
          return status(Status._204_NoContent, null);
        },
      ],
    },

    HEAD: {},

    GET: {
      FILTER: [
        ...commonFilters,
        // parse and validate query
        (req, ctx) => {
          const q = TGetQuery(
            Object.fromEntries(
              ctx.url.searchParams
                .entries()
                .map(([k, v]) => [k, v.replace(/\%\%/g, "%")]),
            ),
          );
          if (q instanceof ArkErrors) {
            return json(
              { error: q.toString() },
              { status: Status._400_BadRequest },
            );
          }
          ctx.query = q;
        },
      ],
      HANDLER: [
        async (req, ctx) => {
          const { authProtected, query, resId } = ctx;
          const {
            mine: queryThisSession,
            guest: queryGuest,
            countOnly: queryCountOnly,
            order: queryOrder,
            offset: queryOffset,
            limit: queryLimit,
            select: querySelect,
            omit: queryOmit,
            ...queryFilters
          } = query;
          const tableId = resId as keyof S;
          const table = tables[tableId] as Table;
          if (table == null) {
            return req.method === "HEAD"
              ? status(Status._404_NotFound, null)
              : json(
                  {
                    error: "Table not found",
                  },
                  {
                    status: Status._404_NotFound,
                  },
                );
          }
          const offset = queryOffset ?? 0;
          const limit = queryLimit ?? 1000;
          try {
            const parsedQueryFiltersEntries: (
              | [string, string]
              | [string, string][]
            )[][] = [];
            const queryFiltersEntries = Object.entries(queryFilters);
            for (const [p, v] of queryFiltersEntries) {
              const q = `${p}=${v}`;
              if (!FILTER_QUERY_RE.test(q)) {
                throw new HttpError(
                  `Invalid query '${q}'`,
                  Status._400_BadRequest,
                );
              }
              const matches = q.matchAll(FILTER_QUERY_KEY_VAL_RE);
              const disjunction: ([string, string] | [string, string][])[] = [];
              let conjunction: [string, string][] = [];
              let lastSeparator = undefined;
              for (const [, key, value, separator] of matches) {
                switch (separator || lastSeparator) {
                  case undefined:
                  case "|":
                    disjunction.push([key, value]);
                    break;
                  case ",":
                    conjunction.push([key, value]);
                    break;
                }
                if (
                  conjunction.length > 0 &&
                  (separator === "|" || !separator) &&
                  lastSeparator === ","
                ) {
                  disjunction.push(conjunction);
                  conjunction = [];
                }
                lastSeparator = separator;
              }
              parsedQueryFiltersEntries.push(disjunction);
            }
            const parseFilterOptions = {
              tableId,
              table,
              tables,
              authProtected,
            };
            const qFilter =
              parsedQueryFiltersEntries.length > 0
                ? parsedQueryFiltersEntries.map((disjuctions0) => {
                    return or(
                      ...disjuctions0.map((conjuctions1) => {
                        if (Array.isArray(conjuctions1[0])) {
                          return and(
                            ...conjuctions1.map((disjuctions1) =>
                              parseFilter(
                                disjuctions1 as [string, string],
                                parseFilterOptions,
                              ),
                            ),
                          );
                        } else {
                          return parseFilter(
                            conjuctions1 as [string, string],
                            parseFilterOptions,
                          );
                        }
                      }),
                    );
                  })
                : [];
            if (queryCountOnly) {
              const where = and(
                authProtected?.where
                  ? authProtected.where(req, ctx)
                  : undefined,
                ...qFilter,
              );
              if (authProtected.beforeQuery) {
                await authProtected.beforeQuery(req, ctx);
              }
              try {
                const includeEntries =
                  authProtected?.include &&
                  Object.entries(authProtected.include);
                const selector = { count: sql<number>`count (*)` };
                const result = includeEntries
                  ? await offsetLimit(
                      filter(
                        join(
                          tables,
                          db.select(selector).from(table),
                          includeEntries,
                          0,
                        ),
                        where,
                      ),
                      { offset, limit },
                    )
                  : await offsetLimit(
                      filter(db.select(selector).from(table), where),
                      { offset, limit },
                    );
                ctx.result = { count: result[0].count };
                if (authProtected.afterQuery) {
                  await authProtected.afterQuery(req, ctx);
                }
              } catch (error) {
                if (authProtected.onQueryError) {
                  ctx.error = error as Error;
                  await authProtected.onQueryError(req, ctx);
                }
                throw error;
              }
              return json(ctx.result);
            } else {
              const includeJ = authProtected.include;
              const includeEntries = includeJ && Object.entries(includeJ);
              const include = includeEntries
                ? Object.fromEntries(
                    includeEntries.map(([alias, [fields, , tableId]]) => [
                      alias,
                      fields,
                    ]),
                  )
                : {};
              const qSelect =
                querySelect &&
                Object.entries(querySelect).map(([a, fields]) => {
                  const isMainTable = a === MAIN_TABLE_SELECT_ID;
                  const n = isMainTable
                    ? tableId
                    : (includeJ[a] && includeJ[a][2]) || a;
                  if (!isMainTable && !includeJ[a]) {
                    throw new HttpError(
                      `Invalid or forbidden table '${a}' in select query`,
                      Status._400_BadRequest,
                    );
                  }
                  return Array.isArray(fields)
                    ? [
                        a,
                        [
                          fields.map((s) => {
                            const info = tableInfo[n];
                            const k =
                              typeof s === "number" ? info?.columns[s] : s;
                            if (
                              isMainTable
                                ? !authProtected.select[k]
                                : !includeJ[a][0][k]
                            ) {
                              throw new HttpError(
                                `Invalid or forbidden field '${s}'->'${k}' in select query '${a}'`,
                                Status._400_BadRequest,
                              );
                            }
                            return [
                              k,
                              isMainTable
                                ? authProtected.select[k]
                                : includeJ[a][0][k],
                            ];
                          }),
                          n,
                        ],
                      ]
                    : [
                        a,
                        !fields
                          ? undefined
                          : isMainTable
                            ? authProtected.select && [
                                Object.entries(authProtected.select),
                                n,
                              ]
                            : [
                                includeJ[a][0] &&
                                  Object.entries(includeJ[a][0]),
                                n,
                              ],
                      ];
                });
              const qOmit =
                queryOmit &&
                Object.entries(queryOmit).map(([a, fields]) => {
                  const isMainTable = a === MAIN_TABLE_SELECT_ID;
                  const n = isMainTable
                    ? tableId
                    : (includeJ[a] && includeJ[a][2]) || a;
                  if (!isMainTable && !includeJ[a]) {
                    throw new HttpError(
                      `Invalid or forbidden table '${a}' in omit query`,
                      Status._400_BadRequest,
                    );
                  }
                  return Array.isArray(fields)
                    ? [
                        a,
                        [
                          fields.map((s) => {
                            const info = tableInfo[n];
                            const k =
                              typeof s === "number" ? info?.columns[s] : s;
                            if (
                              isMainTable
                                ? !authProtected.select[k]
                                : !includeJ[a][0][k]
                            ) {
                              throw new HttpError(
                                `Invalid or forbidden field '${s}'->'${k}' in omit query '${a}'`,
                                Status._400_BadRequest,
                              );
                            }
                            return [
                              k,
                              isMainTable
                                ? authProtected.select[k]
                                : includeJ[a][0][k],
                            ];
                          }),
                          n,
                        ],
                      ]
                    : [
                        a,
                        !fields
                          ? undefined
                          : isMainTable
                            ? table && [Object.entries(table), n]
                            : [
                                includeJ[a][0] &&
                                  Object.entries(includeJ[a][0]),
                                n,
                              ],
                      ];
                });
              const selector = authProtected?.select
                ? {
                    ...select(
                      tables,
                      { ...authProtected.select, ...include },
                      {
                        select: qSelect,
                        omit: qOmit,
                      },
                    ),
                  }
                : undefined;
              if (queryOrder && !Array.isArray(queryOrder)) {
                throw new HttpError(
                  `Invalid order query type`,
                  Status._400_BadRequest,
                );
              }
              const orderRules = queryOrder
                ? queryOrder.map((selector) => {
                    let [t, k, r] = selector.split(".", 3);
                    if (!k) {
                      k = t;
                      t = tableId;
                    } else if (!r) {
                      r = k;
                      k = t;
                      t = tableId;
                    }
                    r = (r || "asc") as keyof typeof orderMap;
                    const table = tables[tableId];
                    if (table == null) {
                      throw new HttpError(
                        `Invalid or forbidden table '${t}' in order query`,
                        Status._400_BadRequest,
                      );
                    }
                    const field = table[k];
                    if (!field) {
                      throw new HttpError(
                        `Invalid or forbidden field '${s}'->'${k}' in order query`,
                        Status._400_BadRequest,
                      );
                    }
                    if (r != "asc" && r != "desc") {
                      throw new HttpError(
                        `Invalid order type '${r}' in order query`,
                        Status._400_BadRequest,
                      );
                    }
                    return orderMap[r](field);
                  })
                : undefined;
              const where = and(
                authProtected?.where
                  ? authProtected.where(req, ctx)
                  : undefined,
                ...qFilter,
              );
              if (authProtected.beforeQuery) {
                await authProtected.beforeQuery(req, ctx);
              }
              try {
                const result =
                  selector && includeEntries
                    ? await offsetLimit(
                        order(
                          filter(
                            join(
                              tables,
                              db.select(selector).from(table),
                              includeEntries,
                              0,
                            ),
                            where,
                          ),
                          orderRules,
                        ),
                        { offset, limit },
                      )
                    : selector
                      ? await offsetLimit(
                          order(
                            filter(db.select(selector).from(table), where),
                            orderRules,
                          ),
                          { offset, limit },
                        )
                      : includeEntries
                        ? await offsetLimit(
                            order(
                              filter(
                                join(
                                  tables,
                                  db.select().from(table),
                                  includeEntries,
                                  0,
                                ),
                                where,
                              ),
                              orderRules,
                            ),
                            { offset, limit },
                          )
                        : await offsetLimit(
                            order(
                              filter(db.select().from(table), where),
                              orderRules,
                            ),
                            { offset, limit },
                          );
                ctx.result = { count: result.length, [`${tableId}s`]: result };
                if (authProtected.afterQuery) {
                  await authProtected.afterQuery(req, ctx);
                }
              } catch (error) {
                if (authProtected.onQueryError) {
                  ctx.error = error as Error;
                  await authProtected.onQueryError(req, ctx);
                }
                throw error;
              }
              // if (req.method === "GET") return json(ctx.result);
              const content = JSON.stringify(ctx.result);
              ctx.headers.set(
                "content-type",
                "application/json; charset=utf-8",
              );
              ctx.headers.set("content-length", content.length.toFixed());
              return status(
                Status._200_OK,
                req.method === "HEAD" ? null : content,
              );
            }
          } catch (error) {
            if (!IS_PRODUCTION) {
              console.error(error);
            }
            const errorStatus =
              (error as HttpError).status || Status._500_InternalServerError;
            return req.method === "HEAD"
              ? status(errorStatus, null)
              : json(
                  {
                    error: (error as HttpError).message || "Bad query",
                  },
                  {
                    status: errorStatus,
                  },
                );
          }
        },
      ],
    },

    POST: {
      FILTER: [
        ...commonFilters,
        // parse and validate query
        (req, ctx) => {
          const q = TPostQuery(Object.fromEntries(ctx.url.searchParams));
          if (q instanceof ArkErrors) {
            return json(
              { error: q.toString() },
              { status: Status._400_BadRequest },
            );
          }
          ctx.query = q;
        },
        // parse and validate the body
        parseBody({
          accept: ["application/json", "application/x-www-form-urlencoded"],
          maxSize: MAX_BODY_SIZE,
          once: true,
        }),
        (req, ctx) => {
          const b = TPostBody(ctx.body);
          if (b instanceof ArkErrors) {
            return json(
              { error: b.toString() },
              { status: Status._400_BadRequest },
            );
          }
          const bodyIsArray = Array.isArray(b);
          const bodyType = typeof b;
          if (!(bodyIsArray || bodyType === "object")) {
            return json(
              { error: `Invalid body type ${bodyType}` },
              { status: Status._400_BadRequest },
            );
          }
          ctx.body = b;
        },
      ],
      HANDLER: [
        async (req, ctx) => {
          const { query, resId, authProtected } = ctx;
          const {
            mine: queryThisSession,
            guest: queryGuest,
            countOnly: queryCountOnly,
            select: querySelect,
            omit: queryOmit,
          } = query;
          const tableId = resId as keyof S;
          const table = tables[tableId] as Table;
          if (table == null) {
            return json(
              {
                error: "Table not found",
              },
              {
                status: Status._404_NotFound,
              },
            );
          }
          try {
            let body = ctx.body;
            if (authProtected.validateBody != null) {
              if (Array.isArray(body)) {
                for (let i = 0; i < body.length; i++) {
                  const vb = await authProtected.validateBody(
                    body[i],
                    req,
                    ctx,
                  );
                  if (vb instanceof ArkErrors) {
                    throw new HttpError(vb.toString(), Status._400_BadRequest);
                  }
                  body[i] = vb;
                }
              } else {
                const vb = await authProtected.validateBody(body, req, ctx);
                if (vb instanceof ArkErrors) {
                  throw new HttpError(vb.toString(), Status._400_BadRequest);
                }
                body = vb;
              }
            }
            if (authProtected.injectBody != null) {
              if (Array.isArray(body)) {
                for (let i = 0; i < body.length; i++) {
                  const vb = await authProtected.injectBody(body[i], req, ctx);
                  if (vb != null) body[i] = vb;
                }
              } else {
                const vb = await authProtected.injectBody(body, req, ctx);
                if (vb != null) body = vb;
              }
            }
            ctx.body = body;
            const qSelect =
              querySelect &&
              Object.entries(querySelect).map(([a, fields]) => {
                const isMainTable = a === MAIN_TABLE_SELECT_ID;
                if (!isMainTable) {
                  throw new HttpError(
                    `Invalid or forbidden table '${a}' in select query`,
                    Status._400_BadRequest,
                  );
                }
                const n = tableId;
                return Array.isArray(fields)
                  ? [
                      a,
                      [
                        fields.map((s) => {
                          const info = tableInfo[n];
                          const k =
                            typeof s === "number" ? info?.columns[s] : s;
                          if (!authProtected.select[k]) {
                            throw new HttpError(
                              `Invalid or forbidden field '${s}'->'${k}' in select query '${a}'`,
                              Status._400_BadRequest,
                            );
                          }
                          return k;
                        }),
                        n,
                      ],
                    ]
                  : [
                      a,
                      !fields
                        ? undefined
                        : authProtected.select && [
                            Object.keys(authProtected.select),
                            n,
                          ],
                    ];
              });
            const qOmit =
              queryOmit &&
              Object.entries(queryOmit).map(([a, fields]) => {
                const isMainTable = a === MAIN_TABLE_SELECT_ID;
                if (!isMainTable) {
                  throw new HttpError(
                    `Invalid or forbidden table '${a}' in omit query`,
                    Status._400_BadRequest,
                  );
                }
                const n = tableId;
                return Array.isArray(fields)
                  ? [
                      a,
                      [
                        fields.map((s) => {
                          const info = tableInfo[n];
                          const k =
                            typeof s === "number" ? info?.columns[s] : s;
                          if (!table[k]) {
                            throw new HttpError(
                              `Invalid or forbidden field '${s}'->'${k}' in omit query '${a}'`,
                              Status._400_BadRequest,
                            );
                          }
                          return k;
                        }),
                        n,
                      ],
                    ]
                  : [a, !fields ? undefined : [Object.keys(table), n]];
              });
            const selector = queryCountOnly
              ? { insertedId: table.id }
              : authProtected?.select
                ? {
                    ...select(tables, authProtected.select, {
                      select: qSelect,
                      omit: qOmit,
                    }),
                  }
                : undefined;
            if (authProtected.beforeQuery) {
              await authProtected.beforeQuery(req, ctx);
            }
            try {
              const result = await db
                .insert(table)
                .values(ctx.body)
                .returning(selector);
              ctx.result = queryCountOnly
                ? { count: result?.length ?? 0 }
                : {
                    count: result?.length ?? 0,
                    [`${tableId}s`]: result,
                  };
            } catch (error) {
              if (authProtected.onQueryError) {
                ctx.error = error as Error;
                await authProtected.onQueryError(req, ctx);
              }
              throw error;
            }
            if (authProtected.afterQuery) {
              await authProtected.afterQuery(req, ctx);
            }
            return json(ctx.result, { status: Status._201_Created });
          } catch (error) {
            if (error instanceof DrizzleQueryError) {
              if (error.cause?.extendedCode === "SQLITE_CONSTRAINT_UNIQUE") {
                return json(
                  { error: "Duplicate entry" },
                  { status: Status._400_BadRequest },
                );
              } else {
                if (!IS_PRODUCTION) {
                  console.error(error);
                }
                return json(
                  { error: "Bad query" },
                  { status: Status._400_BadRequest },
                );
              }
            } else {
              if (!IS_PRODUCTION) {
                console.error(error);
              }
              return json(
                {
                  error: (error as HttpError).message || "Bad query",
                },
                {
                  status: (error as HttpError).status || Status._400_BadRequest,
                },
              );
            }
          }
        },
      ],
    },

    PUT: {},

    PATCH: {
      FILTER: [
        ...commonFilters,
        // parse and validate query
        (req, ctx) => {
          const q = TPatchQuery(Object.fromEntries(ctx.url.searchParams));
          if (q instanceof ArkErrors) {
            return json(
              { error: q.toString() },
              { status: Status._400_BadRequest },
            );
          }
          ctx.query = q;
        },
        // parse and validate the body
        parseBody({
          accept: ["application/json", "application/x-www-form-urlencoded"],
          maxSize: MAX_BODY_SIZE,
          once: true,
        }),
        (req, ctx) => {
          const b = TPatchBody(ctx.body);
          if (b instanceof ArkErrors) {
            return json(
              { error: b.toString() },
              { status: Status._400_BadRequest },
            );
          }
          const bodyIsArray = Array.isArray(b);
          const bodyType = typeof b;
          if (bodyIsArray || bodyType !== "object") {
            return json(
              {
                error: `Invalid body type ${bodyIsArray ? "array" : bodyType}`,
              },
              { status: Status._400_BadRequest },
            );
          }
          ctx.body = b;
        },
      ],
      HANDLER: [
        async (req, ctx) => {
          const { query, resId, authProtected } = ctx;
          const {
            mine: queryThisSession,
            guest: queryGuest,
            countOnly: queryCountOnly,
            select: querySelect,
            omit: queryOmit,
            ...queryFilters
          } = query;
          const tableId = resId as keyof S;
          const table = tables[tableId] as Table;
          if (table == null) {
            return json(
              {
                error: "Table not found",
              },
              {
                status: Status._404_NotFound,
              },
            );
          }
          try {
            let body = ctx.body;
            if (authProtected.validateBody != null) {
              if (Array.isArray(body)) {
                body.map(async (b) => {
                  const vb = await authProtected.validateBody(b, req, ctx);
                  if (vb instanceof ArkErrors) {
                    throw new HttpError(vb.toString(), Status._400_BadRequest);
                  }
                  return vb;
                });
              } else {
                const vb = await authProtected.validateBody(body, req, ctx);
                if (vb instanceof ArkErrors) {
                  throw new HttpError(vb.toString(), Status._400_BadRequest);
                }
                body = vb;
              }
            }
            if (authProtected.injectBody != null) {
              if (Array.isArray(body)) {
                body.map(async (b) => {
                  const vb = await authProtected.injectBody(b, req, ctx);
                  return vb == null ? b : vb;
                });
              } else {
                const vb = await authProtected.injectBody(body, req, ctx);
                if (vb != null) body = vb;
              }
            }
            ctx.body = body;
            const parsedQueryFiltersEntries: (
              | [string, string]
              | [string, string][]
            )[][] = [];
            const queryFiltersEntries = Object.entries(queryFilters);
            for (const [p, v] of queryFiltersEntries) {
              const q = `${p}=${v}`;
              if (!FILTER_QUERY_RE.test(q)) {
                throw new HttpError(
                  `Invalid query '${q}'`,
                  Status._400_BadRequest,
                );
              }
              const matches = q.matchAll(FILTER_QUERY_KEY_VAL_RE);
              const disjunction: ([string, string] | [string, string][])[] = [];
              let conjunction: [string, string][] = [];
              let lastSeparator = undefined;
              for (const [, key, value, separator] of matches) {
                switch (separator || lastSeparator) {
                  case undefined:
                  case "|":
                    disjunction.push([key, value]);
                    break;
                  case ",":
                    conjunction.push([key, value]);
                    break;
                }
                if (
                  conjunction.length > 0 &&
                  (separator === "|" || !separator) &&
                  lastSeparator === ","
                ) {
                  disjunction.push(conjunction);
                  conjunction = [];
                }
                lastSeparator = separator;
              }
              parsedQueryFiltersEntries.push(disjunction);
            }
            const parseFilterOptions = {
              tableId,
              table,
              tables,
              authProtected,
            };
            const qFilter =
              parsedQueryFiltersEntries.length > 0
                ? parsedQueryFiltersEntries.map((disjuctions0) => {
                    return or(
                      ...disjuctions0.map((conjuctions1) => {
                        if (Array.isArray(conjuctions1[0])) {
                          return and(
                            ...conjuctions1.map((disjuctions1) =>
                              parseFilter(
                                disjuctions1 as [string, string],
                                parseFilterOptions,
                              ),
                            ),
                          );
                        } else {
                          return parseFilter(
                            conjuctions1 as [string, string],
                            parseFilterOptions,
                          );
                        }
                      }),
                    );
                  })
                : [];
            const selector = queryCountOnly
              ? { insertedId: table.id }
              : authProtected?.select
                ? {
                    ...select(tables, authProtected.select, {
                      select:
                        querySelect &&
                        Object.entries(querySelect).map(([a, fields]) => {
                          const isMainTable = a === MAIN_TABLE_SELECT_ID;
                          if (!isMainTable) {
                            throw new HttpError(
                              `Invalid or forbidden table '${a}' in select query`,
                              Status._400_BadRequest,
                            );
                          }
                          const n = tableId;
                          return Array.isArray(fields)
                            ? [
                                a,
                                [
                                  fields.map((s) => {
                                    const info = tableInfo[n];
                                    const k =
                                      typeof s === "number"
                                        ? info?.columns[s]
                                        : s;
                                    if (!authProtected.select[k]) {
                                      throw new HttpError(
                                        `Invalid or forbidden field '${s}'->'${k}' in select query '${a}'`,
                                        Status._400_BadRequest,
                                      );
                                    }
                                    return k;
                                  }),
                                  n,
                                ],
                              ]
                            : [
                                a,
                                !fields
                                  ? undefined
                                  : authProtected.select && [
                                      Object.keys(authProtected.select),
                                      n,
                                    ],
                              ];
                        }),
                      omit:
                        queryOmit &&
                        Object.entries(queryOmit).map(([a, fields]) => {
                          const isMainTable = a === MAIN_TABLE_SELECT_ID;
                          if (!isMainTable) {
                            throw new HttpError(
                              `Invalid or forbidden table '${a}' in omit query`,
                              Status._400_BadRequest,
                            );
                          }
                          const n = tableId;
                          return Array.isArray(fields)
                            ? [
                                a,
                                [
                                  fields.map((s) => {
                                    const info = tableInfo[n];
                                    const k =
                                      typeof s === "number"
                                        ? info?.columns[s]
                                        : s;
                                    if (!table[k]) {
                                      throw new HttpError(
                                        `Invalid or forbidden field '${s}'->'${k}' in omit query '${a}'`,
                                        Status._400_BadRequest,
                                      );
                                    }
                                    return k;
                                  }),
                                  n,
                                ],
                              ]
                            : [
                                a,
                                !fields ? undefined : [Object.keys(table), n],
                              ];
                        }),
                    }),
                  }
                : undefined;
            const where = and(
              authProtected?.where ? authProtected.where(req, ctx) : undefined,
              ...qFilter,
            );
            if (authProtected.beforeQuery) {
              await authProtected.beforeQuery(req, ctx);
            }
            try {
              const includeJ = authProtected.include;
              const includeEntries = includeJ && Object.entries(includeJ);
              const result =
                selector && includeEntries
                  ? await filter(
                      join(
                        tables,
                        db.update(table).set(ctx.body),
                        includeEntries,
                        0,
                      ),
                      where,
                    ).returning(selector)
                  : selector
                    ? await filter(
                        db.update(table).set(ctx.body),
                        where,
                      ).returning(selector)
                    : includeEntries
                      ? await join(
                          tables,
                          filter(db.update(table).set(ctx.body), where),
                          includeEntries,
                          0,
                        ).returning()
                      : filter(db.delete(table), where);
              ctx.result = queryCountOnly
                ? { count: result?.length ?? 0 }
                : {
                    count: result?.length ?? 0,
                    [`${tableId}s`]: result,
                  };
              if (authProtected.afterQuery) {
                await authProtected.afterQuery(req, ctx);
              }
            } catch (error) {
              if (authProtected.onQueryError) {
                ctx.error = error as Error;
                await authProtected.onQueryError(req, ctx);
              }
              throw error;
            }
            return json(ctx.result);
          } catch (error) {
            if (!IS_PRODUCTION) {
              console.error(error);
            }
            return json(
              {
                error: error.message || "Bad query",
              },
              {
                status: error.status || Status._400_BadRequest,
              },
            );
          }
        },
      ],
    },

    DELETE: {
      FILTER: [
        ...commonFilters,
        // parse and validate query
        (req, ctx) => {
          const q = TDeleteQuery(Object.fromEntries(ctx.url.searchParams));
          if (q instanceof ArkErrors) {
            return json(
              { error: q.toString() },
              { status: Status._400_BadRequest },
            );
          }
          ctx.query = q;
        },
      ],
      HANDLER: [
        async (req, ctx) => {
          const { query, resId, authProtected } = ctx;
          const {
            mine: queryThisSession,
            guest: queryGuest,
            countOnly: queryCountOnly,
            select: querySelect,
            omit: queryOmit,
            ...queryFilters
          } = query;
          const tableId = resId as keyof S;
          const table = tables[tableId] as Table;
          if (table == null) {
            return json(
              {
                error: "Table not found",
              },
              {
                status: Status._404_NotFound,
              },
            );
          }
          try {
            const parsedQueryFiltersEntries: (
              | [string, string]
              | [string, string][]
            )[][] = [];
            const queryFiltersEntries = Object.entries(queryFilters);
            for (const [p, v] of queryFiltersEntries) {
              const q = `${p}=${v}`;
              if (!FILTER_QUERY_RE.test(q)) {
                throw new HttpError(
                  `Invalid query '${q}'`,
                  Status._400_BadRequest,
                );
              }
              const matches = q.matchAll(FILTER_QUERY_KEY_VAL_RE);
              const disjunction: ([string, string] | [string, string][])[] = [];
              let conjunction: [string, string][] = [];
              let lastSeparator = undefined;
              for (const [, key, value, separator] of matches) {
                switch (separator || lastSeparator) {
                  case undefined:
                  case "|":
                    disjunction.push([key, value]);
                    break;
                  case ",":
                    conjunction.push([key, value]);
                    break;
                }
                if (
                  conjunction.length > 0 &&
                  (separator === "|" || !separator) &&
                  lastSeparator === ","
                ) {
                  disjunction.push(conjunction);
                  conjunction = [];
                }
                lastSeparator = separator;
              }
              parsedQueryFiltersEntries.push(disjunction);
            }
            const parseFilterOptions = {
              tableId,
              table,
              tables,
              authProtected,
            };
            const qFilter =
              parsedQueryFiltersEntries.length > 0
                ? parsedQueryFiltersEntries.map((disjuctions0) => {
                    return or(
                      ...disjuctions0.map((conjuctions1) => {
                        if (Array.isArray(conjuctions1[0])) {
                          return and(
                            ...conjuctions1.map((disjuctions1) =>
                              parseFilter(
                                disjuctions1 as [string, string],
                                parseFilterOptions,
                              ),
                            ),
                          );
                        } else {
                          return parseFilter(
                            conjuctions1 as [string, string],
                            parseFilterOptions,
                          );
                        }
                      }),
                    );
                  })
                : [];
            const selector = queryCountOnly
              ? { insertedId: table.id }
              : authProtected?.select
                ? {
                    ...select(tables, authProtected.select, {
                      select:
                        querySelect &&
                        Object.entries(querySelect).map(([a, fields]) => {
                          const isMainTable = a === MAIN_TABLE_SELECT_ID;
                          if (!isMainTable) {
                            throw new HttpError(
                              `Invalid or forbidden table '${a}' in select query`,
                              Status._400_BadRequest,
                            );
                          }
                          const n = tableId;
                          return Array.isArray(fields)
                            ? [
                                a,
                                [
                                  fields.map((s) => {
                                    const info = tableInfo[n];
                                    const k =
                                      typeof s === "number"
                                        ? info?.columns[s]
                                        : s;
                                    if (!authProtected.select[k]) {
                                      throw new HttpError(
                                        `Invalid or forbidden field '${s}'->'${k}' in select query '${a}'`,
                                        Status._400_BadRequest,
                                      );
                                    }
                                    return k;
                                  }),
                                  n,
                                ],
                              ]
                            : [
                                a,
                                !fields
                                  ? undefined
                                  : authProtected.select && [
                                      Object.keys(authProtected.select),
                                      n,
                                    ],
                              ];
                        }),
                      omit:
                        queryOmit &&
                        Object.entries(queryOmit).map(([a, fields]) => {
                          const isMainTable = a === MAIN_TABLE_SELECT_ID;
                          if (!isMainTable) {
                            throw new HttpError(
                              `Invalid or forbidden table '${a}' in omit query`,
                              Status._400_BadRequest,
                            );
                          }
                          const n = tableId;
                          return Array.isArray(fields)
                            ? [
                                a,
                                [
                                  fields.map((s) => {
                                    const info = tableInfo[n];
                                    const k =
                                      typeof s === "number"
                                        ? info?.columns[s]
                                        : s;
                                    if (!table[k]) {
                                      throw new HttpError(
                                        `Invalid or forbidden field '${s}'->'${k}' in omit query '${a}'`,
                                        Status._400_BadRequest,
                                      );
                                    }
                                    return k;
                                  }),
                                  n,
                                ],
                              ]
                            : [
                                a,
                                !fields ? undefined : [Object.keys(table), n],
                              ];
                        }),
                    }),
                  }
                : undefined;
            const where = and(
              authProtected?.where ? authProtected.where(req, ctx) : undefined,
              ...qFilter,
            );
            if (authProtected.beforeQuery) {
              await authProtected.beforeQuery(req, ctx);
            }
            try {
              const includeJ = authProtected.include;
              const includeEntries = includeJ && Object.entries(includeJ);
              // const include = includeEntries
              //   ? Object.fromEntries(
              //       includeEntries.map(([alias, [fields, , tableId]]) => [
              //         alias,
              //         fields,
              //       ]),
              //     )
              //   : {};
              const result =
                selector && includeEntries
                  ? await filter(
                      join(tables, db.delete(table), includeEntries, 0),
                      where,
                    ).returning(selector)
                  : selector
                    ? await filter(db.delete(table), where).returning(selector)
                    : includeEntries
                      ? await join(
                          tables,
                          filter(db.delete(table), where),
                          includeEntries,
                          0,
                        ).returning()
                      : filter(db.delete(table), where);
              ctx.result = queryCountOnly
                ? { count: result?.length ?? 0 }
                : {
                    count: result?.length ?? 0,
                    [`${tableId}s`]: result,
                  };
              if (authProtected.afterQuery) {
                await authProtected.afterQuery(req, ctx);
              }
            } catch (error) {
              if (authProtected.onQueryError) {
                ctx.error = error as Error;
                await authProtected.onQueryError(req, ctx);
              }
              throw error;
            }
            return json(ctx.result);
          } catch (error) {
            if (!IS_PRODUCTION) {
              console.error(error);
            }
            return json(
              {
                error: (error as HttpError).message || "Bad query",
              },
              {
                status: (error as HttpError).status || Status._400_BadRequest,
              },
            );
          }
        },
      ],
    },
  } satisfies RouterHandlers<
    CTXAddress &
      CTXCookie &
      CTXAuth &
      CTXSession & { query: { guest: boolean; mine: boolean } } & {
        resId: string;
        queryAuthEntry: QueryAuthEntries<S, keyof S>;
        authProtected: QueryAuthEntry<S, keyof S>;
        result: any;
      },
    {
      OPTIONS: CTXGetQuery;
      HEAD: CTXGetQuery;
      GET: CTXGetQuery;
      POST: CTXPostQuery & CTXBody & CTXPostBody;
      PUT: CTXPutQuery & CTXBody & CTXPutBody;
      PATCH: CTXPatchQuery & CTXBody & CTXPatchBody;
      DELETE: CTXDeleteQuery;
    }
  >;

  route.HEAD = route.GET;
  route.PUT = route.PATCH;

  const router = new Router<XContext>();
  for (const [method, handlers] of Object.entries(route)) {
    for (const [handlerType, pipleine] of Object.entries(handlers)) {
      router.setRoutes(
        handlerType.toLowerCase() as HandlerType,
        `${method as HttpMethod} /`,
        pipleine,
      );
    }
  }
  return router;
};

export const TGetQuery = type({
  "mine?": "string.integer|'true'|'false'|''",
  "guest?": "string.integer|'true'|'false'|''",
  "countOnly?": "string.integer|'true'|'false'|''",
  "select?": "string.json.parse",
  "omit?": "string.json.parse",
  "order?": "string.json.parse",
  "offset?": "string.integer|null",
  "limit?": "string.integer|null",
}).pipe(({ mine, guest, countOnly, offset, limit, ...rest }) => ({
  mine: mine ? parseBoolean(mine) : undefined,
  guest: guest ? parseBoolean(guest) : undefined,
  countOnly: countOnly ? parseBoolean(countOnly) : undefined,
  offset: offset ? parseInt(offset) : undefined,
  limit: limit ? parseInt(limit) : undefined,
  ...rest,
}));

export type CTXGetQuery = {
  query: typeof TGetQuery.infer;
};

export const TPostQuery = type({
  "mine?": "string.integer|'true'|'false'|''",
  "guest?": "string.integer|'true'|'false'|''",
  "countOnly?": "string.integer|'true'|'false'|''",
  "select?": "string.json.parse",
  "omit?": "string.json.parse",
}).pipe(({ mine, guest, countOnly, ...rest }) => ({
  mine: mine ? parseInt(mine) : mine === "" ? 1 : undefined,
  guest: guest ? parseBoolean(guest) : undefined,
  countOnly: countOnly ? parseInt(countOnly) : countOnly === "" ? 1 : undefined,
  ...rest,
}));

export type CTXPostQuery = {
  query: typeof TPostQuery.infer;
};

export const TPostBody = type(
  "Record<string, unknown>",
  "|",
  "Record<string, unknown>[]",
);

export type CTXPostBody = {
  body: typeof TPostBody.infer;
};

export const TPutQuery = type({
  "mine?": "string.integer|'true'|'false'|''",
  "guest?": "string.integer|'true'|'false'|''",
  "countOnly?": "string.integer|'true'|'false'|''",
  "select?": "string.json.parse",
  "omit?": "string.json.parse",
}).pipe(({ mine, guest, countOnly, ...rest }) => ({
  mine: mine ? parseBoolean(mine) : undefined,
  guest: guest ? parseBoolean(guest) : undefined,
  countOnly: countOnly ? parseBoolean(countOnly) : undefined,
  ...rest,
}));

export type CTXPutQuery = {
  query: typeof TPutQuery.infer;
};

export const TPutBody = type("Record<string, unknown>");

export type CTXPutBody = {
  body: typeof TPutBody.infer;
};

export const TPatchQuery = type({
  "mine?": "string.integer|'true'|'false'|''",
  "guest?": "string.integer|'true'|'false'|''",
  "countOnly?": "string.integer|'true'|'false'|''",
  "select?": "string.json.parse",
  "omit?": "string.json.parse",
}).pipe(({ mine, guest, countOnly, ...rest }) => ({
  mine: mine ? parseBoolean(mine) : undefined,
  guest: guest ? parseBoolean(guest) : undefined,
  countOnly: countOnly ? parseBoolean(countOnly) : undefined,
  ...rest,
}));

export type CTXPatchQuery = {
  query: typeof TPatchQuery.infer;
};

export const TPatchBody = type("Record<string, unknown>");

export type CTXPatchBody = {
  body: typeof TPatchBody.infer;
};

export const TDeleteQuery = type({
  "mine?": "string.integer|'true'|'false'|''",
  "guest?": "string.integer|'true'|'false'|''",
  "countOnly?": "string.integer|'true'|'false'|''",
  "select?": "string.json.parse",
  "omit?": "string.json.parse",
}).pipe(({ mine, guest, countOnly, ...rest }) => ({
  mine: mine ? parseBoolean(mine) : undefined,
  guest: guest ? parseBoolean(guest) : undefined,
  countOnly: countOnly ? parseBoolean(countOnly) : undefined,
  ...rest,
}));

export type CTXDeleteQuery = {
  query: typeof TDeleteQuery.infer;
};
