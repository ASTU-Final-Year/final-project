import type {
  CTXAuth,
  CTXBody,
  CTXCookie,
  RouterContext,
} from "@bepalo/router";
import { type, type ArkErrors, type distill, type Type } from "arktype";
import type { InferSelectModel, SQL, SQLWrapper, Table } from "drizzle-orm";
import { tables } from "~/db/schema";

export class HttpError extends Error {
  status: number = 500;
  constructor(message: string, status: number) {
    super(message);
    this.status = status || 500;
  }
}

type JoinSelector = SQL | SQLWrapper | undefined;

type Include<S extends Table | Record<string, Table>> = S extends Table
  ? Partial<Omit<Pick<S[keyof S], keyof S[keyof S]>, keyof S[keyof S]>>
  : Partial<Omit<Pick<S[keyof S], keyof S[keyof S]>, keyof S[keyof S]>>;

type _QueryAuthEntry<
  S extends Record<string, Table>,
  K extends keyof S,
  XContext = {},
> = {
  /**
   * used to limit fields for selection
   */
  select?:
    | Partial<S[K]>
    | Partial<Record<keyof S[K] | string, S[K][keyof S[K]] | SQL<unknown>>>;

  /**
   * used to limit fields for filtering using where clause
   */
  allowedFilters?:
    | Partial<S[K]>
    | Partial<InferSelectModel<S[K]>>
    | Record<string, S[keyof S] | InferSelectModel<S[keyof S]>>;

  /**
   * used to limit fields on included tables for selection
   */
  include?: Partial<
    Record<
      keyof S,
      | [Include<S>, JoinSelector]
      | [Include<S>, JoinSelector, keyof S]
      | [Include<S>, JoinSelector, keyof S, "left" | "middle" | "right"]
    >
  > &
    Partial<
      Record<
        string,
        | [Include<S>, JoinSelector]
        | [Include<S>, JoinSelector, keyof S]
        | [Include<S>, JoinSelector, keyof S, "left" | "middle" | "right"]
      >
    >;

  /**
   * used to do custom validation and parsing on body
   */
  validateBody?: <B extends Record<string, unknown>>(
    body: B,
    req: Request,
    ctx: RouterContext<XContext & CTXCookie & CTXAuth & CTXSession>,
  ) =>
    | Record<string, unknown>
    | ArkErrors
    | Promise<Record<string, unknown> | ArkErrors>;

  /**
   * used to do transform/edit on body
   */
  injectBody?: <
    B extends Partial<
      Record<
        keyof InferSelectModel<S[K]> | string,
        InferSelectModel<S[K]> | unknown
      >
    >,
  >(
    body: B,
    req: Request,
    ctx: RouterContext<XContext & CTXCookie & CTXBody & CTXAuth & CTXSession>,
  ) =>
    | S[K]
    | Record<string, unknown>
    | Array<S[K] | Record<string, unknown>>
    | Promise<
        S[K] | Record<string, unknown> | Array<S[K] | Record<string, unknown>>
      >;

  /**
   * used to do custom filtering based on cuurent request data
   */
  where?: (
    req: Request,
    ctx: RouterContext<XContext & CTXCookie & CTXBody & CTXAuth & CTXSession>,
  ) => SQL | SQLWrapper | undefined;

  /**
   * called before querying or inserting or updating in the database
   */
  beforeQuery?: (
    req: Request,
    ctx: RouterContext<
      XContext & CTXCookie & CTXBody & CTXAuth & CTXSession & { result: any }
    >,
  ) => void | Promise<void>;

  /**
   * called after querying or inserting or updating in the database
   */
  afterQuery?: (
    req: Request,
    ctx: RouterContext<
      XContext & CTXCookie & CTXBody & CTXAuth & CTXSession & { result: any }
    >,
  ) => void | Promise<void>;

  /**
   * called after an error occured while trying to execute query in the database
   */
  onQueryError?: (
    req: Request,
    ctx: RouterContext<
      XContext & CTXCookie & CTXBody & CTXAuth & CTXSession & { result: any }
    >,
  ) => void | Promise<void>;
};

export type QueryAuthEntry<
  S extends Record<string, Table>,
  K extends keyof S,
  omit extends keyof _QueryAuthEntry<S, K> = never,
  XContext = {},
> = Omit<_QueryAuthEntry<S, K, XContext>, omit>;

