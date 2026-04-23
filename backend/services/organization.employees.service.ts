// services/organization.employees.service.ts

import { and, eq, isNotNull, sql } from "drizzle-orm";
import {
  Employee,
  EmployeeCalendar,
  EmployeeCalendarInit,
  EmployeeCalendarPure,
  EmployeeCalendarUpdate,
  EmployeeInit,
  EmployeePure,
  EmployeeUpdate,
  EmployeeWithCalendar,
  EmployeeWithOrganization,
} from "~/base";
import { db } from "~/db";
import {
  employeeCalendars,
  employees,
  organizations,
  users,
} from "~/db/schema";
import {
  employeeWithCalendarSelect,
  employeeWithOrganizationSelect,
  employeeWithUserSelect,
  fullEmployeeCalendarSelect,
  fullEmployeeSelect,
  pureEmployeeCalendarSelect,
  pureEmployeeSelect,
} from "./selects";

export default class OrganizationEmployeesService {
  static async createEmployee(
    employeeInit: EmployeeInit,
  ): Promise<EmployeePure> {
    const [employee] = await db
      .insert(employees)
      .values({
        jobTitle: employeeInit.jobTitle,
        jobDescription: employeeInit.jobDescription,
        userId: employeeInit.userId,
        organizationId: employeeInit.organizationId,
      })
      .returning();
    return employee;
  }

  static async getAllEmployeesPureByOrganizationId(
    organizationId: string,
    {
      offset,
      limit,
    }: {
      offset: number;
      limit: number;
    },
  ): Promise<Omit<Employee, "user" | "organization">[]> {
    const employeesResult = (await db
      .select(pureEmployeeSelect)
      .from(employees)
      .where(eq(employees.organizationId, organizationId))
      .limit(limit)
      .offset(offset)) as Omit<Employee, "user" | "organization">[];
    return employeesResult;
  }

  static async getEmployeeCountByOrganizationId(
    organizationId: string,
  ): Promise<number> {
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(employees)
      .where(eq(employees.organizationId, organizationId));
    return countResult[0]?.count ?? 0;
  }

  static async getAllEmployeesByOrganizationId(
    organizationId: string,
    {
      offset,
      limit,
    }: {
      offset: number;
      limit: number;
    },
  ): Promise<Employee[]> {
    const employeesResult = (await db
      .select(fullEmployeeSelect)
      .from(employees)
      .leftJoin(users, eq(employees.userId, users.id))
      .innerJoin(organizations, eq(employees.organizationId, organizations.id))
      .leftJoin(
        employeeCalendars,
        eq(employees.calendarId, employeeCalendars.id),
      )
      .where(eq(employees.organizationId, organizationId))
      .limit(limit)
      .offset(offset)) as Employee[];
    return employeesResult;
  }

  static async getAllEmployeesWithUserByOrganizationId(
    organizationId: string,
    {
      offset,
      limit,
    }: {
      offset: number;
      limit: number;
    },
  ): Promise<Omit<Employee, "organization">[]> {
    const employeesResult = (await db
      .select(employeeWithUserSelect)
      .from(employees)
      .leftJoin(users, eq(employees.userId, users.id))
      .where(eq(employees.organizationId, organizationId))
      .limit(limit)
      .offset(offset)) as Omit<Employee, "organization">[];
    return employeesResult;
  }

  static async getAllEmployeesWithOrganizationByOrganizationId(
    organizationId: string,
    {
      offset,
      limit,
    }: {
      offset: number;
      limit: number;
    },
  ): Promise<EmployeeWithOrganization[]> {
    const employeesResult = (await db
      .select(employeeWithOrganizationSelect)
      .from(employees)
      .leftJoin(organizations, eq(employees.organizationId, organizations.id))
      .where(eq(employees.organizationId, organizationId))
      .limit(limit)
      .offset(offset)) as EmployeeWithOrganization[];
    return employeesResult;
  }

  static async getAllEmployeesWithCalendarByOrganizationId(
    organizationId: string,
    {
      offset,
      limit,
    }: {
      offset: number;
      limit: number;
    },
  ): Promise<EmployeeWithCalendar[]> {
    const employeesResult = (await db
      .select(employeeWithCalendarSelect)
      .from(employees)
      .leftJoin(
        employeeCalendars,
        eq(employees.calendarId, employeeCalendars.id),
      )
      .where(eq(employees.organizationId, organizationId))
      .limit(limit)
      .offset(offset)) as EmployeeWithCalendar[];
    return employeesResult;
  }

  static async getEmployeeByIdByOrganizationId(
    organizationId: string,
    employeeId: string,
  ): Promise<Employee> {
    const [employee] = (await db
      .select(fullEmployeeSelect)
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .innerJoin(organizations, eq(employees.organizationId, organizations.id))
      .leftJoin(
        employeeCalendars,
        eq(employees.calendarId, employeeCalendars.id),
      )
      .where(
        and(
          eq(employees.organizationId, organizationId),
          eq(employees.id, employeeId),
        ),
      )
      .limit(1)) as Employee[];
    return employee;
  }

  static async getEmployeeByIdByOrganizationIdPure(
    organizationId: string,
    employeeId: string,
  ): Promise<Omit<Employee, "user" | "organization">> {
    const [employee] = (await db
      .select(pureEmployeeSelect)
      .from(employees)
      .where(
        and(
          eq(employees.organizationId, organizationId),
          eq(employees.id, employeeId),
        ),
      )
      .limit(1)) as Omit<Employee, "user" | "organization">[];
    return employee;
  }

