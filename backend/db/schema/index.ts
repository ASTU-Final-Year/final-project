import { config } from "~/config";
import { pgTables, pgRelations } from "./pg";
import { sqTables, sqRelations } from "./sqlite";

declare global {
  export type UserRole =
    | "super_admin"
    | "organization_admin"
    | "employee"
    | "client";
}

const prodDatabase = config.prodDatabase as false;

export const users = prodDatabase ? pgTables.user : sqTables.user;
export const sessions = prodDatabase ? pgTables.session : sqTables.session;
export const sessionsBlacklist = prodDatabase
  ? pgTables.sessionBlacklist
  : sqTables.sessionBlacklist;
export const pricingPlans = prodDatabase
  ? pgTables.pricingPlan
  : sqTables.pricingPlan;
export const organizations = prodDatabase
  ? pgTables.organization
  : sqTables.organization;
export const organizationCalendars = prodDatabase
  ? pgTables.organizationCalendar
  : sqTables.organizationCalendar;
export const employees = prodDatabase ? pgTables.employee : sqTables.employee;
export const organizationServices = prodDatabase
  ? pgTables.organizationService
  : sqTables.organizationService;
export const serviceFirstEmployees = prodDatabase
  ? pgTables.serviceFirstEmployee
  : sqTables.serviceFirstEmployee;
export const tasks = prodDatabase ? pgTables.task : sqTables.task;
export const appointments = prodDatabase
  ? pgTables.appointment
  : sqTables.appointment;

export const usersRelations = prodDatabase
  ? pgRelations.usersRelations
  : sqRelations.usersRelations;
export const sessionsRelations = prodDatabase
  ? pgRelations.sessionsRelations
  : sqRelations.sessionsRelations;
export const organizationsRelations = prodDatabase
  ? pgRelations.organizationsRelations
  : sqRelations.organizationsRelations;
export const employeesRelations = prodDatabase
  ? pgRelations.employeesRelations
  : sqRelations.employeesRelations;
export const organizationCalendarsRelations = prodDatabase
  ? pgRelations.organizationCalendarsRelations
  : sqRelations.organizationCalendarsRelations;
export const organizationServicesRelations = prodDatabase
  ? pgRelations.organizationServicesRelations
  : sqRelations.organizationServicesRelations;
export const serviceFirstEmployeesRelations = prodDatabase
  ? pgRelations.serviceFirstEmployeesRelations
  : sqRelations.serviceFirstEmployeesRelations;
export const tasksRelations = prodDatabase
  ? pgRelations.tasksRelations
  : sqRelations.tasksRelations;
export const appointmentRelations = prodDatabase
  ? pgRelations.appointmentRelations
  : sqRelations.appointmentRelations;

export const tables = (prodDatabase ? pgTables : sqTables) as typeof pgTables;
export const relations = (
  prodDatabase ? pgRelations : sqRelations
) as typeof pgRelations;

export const schema = {
  ...tables,
  ...relations,
};

export default schema;
