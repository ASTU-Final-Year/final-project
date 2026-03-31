import { config } from "~/config";
import pgSchema from "./pg";
import sqliteSchema from "./sqlite";

export const users = config.isProduction ? pgSchema.users : sqliteSchema.users;
export const sessions = config.isProduction
  ? pgSchema.sessions
  : sqliteSchema.sessions;
export const pricingPlans = config.isProduction
  ? pgSchema.pricingPlans
  : sqliteSchema.pricingPlans;
export const organizations = config.isProduction
  ? pgSchema.organizations
  : sqliteSchema.organizations;
export const organizationAdmins = config.isProduction
  ? pgSchema.organizationAdmins
  : sqliteSchema.organizationAdmins;
export const organizationBranches = config.isProduction
  ? pgSchema.organizationBranches
  : sqliteSchema.organizationBranches;
export const organizationBranchOffices = config.isProduction
  ? pgSchema.organizationBranchOffices
  : sqliteSchema.organizationBranchOffices;
export const organizationBranchCalendars = config.isProduction
  ? pgSchema.organizationBranchCalendars
  : sqliteSchema.organizationBranchCalendars;
export const employeeCalendars = config.isProduction
  ? pgSchema.employeeCalendars
  : sqliteSchema.employeeCalendars;
export const employees = config.isProduction
  ? pgSchema.employees
  : sqliteSchema.employees;
export const organizationServices = config.isProduction
  ? pgSchema.organizationServices
  : sqliteSchema.organizationServices;
export const organizationServiceFirstEmployees = config.isProduction
  ? pgSchema.organizationServiceFirstEmployees
  : sqliteSchema.organizationServiceFirstEmployees;
export const tasks = config.isProduction ? pgSchema.tasks : sqliteSchema.tasks;

////////////////////////////////////////////////////////

export const usersRelations = config.isProduction
  ? pgSchema.usersRelations
  : sqliteSchema.usersRelations;
export const sessionsRelations = config.isProduction
  ? pgSchema.sessionsRelations
  : sqliteSchema.sessionsRelations;
export const organizationsRelations = config.isProduction
  ? pgSchema.organizationsRelations
  : sqliteSchema.organizationsRelations;
export const organizationAdminsRelations = config.isProduction
  ? pgSchema.organizationAdminsRelations
  : sqliteSchema.organizationAdminsRelations;
export const organizationBranchesRelations = config.isProduction
  ? pgSchema.organizationBranchesRelations
  : sqliteSchema.organizationBranchesRelations;
export const organizationBranchOfficesRelations = config.isProduction
  ? pgSchema.organizationBranchOfficesRelations
  : sqliteSchema.organizationBranchOfficesRelations;
export const employeesRelations = config.isProduction
  ? pgSchema.employeesRelations
  : sqliteSchema.employeesRelations;
export const employeeCalendarsRelations = config.isProduction
  ? pgSchema.employeeCalendarsRelations
  : sqliteSchema.employeeCalendarsRelations;
export const organizationBranchCalendarsRelations = config.isProduction
  ? pgSchema.organizationBranchCalendarsRelations
  : sqliteSchema.organizationBranchCalendarsRelations;
export const organizationServicesRelations = config.isProduction
  ? pgSchema.organizationServicesRelations
  : sqliteSchema.organizationServicesRelations;
export const organizationServiceFirstEmployeesRelations = config.isProduction
  ? pgSchema.organizationServiceFirstEmployeesRelations
  : sqliteSchema.organizationServiceFirstEmployeesRelations;
export const tasksRelations = config.isProduction
  ? pgSchema.tasksRelations
  : sqliteSchema.tasksRelations;