  static async getEmployeeByEmailPureByOrganizationId(
    organizationId: string,
    employeeEmail: string,
  ): Promise<Omit<Employee, "user" | "organization">> {
    const [employee] = (await db
      .select(pureEmployeeSelect)
      .from(employees)
      .leftJoin(users, eq(employees.userId, users.id))
      .where(
        and(
          eq(employees.organizationId, organizationId),
          eq(users.email, employeeEmail),
        ),
      )
      .limit(1)) as Omit<Employee, "user" | "organization">[];
    return employee;
  }

  static async getEmployeeByEmail(
    email: string,
  ): Promise<Employee | undefined> {
    const [employee] = (await db
      .select(fullEmployeeSelect)
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .leftJoin(organizations, eq(employees.organizationId, organizations.id))
      .where(eq(users.email, email))) as Employee[];
    return employee;
  }

  static async getEmployeeById(
    employeeId: string,
  ): Promise<Employee | undefined> {
    const [employee] = (await db
      .select(fullEmployeeSelect)
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .leftJoin(organizations, eq(employees.organizationId, organizations.id))
      .where(eq(employees.id, employeeId))) as Employee[];
    return employee;
  }

  static async hasEmployeeByEmail(email: string): Promise<boolean> {
    const [employee] = await db
      .select({ email: users.email })
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .leftJoin(organizations, eq(employees.organizationId, organizations.id))
      .where(eq(users.email, email));
    return employee.email == email;
  }

  static async hasEmployeeById(employeeId: string): Promise<boolean> {
    const [employee] = await db
      .select({ id: employees.id })
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .leftJoin(organizations, eq(employees.organizationId, organizations.id))
      .where(eq(employees.id, employeeId));
    return employee?.id === employeeId;
  }

  static async updateEmployeeById(
    employeeUpdate: EmployeeUpdate,
  ): Promise<EmployeePure> {
    const { id, ...employeeUpdateSafe } = employeeUpdate;
    const [employee] = await db
      .update(employees)
      .set({ ...employeeUpdateSafe, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();
    return employee;
  }

  static async deleteEmployeeById(employeeId: string): Promise<void> {
    await db.delete(employees).where(eq(employees.userId, employeeId));
  }

  //
  // Calendar
  //
  static async createCalendar(
    calendarInit: EmployeeCalendarInit,
  ): Promise<EmployeeCalendar> {
    const [calendar] = (await db
      .insert(employeeCalendars)
      .values({
        name: calendarInit.name,
        description: calendarInit.description,
        employeeId: calendarInit.employeeId,
        available: calendarInit.available,
        unavailable: calendarInit.unavailable,
      })
      .returning()) as EmployeeCalendar[];
    return calendar;
  }

  static async getAllCalendarsByEmployeeId(
    employeeId: string,
    {
      offset,
      limit,
    }: {
      offset: number;
      limit: number;
    },
  ): Promise<EmployeeCalendar[]> {
    const calendarsResult = (await db
      .select(fullEmployeeCalendarSelect)
      .from(employeeCalendars)
      .leftJoin(employees, eq(employeeCalendars.employeeId, employees.userId))
      .where(eq(employeeCalendars.employeeId, employeeId))
      .limit(limit)
      .offset(offset)) as EmployeeCalendar[];
    return calendarsResult;
  }

  static async getAllCalendarsByEmployeeIdPure(
    employeeId: string,
    {
      offset,
      limit,
    }: {
      offset: number;
      limit: number;
    },
  ): Promise<EmployeeCalendarPure[]> {
    const calendarsResult = (await db
      .select(pureEmployeeCalendarSelect)
      .from(employeeCalendars)
      .leftJoin(employees, eq(employeeCalendars.employeeId, employees.userId))
      .where(eq(employeeCalendars.employeeId, employeeId))
      .limit(limit)
      .offset(offset)) as EmployeeCalendarPure[];
    return calendarsResult;
  }

  static async getCalendarCountByEmployeeId(
    employeeId: string,
  ): Promise<number> {
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(employeeCalendars)
      .where(eq(employeeCalendars.employeeId, employeeId));
    return countResult[0]?.count ?? 0;
  }

  static async getCalendarById(calendarId: string): Promise<EmployeeCalendar> {
    const [calendar] = (await db
      .select()
      .from(employeeCalendars)
      .where(eq(employeeCalendars.id, calendarId))
      .limit(1)) as EmployeeCalendar[];
    return calendar;
  }

  static async getCalendarByIdByEmployeeId(
    calendarId: string,
    employeeId: string,
  ): Promise<EmployeeCalendar> {
    const [calendar] = (await db
      .select()
      .from(employeeCalendars)
      .where(
        and(
          eq(employeeCalendars.id, calendarId),
          eq(employeeCalendars.employeeId, employeeId),
        ),
      )
      .limit(1)) as EmployeeCalendar[];
    return calendar;
  }

  static async updateCalendar(
    calendarUpdate: EmployeeCalendarUpdate,
  ): Promise<EmployeeCalendar> {
    const [calendar] = (await db
      .update(employeeCalendars)
      .set({
        available: calendarUpdate.available,
        unavailable: calendarUpdate.unavailable,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(employeeCalendars.id, calendarUpdate.id),
          eq(employeeCalendars.employeeId, calendarUpdate.employeeId),
        ),
      )
      .returning()) as EmployeeCalendar[];
    return calendar;
  }

  static async deleteCalendarById(calendarId: string): Promise<void> {
    await db
      .delete(employeeCalendars)
      .where(eq(employeeCalendars.id, calendarId));
  }
}
