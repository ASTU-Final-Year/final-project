import {
  employeeCalendars,
  employees,
  organizationCalendars,
  organizations,
  organizationServices,
  pricingPlans,
  serviceFirstEmployees,
  users,
} from "~/db/schema";

export const pureUserSelect = {
  id: users.id,
  firstname: users.firstname,
  lastname: users.lastname,
  gender: users.gender,
  role: users.role,
  email: users.email,
  phone: users.phone,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

export const purePricingPlanSelect = {
  id: pricingPlans.id,
  name: pricingPlans.name,
  price: pricingPlans.price,
  monthlyDiscount: pricingPlans.monthlyDiscount,
  annualDiscount: pricingPlans.annualDiscount,
  maxServices: pricingPlans.maxServices,
  maxEmployees: pricingPlans.maxEmployees,
  features: pricingPlans.features,
  popular: pricingPlans.popular,
  createdAt: pricingPlans.createdAt,
  updatedAt: pricingPlans.updatedAt,
};

export const pureOrganizationSelect = {
  id: organizations.id,
  name: organizations.name,
  slug: organizations.slug,
  description: organizations.description,
  sector: organizations.sector,
  isGovernment: organizations.isGovernment,
  isActive: organizations.isActive,
  address: organizations.address,
  email: organizations.email,
  phone: organizations.phone,
  rating: organizations.rating,
  adminId: organizations.adminId,
  pricingPlanId: organizations.pricingPlanId,
  createdAt: organizations.createdAt,
  updatedAt: organizations.updatedAt,
};

export const purePublicOrganizationSelect = {
  id: organizations.id,
  name: organizations.name,
  slug: organizations.slug,
  description: organizations.description,
  sector: organizations.sector,
  isGovernment: organizations.isGovernment,
  isActive: organizations.isActive,
  address: organizations.address,
  email: organizations.email,
  phone: organizations.phone,
  rating: organizations.rating,
  createdAt: organizations.createdAt,
};

export const pureOrganizationCalendarSelect = {
  id: organizationCalendars.id,
  organizationId: organizationCalendars.organizationId,
  name: organizationCalendars.name,
  description: organizationCalendars.description,
  available: organizationCalendars.available,
  unavailable: organizationCalendars.unavailable,
  createdAt: organizationCalendars.createdAt,
  updatedAt: organizationCalendars.updatedAt,
};

export const pureOrganizationServiceSelect = {
  id: organizationServices.id,
  name: organizationServices.name,
  description: organizationServices.description,
  isActive: organizationServices.isActive,
  organizationId: organizationServices.organizationId,
  calendarId: organizationServices.calendarId,
  createdAt: organizationServices.createdAt,
  updatedAt: organizationServices.updatedAt,
};

export const pureEmployeeSelect = {
  userId: employees.userId,
  organizationId: employees.organizationId,
  jobTitle: employees.jobTitle,
  jobDescription: employees.jobDescription,
  isActive: employees.isActive,
  calendarId: employees.calendarId,
  createdAt: employees.createdAt,
  updatedAt: employees.updatedAt,
};

export const pureEmployeeCalendarSelect = {
  id: employeeCalendars.id,
  employeeId: employeeCalendars.employeeId,
  name: employeeCalendars.name,
  description: employeeCalendars.description,
  available: employeeCalendars.available,
  unavailable: employeeCalendars.unavailable,
  createdAt: employeeCalendars.createdAt,
  updatedAt: employeeCalendars.updatedAt,
};

export const pureOrganizationServiceFirstEmployeeSelect = {
  serviceId: serviceFirstEmployees.serviceId,
  employeeId: serviceFirstEmployees.employeeId,
  createdAt: serviceFirstEmployees.createdAt,
  updatedAt: serviceFirstEmployees.updatedAt,
};

export const employeeWithUserSelect = {
  ...pureEmployeeSelect,
  user: pureUserSelect,
};

export const employeeWithOrganizationSelect = {
  ...pureEmployeeSelect,
  organization: pureOrganizationSelect,
};

export const employeeWithCalendarSelect = {
  ...pureEmployeeSelect,
  calendar: pureEmployeeCalendarSelect,
};

export const fullEmployeeSelect = {
  ...pureEmployeeSelect,
  user: pureUserSelect,
  organization: pureOrganizationSelect,
};

export const fullEmployeeCalendarSelect = {
  ...pureEmployeeCalendarSelect,
  employee: pureEmployeeSelect,
};

export const fullOrganizationSelect = {
  ...pureOrganizationSelect,
  admin: pureUserSelect,
  pricingPlan: purePricingPlanSelect,
};

export const fullPublicOrganizationSelect = {
  ...purePublicOrganizationSelect,
  admin: pureUserSelect,
  pricingPlan: purePricingPlanSelect,
};

export const organizationWithAdminsSelect = {
  ...pureOrganizationSelect,
  admin: pureUserSelect,
};

export const organizationWithPricingPlanSelect = {
  ...pureOrganizationSelect,
  pricingPlan: purePricingPlanSelect,
};

export const fullOrganizationCalendarSelect = {
  ...pureOrganizationCalendarSelect,
  organization: pureOrganizationSelect,
};

export const fullOrganizationServiceSelect = {
  ...pureOrganizationServiceSelect,
  organization: pureOrganizationSelect,
  calendar: pureOrganizationCalendarSelect,
};

export const fullPublicOrganizationServiceSelect = {
  ...pureOrganizationServiceSelect,
  organization: purePublicOrganizationSelect,
  calendar: pureOrganizationCalendarSelect,
};

export const organizationServiceWithOrganizationSelect = {
  ...pureOrganizationServiceSelect,
  organization: pureOrganizationSelect,
};

export const publicOrganizationServiceWithOrganizationSelect = {
  ...pureOrganizationServiceSelect,
  organization: purePublicOrganizationSelect,
};

export const organizationServiceWithCalendarSelect = {
  ...pureOrganizationServiceSelect,
  calendar: pureOrganizationCalendarSelect,
};

export const fullOrganizationServiceFirstEmployeeSelect = {
  ...pureOrganizationServiceFirstEmployeeSelect,
  service: pureOrganizationServiceSelect,
  employee: pureEmployeeSelect,
};

export const organizationServiceFirstEmployeesWithServiceSelect = {
  ...pureOrganizationServiceFirstEmployeeSelect,
  service: pureOrganizationServiceSelect,
};

export const organizationServiceFirstEmployeesWithFirstEmployeeSelect = {
  ...pureOrganizationServiceFirstEmployeeSelect,
  employee: pureEmployeeSelect,
};
