// services/organization.services.service.ts
import { and, eq, sql } from "drizzle-orm";
import {
  OrganizationService,
  OrganizationServiceFirstEmployee,
  OrganizationServiceFirstEmployeeInit,
  OrganizationServiceFirstEmployeePure,
  OrganizationServiceFirstEmployeeWithEmployee,
  OrganizationServiceFirstEmployeeWithService,
  OrganizationServiceInit,
  OrganizationServicePure,
  OrganizationServiceUpdate,
  OrganizationServiceWithCalendar,
  OrganizationServiceWithOrganization,
} from "~/base";
import { db } from "~/db";
import {
  employees,
  organizationCalendars,
  organizations,
  organizationServices,
  serviceFirstEmployees,
  users,
} from "~/db/schema";
import {
  fullOrganizationServiceFirstEmployeeSelect,
  fullOrganizationServiceSelect,
  fullPublicOrganizationServiceSelect,
  organizationServiceFirstEmployeesWithFirstEmployeeSelect,
  organizationServiceFirstEmployeesWithServiceSelect,
  organizationServiceWithCalendarSelect,
  organizationServiceWithOrganizationSelect,
  publicOrganizationServiceWithOrganizationSelect,
  pureOrganizationServiceFirstEmployeeSelect,
  pureOrganizationServiceSelect,
} from "./selects";

export default class OrganizationServicesService {
  //
  // Services
  //
  static async createService(
    serviceInit: OrganizationServiceInit,
  ): Promise<OrganizationServicePure> {
    const [service] = await db
      .insert(organizationServices)
      .values(serviceInit)
      .returning();
    return service;
  }

  static async getAllServices({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }): Promise<OrganizationService[]> {
    const servicesResult = (await db
      .select(fullOrganizationServiceSelect)
      .from(organizationServices)
      .innerJoin(
        organizations,
        eq(organizationServices.organizationId, organizations.id),
      )
      .leftJoin(
        organizationCalendars,
        eq(organizationServices.calendarId, organizationCalendars.id),
      )
      .limit(limit)
      .offset(offset)) as OrganizationService[];
    return servicesResult;
  }

  static async getAllServicesWithOrganization({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }): Promise<OrganizationServiceWithOrganization[]> {
    const servicesResult = await db
      .select(organizationServiceWithOrganizationSelect)
      .from(organizationServices)
      .innerJoin(
        organizations,
        eq(organizationServices.organizationId, organizations.id),
      )
      .limit(limit)
      .offset(offset);
    return servicesResult;
  }

  static async getAllServicesWithCalendar({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }): Promise<OrganizationServiceWithCalendar[]> {
    const servicesResult = (await db
      .select(organizationServiceWithCalendarSelect)
      .from(organizationServices)
      .innerJoin(
        organizationCalendars,
        eq(organizationServices.calendarId, organizationCalendars.id),
      )
      .limit(limit)
      .offset(offset)) as OrganizationServiceWithCalendar[];
    return servicesResult;
  }

  static async getAllServicesPure({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }): Promise<OrganizationServicePure[]> {
    const servicesResult = await db
      .select(pureOrganizationServiceSelect)
      .from(organizationServices)
      .limit(limit)
      .offset(offset);
    return servicesResult;
  }

  static async getAllServicesByOrganizationId(
    organizationId: string,
    {
      offset,
      limit,
    }: {
      offset: number;
      limit: number;
    },
  ): Promise<OrganizationService[]> {
    const servicesResult = (await db
      .select(fullOrganizationServiceSelect)
      .from(organizationServices)
      .innerJoin(
        organizations,
        eq(organizationServices.organizationId, organizations.id),
      )
      .leftJoin(
        organizationCalendars,
        eq(organizationServices.calendarId, organizationCalendars.id),
      )
      .where(eq(organizationServices.organizationId, organizationId))
      .limit(limit)
      .offset(offset)) as OrganizationService[];
    return servicesResult;
  }

