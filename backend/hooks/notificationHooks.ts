// backend/hooks/notificationHooks.ts

import NotificationService from "~/services/notifcation.service";

// Account creation notification
export async function onAccountCreated(user: any) {
  await NotificationService.create(user.id, {
    type: "account_created",
    title: "Welcome to ServeSync+!",
    message: `Your ${user.role} account has been successfully created. Get started by exploring our services.`,
    priority: "high",
    metadata: {
      userId: user.id,
      role: user.role,
      createdAt: new Date().toISOString(),
    },
    actionUrl:
      user.role === "client" ? "/dashboard/client" : "/dashboard/employee",
  });
}

// Profile updated notification
export async function onProfileUpdated(user: any, changes: string[]) {
  if (changes.length === 0) return;

  await NotificationService.create(user.id, {
    type: "profile_updated",
    title: "Profile Updated",
    message: `Your profile has been updated: ${changes.join(", ")}.`,
    priority: "low",
    metadata: {
      userId: user.id,
      changes,
      updatedAt: new Date().toISOString(),
    },
  });
}

// Appointment created notification (already exists, ensure types match)
export async function onAppointmentCreated(
  appointment: any,
  client: any,
  organization: any,
) {
  // Notify client
  await NotificationService.create(client.id, {
    type: "appointment_created",
    title: "Appointment Confirmed",
    message: `Your appointment for ${appointment.service?.name} on ${new Date(appointment.startTime).toLocaleDateString()} at ${new Date(appointment.startTime).toLocaleTimeString()} has been confirmed.`,
    priority: "high",
    metadata: { appointmentId: appointment.id },
    actionUrl: `/dashboard/client/appointment/${appointment.id}`,
  });

  // Notify organization admin
  await NotificationService.create(organization.adminId, {
    type: "appointment_created",
    title: "New Appointment Booked",
    message: `${client.firstname} ${client.lastname} booked ${appointment.service?.name} on ${new Date(appointment.startTime).toLocaleDateString()}.`,
    priority: "medium",
    metadata: { appointmentId: appointment.id },
    actionUrl: `/dashboard/organization/appointments`,
  });
}

// Appointment updated notification
export async function onAppointmentUpdated(
  appointment: any,
  client: any,
  changes: string[],
) {
  await NotificationService.create(client.id, {
    type: "appointment_updated",
    title: "Appointment Updated",
    message: `Your appointment for ${appointment.service?.name} has been updated: ${changes.join(", ")}.`,
    priority: "medium",
    metadata: { appointmentId: appointment.id, changes },
    actionUrl: `/dashboard/client/appointment/${appointment.id}`,
  });
}

// Appointment cancelled notification
export async function onAppointmentCancelled(
  appointment: any,
  client: any,
  organization: any,
) {
  await NotificationService.create(client.id, {
    type: "appointment_cancelled",
    title: "Appointment Cancelled",
    message: `Your appointment for ${appointment.service?.name} on ${new Date(appointment.startTime).toLocaleDateString()} has been cancelled.`,
    priority: "high",
    metadata: { appointmentId: appointment.id },
    actionUrl: `/dashboard/client/appointments`,
  });
}

// Task assigned notification
export async function onTaskAssigned(
  task: any,
  employee: any,
  appointment: any,
) {
  await NotificationService.create(employee.id, {
    type: "task_assigned",
    title: "New Task Assigned",
    message: `You have been assigned to "${task.name}" for appointment on ${new Date(appointment.startTime).toLocaleDateString()}.`,
    priority: "high",
    metadata: { taskId: task.id, appointmentId: appointment.id },
    actionUrl: `/dashboard/employee/task/${task.id}`,
  });
}

// Task requires action (client needs to do something)
export async function onTaskRequiresAction(
  task: any,
  client: any,
  appointment: any,
) {
  await NotificationService.create(client.id, {
    type: "task_requires_action",
    title: "Action Required",
    message: `Please complete the requirements for "${task.name}" related to your appointment on ${new Date(appointment.startTime).toLocaleDateString()}.`,
    priority: "high",
    metadata: { taskId: task.id, appointmentId: appointment.id },
    actionUrl: `/dashboard/client/task/${task.id}`,
  });
}

// Task completed notification
export async function onTaskCompleted(
  task: any,
  client: any,
  appointment: any,
) {
  await NotificationService.create(client.id, {
    type: "task_completed",
    title: "Task Completed",
    message: `Task "${task.name}" for your appointment on ${new Date(appointment.startTime).toLocaleDateString()} has been completed.`,
    priority: "medium",
    metadata: { taskId: task.id, appointmentId: appointment.id },
    actionUrl: `/dashboard/client/appointment/${appointment.id}`,
  });
}

// Employee hired notification
export async function onEmployeeHired(
  employee: any,
  user: any,
  organization: any,
) {
  // Notify the employee
  await NotificationService.create(user.id, {
    type: "employee_hired",
    title: "Welcome to the Team",
    message: `You have been hired as ${employee.jobTitle} at ${organization.name}.`,
    priority: "high",
    metadata: { employeeId: employee.id, organizationId: organization.id },
    actionUrl: `/dashboard/employee`,
  });

  // Notify the organization admin
  await NotificationService.create(organization.adminId, {
    type: "employee_hired",
    title: "New Employee Hired",
    message: `${user.firstname} ${user.lastname} has been hired as ${employee.jobTitle}.`,
    priority: "medium",
    metadata: { employeeId: employee.id },
    actionUrl: `/dashboard/organization/employees`,
  });
}

// Employee removed notification
export async function onEmployeeRemoved(
  employee: any,
  user: any,
  organization: any,
) {
  await NotificationService.create(user.id, {
    type: "employee_removed",
    title: "Employment Status Updated",
    message: `Your employment at ${organization.name} has been terminated.`,
    priority: "high",
    metadata: { employeeId: employee.id, organizationId: organization.id },
  });
}

// Organization created notification
export async function onOrganizationCreated(organization: any, admin: any) {
  await NotificationService.create(admin.id, {
    type: "organization_created",
    title: "Organization Registered",
    message: `${organization.name} has been successfully registered. Complete your profile to start accepting bookings.`,
    priority: "high",
    metadata: { organizationId: organization.id },
    actionUrl: `/dashboard/organization/profile`,
  });
}
