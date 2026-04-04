// services/organization.employees.service.ts

import { and, eq } from "drizzle-orm";
import { Employee, EmployeeInit, EmployeePure, EmployeeUpdate } from "~/base";
import { db } from "~/db";
import { employees, organizations, users } from "~/db/schema";
import {
  employeeWithOrganizationSelect,
  employeeWithUserSelect,
  fullEmployeeSelect,
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
  ): Promise<Omit<Employee, "user" | "organization">[]> {
    const employeesResult = (await db
      .select(pureEmployeeSelect)
      .from(employees)
      .where(
        and(
          eq(employees.organizationId, organizationId),
          eq(employees.userId, employeeId),
        ),
      )
      .limit(1)) as Omit<Employee, "user" | "organization">[];
    return employeesResult;
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
}
