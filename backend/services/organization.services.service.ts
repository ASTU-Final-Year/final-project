// services/organization.services.service.ts
import { and, eq, sql } from "drizzle-orm";
import {
  OrganizationService,
  OrganizationServiceInit,
  OrganizationServicePure,
  OrganizationServiceUpdate,
  OrganizationServiceWithCalendar,
  OrganizationServiceWithOrganization,
} from "~/base";
import { db } from "~/db";
import {
  organizationCalendars,
  organizations,
  organizationServices,
} from "~/db/schema";
import {
  fullOrganizationServiceSelect,
  organizationServiceWithCalendarSelect,
  organizationServiceWithOrganizationSelect,
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

  static async getAllServicesByOrganizationid(
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

  static async getAllServicesByOrganizationidPure(
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

  static async getServiceByIdByOrganizationId(
    serviceId: string,
    organizationId: string,
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
}