type ROLES = "guest" | "mine" | "allUsers" | UserRole;

export type QueryAuth<S extends Record<string, Table>, XContext = {}> = {
  [K in keyof S as S[K] extends Table ? K : never]?: Partial<{
    GET: Partial<
      Record<
        ROLES,
        QueryAuthEntry<S, K, "validateBody" | "injectBody", XContext>
      >
    >;
    POST: Partial<
      Record<ROLES, QueryAuthEntry<S, K, "include" | "where", XContext>>
    >;
    PUT: Partial<Record<ROLES, QueryAuthEntry<S, K, "include", XContext>>>;
    PATCH: Partial<Record<ROLES, QueryAuthEntry<S, K, "include", XContext>>>;
    DELETE: Partial<Record<ROLES, QueryAuthEntry<S, K, "include", XContext>>>;
  }>;
};

export type QueryAuthEntries<
  S extends Record<string, Table>,
  T extends keyof S,
  omit extends keyof _QueryAuthEntry<S, T> = never,
  XContext = {},
> = Partial<Record<ROLES, QueryAuthEntry<S, T, omit, XContext>>>;

export const pick = <
  T extends Table | Record<string, unknown>,
  P extends Array<keyof (T extends Table ? T : T)>,
>(
  table: T,
  fields: P,
  // ): Pick<T, P[number]> => {
): Pick<T extends Table ? T : T, P[number]> => {
  const picked = {} as Pick<T extends Table ? T : T, P[number]>;
  for (const field of fields) {
    picked[field] = table[field];
  }
  return picked;
};

export const omit = <
  T extends Table | Record<string, unknown>,
  O extends Array<keyof (T extends Table ? T : T)>,
>(
  table: T,
  fields: O,
  // ): Omit<T, O[number]> => {
): Omit<T extends Table ? T : T, O[number]> => {
  const picked = { ...table } as T extends Table ? T : T;
  for (const field of fields) {
    delete picked[field];
  }
  return picked as Omit<T extends Table ? T : T, O[number]>;
};

type({
  a: "string.json.parse",
});

export const mapArkDataType = (dataType: string) => {
  let typeStr;
  switch (dataType) {
    case "string":
    case "text":
    case "varchar":
    case "char":
      typeStr = "string";
      break;
    case "number":
    case "integer":
    case "real":
    case "double":
    case "decimal":
      typeStr = "number";
      break;
    case "boolean":
      typeStr = "boolean";
      break;
    case "date":
    case "timestamp":
      typeStr = "string.date.parse";
      break;
    case "json":
      typeStr = "object|object[]";
      break;
    default:
      typeStr = "unknown";
  }
  return typeStr;
};

export const mapToArkType = (column: any) => {
  const config = column.config;
  const typeStr =
    column.dataType !== "custom"
      ? mapArkDataType(column.dataType)
      : config.customTypeParams?.dataType()
        ? mapArkDataType(config.customTypeParams.dataType())
        : "unknown";
  return column.notNull ? typeStr : `${typeStr} | null`;
};

export const genArkSchema = <T extends Table | Record<string, unknown>>(
  table: T,
  optional?: Partial<Record<keyof T, boolean | number>> | boolean,
): Type<T> => {
  const columnEntries = Object.entries(table).filter(([k, v]) => {
    return typeof k === "string" && typeof v === "object";
  });
  const entries = columnEntries.map(([key, column]) => {
    const opt =
      optional === true ||
      (typeof optional === "object" && optional[key as keyof T])
        ? "?"
        : "";
    return [`${key}${opt}`, `${mapToArkType(column)}`];
  });
  return type(Object.fromEntries(entries));
  // .pipe((b) => {
  //   return pick(b, Object.keys(table));
  // });
};

export const genArkSchemaValidator = <
  T extends Table | Record<string, unknown>,
  I extends Record<string, unknown>,
  R extends Record<string, unknown>,
>(
  table: T,
  optional?: Partial<Record<keyof T, boolean | number>> | boolean,
) => {
  const sch = genArkSchema<T>(table, optional);
  return (body: I): ArkErrors | R => sch(body);
};

export const parseArkSchema = <
  D,
  T extends Table | Record<string, unknown> | Array<Record<string, unknown>>,
>(
  data: D,
  table: T,
  optional?: Record<keyof T, boolean | number> | boolean,
): D => genArkSchema(table, optional)(data) as D;