  static async getAllServicesByOrganizationIdPublic(
    organizationId: string,
    {
      offset,
      limit,
    }: {
      offset: number;
      limit: number;
    },
  ): Promise<OrganizationService[]> {
    const servicesResult = (await db
      .select(fullPublicOrganizationServiceSelect)
      .from(organizationServices)
      .innerJoin(
        organizations,
        eq(organizationServices.organizationId, organizations.id),
      )
      .leftJoin(
        organizationCalendars,
        eq(organizationServices.calendarId, organizationCalendars.id),
      )
      .where(eq(organizationServices.organizationId, organizationId))
      .limit(limit)
      .offset(offset)) as OrganizationService[];
    return servicesResult;
  }

  static async getAllServicesWithOrganizationByOrganizationid(
    organizationId: string,
    {
      offset,
      limit,
    }: {
      offset: number;
      limit: number;
    },
  ): Promise<OrganizationServiceWithOrganization[]> {
    const servicesResult = (await db
      .select(organizationServiceWithOrganizationSelect)
      .from(organizationServices)
      .innerJoin(
        organizations,
        eq(organizationServices.organizationId, organizations.id),
      )
      .where(eq(organizationServices.organizationId, organizationId))
      .limit(limit)
      .offset(offset)) as OrganizationServiceWithOrganization[];
    return servicesResult;
  }

  static async getAllServicesWithOrganizationByOrganizationidPublic(
    organizationId: string,
    {
      offset,
      limit,
    }: {
      offset: number;
      limit: number;
    },
  ): Promise<OrganizationServiceWithOrganization[]> {
    const servicesResult = (await db
      .select(publicOrganizationServiceWithOrganizationSelect)
      .from(organizationServices)
      .innerJoin(
        organizations,
        eq(organizationServices.organizationId, organizations.id),
      )
      .where(eq(organizationServices.organizationId, organizationId))
      .limit(limit)
      .offset(offset)) as OrganizationServiceWithOrganization[];
    return servicesResult;
  }

  static async getAllServicesWithCalendarByOrganizationid(
    organizationId: string,
    {
      offset,
      limit,
    }: {
      offset: number;
      limit: number;
    },
  ): Promise<OrganizationServiceWithCalendar[]> {
    const servicesResult = (await db
      .select(organizationServiceWithCalendarSelect)
      .from(organizationServices)
      .leftJoin(
        organizationCalendars,
        eq(organizationServices.calendarId, organizationCalendars.id),
      )
      .where(eq(organizationServices.organizationId, organizationId))
      .limit(limit)
      .offset(offset)) as OrganizationServiceWithCalendar[];
    return servicesResult;
  }

  static async getAllServicesByOrganizationIdPure(
    organizationId: string,
    {
      offset,
      limit,
    }: {
      offset: number;
      limit: number;
    },
  ): Promise<OrganizationServicePure[]> {
    const servicesResult = await db
      .select(pureOrganizationServiceSelect)
      .from(organizationServices)
      .where(eq(organizationServices.organizationId, organizationId))
      .limit(limit)
      .offset(offset);
    return servicesResult;
  }

  static async getServiceCountByOrganizationId(
    organizationId: string,
  ): Promise<number> {
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(organizationServices)
      .where(eq(organizationServices.organizationId, organizationId));
    return countResult[0]?.count ?? 0;
  }

  static async getServiceById(
    serviceId: string,
  ): Promise<OrganizationService | undefined> {
    const [serviceResult] = (await db
      .select(fullOrganizationServiceSelect)
      .from(organizationServices)
      .innerJoin(
        organizations,
        eq(organizationServices.organizationId, organizations.id),
      )
      .leftJoin(
        organizationCalendars,
        eq(organizationServices.calendarId, organizationCalendars.id),
      )
      .where(eq(organizationServices.id, serviceId))
      .limit(1)) as OrganizationService[];
    return serviceResult;
  }

