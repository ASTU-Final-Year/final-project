// backend/hooks/notificationHooks.ts
import { db } from "~/db";
import { tables } from "~/db/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import NotificationService from "~/services/notifcation.service";

// Helper function to get upcoming appointments
async function getUpcomingAppointments(hoursBefore = 24) {
  const now = new Date();
  const futureDate = new Date(now.getTime() + hoursBefore * 60 * 60 * 1000);

  const appointments = await db
    .select({
      id: tables.appointment.id,
      startTime: tables.appointment.startTime,
      endTime: tables.appointment.endTime,
      status: tables.appointment.status,
      clientId: tables.appointment.clientId,
      service: {
        id: tables.organizationService.id,
        name: tables.organizationService.name,
      },
      client: {
        id: tables.user.id,
        firstname: tables.user.firstname,
        lastname: tables.user.lastname,
        email: tables.user.email,
      },
      organization: {
        id: tables.organization.id,
        name: tables.organization.name,
        adminId: tables.organization.adminId,
      },
    })
    .from(tables.appointment)
    .leftJoin(
      tables.organizationService,
      eq(tables.appointment.serviceId, tables.organizationService.id),
    )
    .leftJoin(tables.user, eq(tables.appointment.clientId, tables.user.id))
    .leftJoin(
      tables.organization,
      eq(tables.appointment.organizationId, tables.organization.id),
    )
    .where(
      and(
        eq(tables.appointment.status, "scheduled"),
        gte(tables.appointment.startTime, now),
        lte(tables.appointment.startTime, futureDate),
      ),
    );

  return appointments;
}

// Hook for appointment creation
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
    message: `${client.firstname} ${client.lastname} booked ${appointment.service?.name} on ${new Date(appointment.startTime).toLocaleDateString()} at ${new Date(appointment.startTime).toLocaleTimeString()}.`,
    priority: "medium",
    metadata: { appointmentId: appointment.id },
    actionUrl: `/dashboard/employee/appointment/${appointment.id}`,
  });
}

// Hook for appointment update
export async function onAppointmentUpdated(
  appointment: any,
  client: any,
  changes: string[],
) {
  // Notify client of changes
  await NotificationService.create(client.id, {
    type: "appointment_updated",
    title: "Appointment Updated",
    message: `Your appointment for ${appointment.service?.name} has been updated: ${changes.join(", ")}.`,
    priority: "medium",
    metadata: { appointmentId: appointment.id, changes },
    actionUrl: `/dashboard/client/appointment/${appointment.id}`,
  });
}

// Hook for appointment cancellation
export async function onAppointmentCancelled(
  appointment: any,
  client: any,
  organization: any,
) {
  // Notify client
  await NotificationService.create(client.id, {
    type: "appointment_cancelled",
    title: "Appointment Cancelled",
    message: `Your appointment for ${appointment.service?.name} on ${new Date(appointment.startTime).toLocaleDateString()} has been cancelled.`,
    priority: "high",
    metadata: { appointmentId: appointment.id },
    actionUrl: `/dashboard/client/appointments`,
  });

  // Notify organization admin
  await NotificationService.create(organization.adminId, {
    type: "appointment_cancelled",
    title: "Appointment Cancelled",
    message: `${client.firstname} ${client.lastname} cancelled their appointment for ${appointment.service?.name}.`,
    priority: "medium",
    metadata: { appointmentId: appointment.id },
  });
}

// Hook for task assignment
export async function onTaskAssigned(
  task: any,
  employee: any,
  appointment: any,
) {
  await NotificationService.create(employee.userId, {
    type: "task_assigned",
    title: "New Task Assigned",
    message: `You have been assigned to "${task.name}" for appointment on ${new Date(appointment.startTime).toLocaleDateString()}.`,
    priority: "high",
    metadata: { taskId: task.id, appointmentId: appointment.id },
    actionUrl: `/dashboard/employee/task/${task.id}`,
  });
}

// Hook for task completion
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

// Hook for task requiring client action
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

// Hook for payment received
export async function onPaymentReceived(
  payment: any,
  client: any,
  organization: any,
) {
  // Notify client
  await NotificationService.create(client.id, {
    type: "payment_received",
    title: "Payment Received",
    message: `Your payment of ${payment.amount} ${payment.currency} has been received successfully.`,
    priority: "high",
    metadata: {
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
    },
    actionUrl: `/dashboard/client/payments`,
  });

  // Notify organization admin
  await NotificationService.create(organization.adminId, {
    type: "payment_received",
    title: "Payment Received",
    message: `Payment of ${payment.amount} ${payment.currency} received from ${client.firstname} ${client.lastname}.`,
    priority: "medium",
    metadata: { paymentId: payment.id, clientId: client.id },
  });
}

// Hook for service rating
export async function onServiceRated(
  service: any,
  client: any,
  rating: number,
) {
  await NotificationService.create(service.organization?.adminId, {
    type: "service_rated",
    title: "New Service Rating",
    message: `${client.firstname} ${client.lastname} rated "${service.name}" ${rating} stars.`,
    priority: "low",
    metadata: { serviceId: service.id, rating },
    actionUrl: `/dashboard/organization/services/${service.id}`,
  });
}

// Send appointment reminders (for cron job)
export async function sendAppointmentReminders() {
  const upcomingAppointments = await getUpcomingAppointments(24); // 24 hours before

  for (const apt of upcomingAppointments) {
    // Send reminder to client
    await NotificationService.create(apt.clientId, {
      type: "appointment_reminder",
      title: "Appointment Reminder",
      message: `Reminder: Your appointment "${apt.service?.name}" is tomorrow at ${new Date(apt.startTime).toLocaleTimeString()}.`,
      priority: "medium",
      metadata: { appointmentId: apt.id },
      actionUrl: `/dashboard/client/appointment/${apt.id}`,
    });

    // Also send reminder to organization admin
    if (apt.organization?.adminId) {
      await NotificationService.create(apt.organization.adminId, {
        type: "appointment_reminder",
        title: "Upcoming Appointment",
        message: `${apt.client?.firstname} ${apt.client?.lastname} has an appointment tomorrow at ${new Date(apt.startTime).toLocaleTimeString()} for "${apt.service?.name}".`,
        priority: "low",
        metadata: { appointmentId: apt.id },
        actionUrl: `/dashboard/employee/appointment/${apt.id}`,
      });
    }
  }

  return { remindersSent: upcomingAppointments.length };
}

// Send reminder 1 hour before appointment
export async function sendOneHourReminders() {
  const upcomingAppointments = await getUpcomingAppointments(1); // 1 hour before

  for (const apt of upcomingAppointments) {
    await NotificationService.create(apt.clientId, {
      type: "appointment_reminder",
      title: "Appointment Starting Soon",
      message: `Your appointment "${apt.service?.name}" starts in 1 hour at ${new Date(apt.startTime).toLocaleTimeString()}.`,
      priority: "high",
      metadata: { appointmentId: apt.id },
      actionUrl: `/dashboard/client/appointment/${apt.id}`,
    });
  }

  return { remindersSent: upcomingAppointments.length };
}

// System broadcast notification
export async function broadcastSystemNotification(
  userIds: string[],
  title: string,
  message: string,
  priority: "low" | "medium" | "high" | "urgent" = "medium",
) {
  if (userIds.length === 0) return;

  await NotificationService.createBulk(userIds, {
    type: "system_alert",
    title,
    message,
    priority,
    actionUrl: "/dashboard",
  });
}
