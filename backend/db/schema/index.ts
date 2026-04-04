import { config } from "~/config";
import pgSchema from "./pg";
import sqliteSchema from "./sqlite";

// export const users = config.isProduction ? pgSchema.users : sqliteSchema.users;
// export const sessions = config.isProduction ? pgSchema.sessions : sqliteSchema.sessions;
// export const sessionsBlacklist = config.isProduction ? pgSchema.sessionsBlacklist : sqliteSchema.sessionsBlacklist;
// export const pricingPlans = config.isProduction ? pgSchema.pricingPlans : sqliteSchema.pricingPlans;
// export const organizations = config.isProduction ? pgSchema.organizations : sqliteSchema.organizations;
// export const organizationCalendars = config.isProduction ? pgSchema.organizationCalendars : sqliteSchema.organizationCalendars;
// export const employeeCalendars = config.isProduction ? pgSchema.employeeCalendars : sqliteSchema.employeeCalendars;
// export const employees = config.isProduction ? pgSchema.employees : sqliteSchema.employees;
// export const organizationServices = config.isProduction ? pgSchema.organizationServices : sqliteSchema.organizationServices;
// export const serviceFirstEmployees = config.isProduction ? pgSchema.serviceFirstEmployees : sqliteSchema.serviceFirstEmployees;
// export const tasks = config.isProduction ? pgSchema.tasks : sqliteSchema.tasks;

// export const usersRelations = config.isProduction ? pgSchema.usersRelations : sqliteSchema.usersRelations;
// export const sessionsRelations = config.isProduction ? pgSchema.sessionsRelations : sqliteSchema.sessionsRelations;
// export const organizationsRelations = config.isProduction ? pgSchema.organizationsRelations : sqliteSchema.organizationsRelations;
// export const employeesRelations = config.isProduction ? pgSchema.employeesRelations : sqliteSchema.employeesRelations;
// export const employeeCalendarsRelations = config.isProduction ? pgSchema.employeeCalendarsRelations : sqliteSchema.employeeCalendarsRelations;
// export const organizationCalendarsRelations = config.isProduction ? pgSchema.organizationCalendarsRelations : sqliteSchema.organizationCalendarsRelations;
// export const organizationServicesRelations = config.isProduction ? pgSchema.organizationServicesRelations : sqliteSchema.organizationServicesRelations;
// export const serviceFirstEmployeesRelations = config.isProduction ? pgSchema.serviceFirstEmployeesRelations : sqliteSchema.serviceFirstEmployeesRelations;
// export const tasksRelations = config.isProduction ? pgSchema.tasksRelations : sqliteSchema.tasksRelations;

export const users = sqliteSchema.users;
export const sessions = sqliteSchema.sessions;
export const sessionsBlacklist = sqliteSchema.sessionsBlacklist;
export const pricingPlans = sqliteSchema.pricingPlans;
export const organizations = sqliteSchema.organizations;
export const organizationCalendars = sqliteSchema.organizationCalendars;
export const employeeCalendars = sqliteSchema.employeeCalendars;
export const employees = sqliteSchema.employees;
export const organizationServices = sqliteSchema.organizationServices;
export const serviceFirstEmployees = sqliteSchema.serviceFirstEmployees;
export const tasks = sqliteSchema.tasks;

export const usersRelations = sqliteSchema.usersRelations;
export const sessionsRelations = sqliteSchema.sessionsRelations;
export const organizationsRelations = sqliteSchema.organizationsRelations;
export const employeesRelations = sqliteSchema.employeesRelations;
export const employeeCalendarsRelations =
  sqliteSchema.employeeCalendarsRelations;
export const organizationCalendarsRelations =
  sqliteSchema.organizationCalendarsRelations;
export const organizationServicesRelations =
  sqliteSchema.organizationServicesRelations;
export const serviceFirstEmployeesRelations =
  sqliteSchema.serviceFirstEmployeesRelations;
export const tasksRelations = sqliteSchema.tasksRelations;