  static async getServiceByIdPure(
    serviceId: string,
  ): Promise<OrganizationServicePure | undefined> {
    const [serviceResult] = await db
      .select(pureOrganizationServiceSelect)
      .from(organizationServices)
      .where(eq(organizationServices.id, serviceId))
      .limit(1);
    return serviceResult;
  }
  static async getServiceByIdByOrganizationIdWithCalendarByOrganizationid(
    serviceId: string,
    organizationId: string,
  ): Promise<OrganizationServiceWithCalendar | undefined> {
    const [serviceResult] = (await db
      .select(organizationServiceWithCalendarSelect)
      .from(organizationServices)
      .leftJoin(
        organizationCalendars,
        eq(organizationServices.calendarId, organizationCalendars.id),
      )
      .where(
        and(
          eq(organizationServices.id, serviceId),
          eq(organizationServices.organizationId, organizationId),
        ),
      )
      .limit(1)) as OrganizationServiceWithCalendar[];
    return serviceResult;
  }

  static async getServiceByIdByOrganizationIdWithOrganizationByOrganizationid(
    serviceId: string,
    organizationId: string,
  ): Promise<OrganizationServiceWithOrganization | undefined> {
    const [serviceResult] = (await db
      .select(organizationServiceWithOrganizationSelect)
      .from(organizationServices)
      .leftJoin(
        organizations,
        eq(organizationServices.organizationId, organizations.id),
      )
      .where(
        and(
          eq(organizationServices.id, serviceId),
          eq(organizationServices.organizationId, organizationId),
        ),
      )
      .limit(1)) as OrganizationServiceWithOrganization[];
    return serviceResult;
  }

  static async getServiceByIdByOrganizationIdWithOrganizationByOrganizationidPublic(
    serviceId: string,
    organizationId: string,
  ): Promise<OrganizationServiceWithOrganization | undefined> {
    const [serviceResult] = (await db
      .select(publicOrganizationServiceWithOrganizationSelect)
      .from(organizationServices)
      .leftJoin(
        organizations,
        eq(organizationServices.organizationId, organizations.id),
      )
      .where(
        and(
          eq(organizationServices.id, serviceId),
          eq(organizationServices.organizationId, organizationId),
        ),
      )
      .limit(1)) as OrganizationServiceWithOrganization[];
    return serviceResult;
  }

  static async getServiceByIdByOrganizationIdPublic(
    serviceId: string,
    organizationId: string,
  ): Promise<OrganizationService | undefined> {
    const [serviceResult] = (await db
      .select(fullPublicOrganizationServiceSelect)
      .from(organizationServices)
      .leftJoin(
        organizations,
        eq(organizationServices.organizationId, organizations.id),
      )
      .leftJoin(
        organizationCalendars,
        eq(organizationServices.calendarId, organizationCalendars.id),
      )
      .where(
        and(
          eq(organizationServices.id, serviceId),
          eq(organizationServices.organizationId, organizationId),
        ),
      )
      .limit(1)) as OrganizationService[];
    return serviceResult;
  }

  static async getServiceByIdByOrganizationId(
    serviceId: string,
    organizationId: string,
  ): Promise<OrganizationService | undefined> {
    const [serviceResult] = (await db
      .select(fullOrganizationServiceSelect)
      .from(organizationServices)
      .leftJoin(
        organizations,
        eq(organizationServices.organizationId, organizations.id),
      )
      .leftJoin(
        organizationCalendars,
        eq(organizationServices.calendarId, organizationCalendars.id),
      )
      .where(
        and(
          eq(organizationServices.id, serviceId),
          eq(organizationServices.organizationId, organizationId),
        ),
      )
      .limit(1)) as OrganizationService[];
    return serviceResult;
  }

  static async getServiceByIdByOrganizationIdPure(
    serviceId: string,
    organizationId: string,
  ): Promise<OrganizationServicePure | undefined> {
    const [serviceResult] = await db
      .select(pureOrganizationServiceSelect)
      .from(organizationServices)
      .where(
        and(
          eq(organizationServices.id, serviceId),
          eq(organizationServices.organizationId, organizationId),
        ),
      )
      .limit(1);
    return serviceResult;
  }

