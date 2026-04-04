// services/organization.service.ts

import { eq, sql } from "drizzle-orm";
import {
  Organization,
  OrganizationInit,
  OrganizationPure,
  OrganizationUpdate,
} from "~/base";
import { config, employeeHireJwt, securityConfig } from "~/config";
import { db } from "~/db";
import { employees, organizations, pricingPlans, users } from "~/db/schema";
import EmailService from "./email.service";
import { JWT } from "@bepalo/jwt";
import { Receipt } from "@upyo/core";
import {
  fullOrganizationSelect,
  organizationWithAdminsSelect,
  organizationWithPricingPlanSelect,
  pureOrganizationSelect,
} from "./selects";

export default class OrganizationService {
  //
  // Organization
  //
  static async createOrganization(
    organizationInit: OrganizationInit,
  ): Promise<OrganizationPure> {
    const [organization] = await db
      .insert(organizations)
      .values(organizationInit)
      .returning();
    return organization;
  }

  static async getAllOrganizations({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }): Promise<Organization[]> {
    const organizationsResult = (await db
      .select(fullOrganizationSelect)
      .from(organizations)
      .leftJoin(users, eq(organizations.adminId, users.id))
      .innerJoin(pricingPlans, eq(organizations.pricingPlanId, pricingPlans.id))
      .limit(limit)
      .offset(offset)) as Organization[];
    return organizationsResult;
  }

  static async getAllOrganizationsPure({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }): Promise<Omit<Organization, "pricingPlan" | "admin">[]> {
    const organizationsResult = (await db
      .select(pureOrganizationSelect)
      .from(organizations)
      .limit(limit)
      .offset(offset)) as Omit<Organization, "pricingPlan" | "admin">[];
    return organizationsResult;
  }

  static async getAllOrganizationsWithAdmin({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }): Promise<Omit<Organization, "pricingPlan">[]> {
    const organizationsResult = (await db
      .select(organizationWithAdminsSelect)
      .from(organizations)
      .leftJoin(users, eq(organizations.adminId, users.id))
      .limit(limit)
      .offset(offset)) as Omit<Organization, "pricingPlan">[];
    return organizationsResult;
  }

  static async getAllOrganizationsWithPricingPlan({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }): Promise<Omit<Organization, "admin">[]> {
    const organizationsResult = (await db
      .select(organizationWithPricingPlanSelect)
      .from(organizations)
      .leftJoin(pricingPlans, eq(organizations.pricingPlanId, pricingPlans.id))
      .limit(limit)
      .offset(offset)) as Omit<Organization, "admin">[];
    return organizationsResult;
  }

  static async getOrganizationById(
    organizationId: string,
  ): Promise<Organization | undefined> {
    const [organization] = (await db
      .select(fullOrganizationSelect)
      .from(organizations)
      .leftJoin(users, eq(organizations.adminId, users.id))
      .leftJoin(pricingPlans, eq(organizations.pricingPlanId, pricingPlans.id))
      .where(eq(organizations.id, organizationId))) as Organization[];
    return organization;
  }

  static async getOrganizationByAdminId(
    adminId: string,
  ): Promise<Organization | undefined> {
    const [organization] = (await db
      .select(fullOrganizationSelect)
      .from(organizations)
      .leftJoin(users, eq(organizations.adminId, users.id))
      .innerJoin(pricingPlans, eq(organizations.pricingPlanId, pricingPlans.id))
      .where(eq(organizations.adminId, adminId))) as Organization[];
    return organization;
  }

  static async getOrganizationByAdminIdPure(
    adminId: string,
  ): Promise<Omit<Organization, "pricingPlan" | "admin"> | undefined> {
    const [organization] = await db
      .select(pureOrganizationSelect)
      .from(organizations)
      // .leftJoin(users, eq(organizations.adminId, users.id))
      // .innerJoin(pricingPlans, eq(organizations.pricingPlanId, pricingPlans.id))
      .where(eq(organizations.adminId, adminId));
    return organization;
  }

  static async getOrganizationByEmail(
    email: string,
  ): Promise<Organization | undefined> {
    const [organization] = (await db
      .select(fullOrganizationSelect)
      .from(organizations)
      .innerJoin(users, eq(organizations.adminId, users.id))
      .leftJoin(pricingPlans, eq(organizations.pricingPlanId, pricingPlans.id))
      .where(eq(organizations.email, email))) as Organization[];
    return organization;
  }

  static async updateOrganization(
    organizationInit: OrganizationUpdate,
  ): Promise<Organization> {
    const { id, adminId, ...organizationInitSafe } =
      organizationInit as OrganizationInit;
    const [organization] = (await db
      .update(organizations)
      .set({ ...organizationInitSafe, updatedAt: new Date() })
      .where(id ? eq(organizations.id, id) : eq(organizations.adminId, adminId))
      .returning()) as Organization[];
    return organization;
  }

  static async deleteOrganizationById(organizationId: string): Promise<void> {
    await db.delete(organizations).where(eq(organizations.id, organizationId));
  }

  static async deleteOrganizationByAdminId(adminId: string): Promise<void> {
    await db.delete(organizations).where(eq(organizations.adminId, adminId));
  }

  //
  // Employee
  //
  static async hasEmployeeByAdminId(
    adminId: string,
    employeeId: string,
  ): Promise<boolean> {
    const [employee] = await db
      .select({ userId: employees.userId })
      .from(organizations)
      .innerJoin(employees, eq(organizations.id, employees.organizationId))
      .where(eq(employees.userId, employeeId));
    return employee?.userId === employeeId;
  }

  static async sendEmployeeHireLink({
    email,
    jobTitle,
    jobDescription,
    organization,
  }: {
    email: string;
    jobTitle: string;
    jobDescription: string;
    organization: Organization;
  }): Promise<Receipt> {
    // generate link
    const hireRequestToken = employeeHireJwt.signSync({
      from: organization.name,
      to: email,
      organizationId: organization.id,
      jobTitle,
      jobDescription,
      sub: "hire-request",
      iat: JWT.now(),
      exp: Math.floor((Date.now() + securityConfig.employeeHireMaxAge) / 1000),
    });
    // mail the token
    const hireLink = `${config.url}/api/v1/employee/hire?t=${hireRequestToken}`;
    console.log({ email, hireLink });
    return EmailService.send({
      // from: "serve.sync.plus@gmail.com",
      from: securityConfig.smtpEmail,
      to: email,
      subject: `Hire Offer from '${organization.name}' on ServeSync+`,
      content: {
        html: `
        <div>
          <h1>Hi there, you have recieved a job offer of '${jobTitle}' from '${organization.name}'.</h1>
          <div>
            <h3>Job Title: ${jobTitle}</h3>
            <p>Job Description: ${jobDescription}</p>
          </div>
          <div>
            <p>
              Use the following link to register as an employee at '${organization.name}'.
              <a href="${hireLink}">${hireLink}</a>
            </p>
          </div>
        </div>`,
      },
    });
  }
}
