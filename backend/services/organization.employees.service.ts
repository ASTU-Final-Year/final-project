// services/organization.employees.service.ts

import { and, eq } from "drizzle-orm";
import {
  Employee,
  EmployeeCalendar,
  EmployeeCalendarInit,
  EmployeeCalendarPure,
  EmployeeCalendarUpdate,
  EmployeeInit,
  EmployeePure,
  EmployeeUpdate,
} from "~/base";
import { db } from "~/db";
import {
  employeeCalendars,
  employees,
  organizations,
  users,
} from "~/db/schema";
import {
  employeeWithOrganizationSelect,
  employeeWithUserSelect,
  fullEmployeeCalendarSelect,
  fullEmployeeSelect,
  pureEmployeeCalendarSelect,
  pureEmployeeSelect,
} from "./selects";
import calendar from "~/routes/api/v1/organization/[id]/calendar";

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
      .leftJoin(organizations, eq(employees.organizationId, organizations.id))
      .rightJoin(users, eq(employees.userId, users.id))
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
      .rightJoin(users, eq(employees.userId, users.id))
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
  ): Promise<Omit<Employee, "user">[]> {
    const employeesResult = (await db
      .select(employeeWithOrganizationSelect)
      .from(employees)
      .leftJoin(organizations, eq(employees.organizationId, organizations.id))
      .where(eq(employees.organizationId, organizationId))
      .limit(limit)
      .offset(offset)) as Omit<Employee, "user">[];
    return employeesResult;
  }

  static async getEmployeeByIdPureByOrganizationId(
    organizationId: string,
    employeeId: string,
  ): Promise<Omit<Employee, "user" | "organization">> {
    const [employee] = (await db
      .select(pureEmployeeSelect)
      .from(employees)
      .where(
        and(
          eq(employees.organizationId, organizationId),
          eq(employees.userId, employeeId),
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
      .where(eq(employees.userId, employeeId))) as Employee[];
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
      .select({ userId: employees.userId })
      .from(employees)
      .innerJoin(users, eq(employees.userId, users.id))
      .leftJoin(organizations, eq(employees.organizationId, organizations.id))
      .where(eq(employees.userId, employeeId));
    return employee?.userId === employeeId;
  }

  static async updateEmployeeById(
    employeeUpdate: EmployeeUpdate,
  ): Promise<EmployeePure> {
    const { userId, ...employeeUpdateSafe } = employeeUpdate;
    const [employee] = await db
      .update(employees)
      .set({ ...employeeUpdateSafe, updatedAt: new Date() })
      .where(eq(employees.userId, employeeUpdate.userId))
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