  static async updateService(
    serviceUpdate: OrganizationServiceUpdate,
  ): Promise<OrganizationServicePure> {
    const [service] = await db
      .update(organizationServices)
      .set({ ...serviceUpdate, updatedAt: new Date() })
      .where(eq(organizationServices.id, serviceUpdate.id))
      .returning();
    return service;
  }

  static async deleteServiceById(serviceId: string): Promise<void> {
    await db
      .delete(organizationServices)
      .where(eq(organizationServices.id, serviceId));
  }

  //
  // ServicesFirstEmployees
  //
  static async addServiceFirstEmployee(
    serviceFirstEmployeeInit: OrganizationServiceFirstEmployeeInit,
  ): Promise<OrganizationServiceFirstEmployeePure[]> {
    const firstEmployees = await db
      .insert(serviceFirstEmployees)
      .values(serviceFirstEmployeeInit)
      .returning();
    return firstEmployees;
  }

  static async getFirstEmployeesCountById(serviceId: string): Promise<number> {
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(serviceFirstEmployees)
      .where(eq(serviceFirstEmployees.serviceId, serviceId));
    return countResult[0]?.count ?? 0;
  }

  static async getAllServiceFirstEmployeesByServiceId(
    serviceId: string,
    {
      offset,
      limit,
    }: {
      offset: number;
      limit: number;
    },
  ): Promise<OrganizationServiceFirstEmployee[]> {
    const servicesResult = (await db
      .select(fullOrganizationServiceFirstEmployeeSelect)
      .from(serviceFirstEmployees)
      .innerJoin(
        organizationServices,
        eq(organizationServices.id, serviceFirstEmployees.serviceId),
      )
      .leftJoin(
        employees,
        eq(employees.userId, serviceFirstEmployees.employeeId),
      )
      .leftJoin(users, eq(users.id, serviceFirstEmployees.employeeId))
      .where(eq(serviceFirstEmployees.serviceId, serviceId))
      .limit(limit)
      .offset(offset)) as unknown as OrganizationServiceFirstEmployee[];
    return servicesResult;
  }

  static async getAllServiceFirstEmployeesWithServiceByServiceId(
    serviceId: string,
    {
      offset,
      limit,
    }: {
      offset: number;
      limit: number;
    },
  ): Promise<OrganizationServiceFirstEmployeeWithService[]> {
    const servicesResult = (await db
      .select(organizationServiceFirstEmployeesWithServiceSelect)
      .from(serviceFirstEmployees)
      .innerJoin(
        organizationServices,
        eq(organizationServices.id, serviceFirstEmployees.serviceId),
      )
      .leftJoin(users, eq(users.id, serviceFirstEmployees.employeeId))
      .where(eq(serviceFirstEmployees.serviceId, serviceId))
      .limit(limit)
      .offset(
        offset,
      )) as unknown as OrganizationServiceFirstEmployeeWithService[];
    return servicesResult;
  }

  static async getAllServiceFirstEmployeesWithFirstEmployeesByServiceId(
    serviceId: string,
    {
      offset,
      limit,
    }: {
      offset: number;
      limit: number;
    },
  ): Promise<OrganizationServiceFirstEmployeeWithEmployee[]> {
    const servicesResult = (await db
      .select(organizationServiceFirstEmployeesWithFirstEmployeeSelect)
      .from(serviceFirstEmployees)
      .leftJoin(
        employees,
        eq(employees.userId, serviceFirstEmployees.employeeId),
      )
      .leftJoin(users, eq(users.id, serviceFirstEmployees.employeeId))
      .where(eq(serviceFirstEmployees.serviceId, serviceId))
      .limit(limit)
      .offset(
        offset,
      )) as unknown as OrganizationServiceFirstEmployeeWithEmployee[];
    return servicesResult;
  }

  static async getAllServiceFirstEmployeesPureByServiceId(
    serviceId: string,
    {
      offset,
      limit,
    }: {
      offset: number;
      limit: number;
    },
  ): Promise<OrganizationServiceFirstEmployeePure[]> {
    const servicesResult = (await db
      .select(pureOrganizationServiceFirstEmployeeSelect)
      .from(serviceFirstEmployees)
      .where(eq(serviceFirstEmployees.serviceId, serviceId))
      .limit(limit)
      .offset(offset)) as OrganizationServiceFirstEmployeePure[];
    return servicesResult;
  }

  /////

  static async getServiceFirstEmployeesByServiceId(
    serviceId: string,
    employeeId: string,
  ): Promise<OrganizationServiceFirstEmployee> {
    const [service] = (await db
      .select(fullOrganizationServiceFirstEmployeeSelect)
      .from(serviceFirstEmployees)
      .innerJoin(
        organizationServices,
        eq(organizationServices.id, serviceFirstEmployees.serviceId),
      )
      .leftJoin(
        employees,
        eq(employees.userId, serviceFirstEmployees.employeeId),
      )
      .where(
        and(
          eq(serviceFirstEmployees.serviceId, serviceId),
          eq(serviceFirstEmployees.employeeId, employeeId),
        ),
      )
      .limit(1)) as unknown as OrganizationServiceFirstEmployee[];
    return service;
  }

  static async getServiceFirstEmployeesWithServiceByServiceId(
    serviceId: string,
    employeeId: string,
  ): Promise<OrganizationServiceFirstEmployeeWithService> {
    const [service] = (await db
      .select(organizationServiceFirstEmployeesWithServiceSelect)
      .from(serviceFirstEmployees)
      .innerJoin(
        organizationServices,
        eq(organizationServices.id, serviceFirstEmployees.serviceId),
      )
      .where(
        and(
          eq(serviceFirstEmployees.serviceId, serviceId),
          eq(serviceFirstEmployees.employeeId, employeeId),
        ),
      )
      .limit(1)) as unknown as OrganizationServiceFirstEmployeeWithService[];
    return service;
  }

  static async getServiceFirstEmployeesWithFirstEmployeesByServiceId(
    serviceId: string,
    employeeId: string,
  ): Promise<OrganizationServiceFirstEmployeeWithEmployee> {
    const [service] = (await db
      .select(organizationServiceFirstEmployeesWithFirstEmployeeSelect)
      .from(serviceFirstEmployees)
      .leftJoin(
        employees,
        eq(employees.userId, serviceFirstEmployees.employeeId),
      )
      .where(
        and(
          eq(serviceFirstEmployees.serviceId, serviceId),
          eq(serviceFirstEmployees.employeeId, employeeId),
        ),
      )
      .limit(1)) as unknown as OrganizationServiceFirstEmployeeWithEmployee[];
    return service;
  }

  static async getServiceFirstEmployeesPureByServiceId(
    serviceId: string,
    employeeId: string,
  ): Promise<OrganizationServiceFirstEmployeePure> {
    const [service] = (await db
      .select(pureOrganizationServiceFirstEmployeeSelect)
      .from(serviceFirstEmployees)
      .where(
        and(
          eq(serviceFirstEmployees.serviceId, serviceId),
          eq(serviceFirstEmployees.employeeId, employeeId),
        ),
      )
      .limit(1)) as OrganizationServiceFirstEmployeePure[];
    return service;
  }

  static async deleteServiceFirstEmployeesByIds(
    serviceId: string,
    employeeId: string,
  ): Promise<OrganizationServiceFirstEmployeePure> {
    const [result] = await db
      .delete(serviceFirstEmployees)
      .where(
        and(
          eq(serviceFirstEmployees.serviceId, serviceId),
          eq(serviceFirstEmployees.employeeId, employeeId),
        ),
      )
      .returning();
    return result;
  }

  static async deleteAllServiceFirstEmployeesByServiceId(
    serviceId: string,
  ): Promise<OrganizationServiceFirstEmployeePure[]> {
    const results = await db
      .delete(serviceFirstEmployees)
      .where(and(eq(serviceFirstEmployees.serviceId, serviceId)))
      .returning();
    return results;
  }
}
