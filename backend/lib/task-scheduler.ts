// backend/lib/task-scheduler.ts - Complete fixed version

import { db } from "~/db";
import { tables } from "~/db/schema";
import { and, eq, sql } from "drizzle-orm";
import NotificationService from "~/services/notifcation.service";

/**
 * Process pending appointments and create initial tasks if they don't exist
 */
export async function processPendingAppointments() {
  const results = {
    processed: 0,
    created: 0,
    skipped: 0,
    errors: 0,
    details: [] as any[],
  };

  try {
    // Get all scheduled appointments that don't have tasks yet
    const pendingAppointments = await db
      .select({
        id: tables.appointment.id,
        clientId: tables.appointment.clientId,
        serviceId: tables.appointment.serviceId,
        organizationId: tables.appointment.organizationId,
        startTime: tables.appointment.startTime,
        endTime: tables.appointment.endTime,
        service: {
          id: tables.organizationService.id,
          name: tables.organizationService.name,
          description: tables.organizationService.description,
          organizationId: tables.organizationService.organizationId,
        },
        organization: {
          id: tables.organization.id,
          name: tables.organization.name,
        },
        client: {
          id: tables.user.id,
          firstname: tables.user.firstname,
          lastname: tables.user.lastname,
          email: tables.user.email,
        },
      })
      .from(tables.appointment)
      .innerJoin(
        tables.organizationService,
        eq(tables.appointment.serviceId, tables.organizationService.id),
      )
      .innerJoin(
        tables.organization,
        eq(tables.appointment.organizationId, tables.organization.id),
      )
      .innerJoin(tables.user, eq(tables.appointment.clientId, tables.user.id))
      .where(
        and(
          eq(tables.appointment.status, "scheduled"),
          eq(tables.appointment.isActive, true),
          // Only process appointments that don't have tasks
          sql`NOT EXISTS (
            SELECT 1 FROM ${tables.task} 
            WHERE ${tables.task.appointmentId} = ${tables.appointment.id}
          )`,
        ),
      );

    results.processed = pendingAppointments.length;

    for (const apt of pendingAppointments) {
      try {
        // Get the first employee assigned to this service
        const [firstEmployee] = await db
          .select({
            employeeId: tables.serviceFirstEmployee.employeeId,
          })
          .from(tables.serviceFirstEmployee)
          .where(eq(tables.serviceFirstEmployee.serviceId, apt.serviceId))
          .limit(1);

        if (!firstEmployee) {
          results.skipped++;
          results.details.push({
            appointmentId: apt.id,
            status: "skipped",
            reason: "No employee assigned to service",
          });
          continue;
        }

        // Verify the employee exists and is active
        const [employeeData] = await db
          .select({
            id: tables.employee.id,
            userId: tables.employee.userId,
            isActive: tables.employee.isActive,
            organizationId: tables.employee.organizationId,
          })
          .from(tables.employee)
          .where(eq(tables.employee.id, firstEmployee.employeeId));

        if (!employeeData || !employeeData.isActive) {
          results.skipped++;
          results.details.push({
            appointmentId: apt.id,
            status: "skipped",
            reason: "Employee not found or inactive",
          });
          continue;
        }

        // Verify employee belongs to the same organization
        if (employeeData.organizationId !== apt.organizationId) {
          results.skipped++;
          results.details.push({
            appointmentId: apt.id,
            status: "skipped",
            reason: "Employee does not belong to the correct organization",
          });
          continue;
        }

        // Create initial task for the appointment
        const taskName = `Start ${apt.service.name} for ${apt.client.firstname} ${apt.client.lastname}`;
        const taskDescription = `Appointment scheduled for ${new Date(apt.startTime).toLocaleString()}. Service: ${apt.service.name}`;

        // Use appointment's start and end times for the task
        const startTime = apt.startTime;
        const endTime = apt.endTime;
        const now = new Date();

        const [newTask] = await db
          .insert(tables.task)
          .values({
            name: taskName,
            description: taskDescription,
            status: "pending",
            isDone: false,
            startTime: startTime, // Add this - use appointment start time
            endTime: endTime, // Add this - use appointment end time
            appointmentId: apt.id,
            employeeId: firstEmployee.employeeId,
            organizationId: apt.organizationId,
            createdAt: now,
            updatedAt: now,
          })
          .returning();

        results.created++;
        results.details.push({
          appointmentId: apt.id,
          taskId: newTask.id,
          status: "created",
        });

        // Notify the employee about the new task
        if (employeeData.userId) {
          NotificationService.create(employeeData.userId, {
            type: "task_assigned",
            title: "New Task Assigned",
            message: `You have been assigned to complete "${apt.service.name}" for ${apt.client.firstname} ${apt.client.lastname}.`,
            priority: "high",
            metadata: {
              taskId: newTask.id,
              appointmentId: apt.id,
              serviceName: apt.service.name,
            },
            actionUrl: `/dashboard/employee/task/${newTask.id}`,
          }).catch((err) => console.error("Notification failed:", err));
        }
      } catch (error) {
        results.errors++;
        results.details.push({
          appointmentId: apt.id,
          status: "error",
          error: String(error),
        });
        console.error(
          `Failed to create task for appointment ${apt.id}:`,
          error,
        );
      }
    }
  } catch (error) {
    console.error("Failed to process pending appointments:", error);
    results.errors++;
    results.details.push({
      status: "fatal",
      error: String(error),
    });
  }

  return results;
}

/**
 * Reassign orphaned tasks (tasks where employee is no longer active)
 */
export async function reassignOrphanedTasks() {
  const results = {
    processed: 0,
    reassigned: 0,
    failed: 0,
    details: [] as any[],
  };

  try {
    // Get tasks assigned to inactive employees or without valid employee
    const orphanedTasks = await db
      .select({
        id: tables.task.id,
        name: tables.task.name,
        employeeId: tables.task.employeeId,
        appointmentId: tables.task.appointmentId,
        serviceId: tables.appointment.serviceId,
        organizationId: tables.task.organizationId,
      })
      .from(tables.task)
      .innerJoin(
        tables.appointment,
        eq(tables.task.appointmentId, tables.appointment.id),
      )
      .leftJoin(tables.employee, eq(tables.task.employeeId, tables.employee.id))
      .where(
        and(
          eq(tables.task.status, "pending"),
          eq(tables.task.isDone, false),
          or(
            eq(tables.employee.isActive, false),
            sql`${tables.task.employeeId} IS NULL`,
          ),
        ),
      );

    results.processed = orphanedTasks.length;

    for (const task of orphanedTasks) {
      try {
        // Find a new employee for this service
        const [newEmployee] = await db
          .select({
            employeeId: tables.serviceFirstEmployee.employeeId,
          })
          .from(tables.serviceFirstEmployee)
          .where(eq(tables.serviceFirstEmployee.serviceId, task.serviceId))
          .limit(1);

        if (!newEmployee) {
          results.failed++;
          results.details.push({
            taskId: task.id,
            status: "failed",
            reason: "No active employee found for this service",
          });
          continue;
        }

        // Verify the new employee is active
        const [employeeData] = await db
          .select({
            id: tables.employee.id,
            userId: tables.employee.userId,
            isActive: tables.employee.isActive,
          })
          .from(tables.employee)
          .where(eq(tables.employee.id, newEmployee.employeeId));

        if (!employeeData || !employeeData.isActive) {
          results.failed++;
          results.details.push({
            taskId: task.id,
            status: "failed",
            reason: "New employee is not active",
          });
          continue;
        }

        // Reassign the task
        await db
          .update(tables.task)
          .set({
            employeeId: newEmployee.employeeId,
            updatedAt: new Date(),
          })
          .where(eq(tables.task.id, task.id));

        results.reassigned++;
        results.details.push({
          taskId: task.id,
          newEmployeeId: newEmployee.employeeId,
          status: "reassigned",
        });

        // Notify the new employee
        if (employeeData.userId) {
          NotificationService.create(employeeData.userId, {
            type: "task_assigned",
            title: "Task Reassigned",
            message: `A task has been reassigned to you: "${task.name}".`,
            priority: "medium",
            metadata: {
              taskId: task.id,
              previousEmployeeId: task.employeeId,
            },
            actionUrl: `/dashboard/employee/task/${task.id}`,
          }).catch((err) => console.error("Notification failed:", err));
        }
      } catch (error) {
        results.failed++;
        results.details.push({
          taskId: task.id,
          status: "error",
          error: String(error),
        });
        console.error(`Failed to reassign task ${task.id}:`, error);
      }
    }
  } catch (error) {
    console.error("Failed to reassign orphaned tasks:", error);
    results.failed++;
    results.details.push({
      status: "fatal",
      error: String(error),
    });
  }

  return results;
}

/**
 * Clean up old tasks (archive completed tasks after certain period)
 */
export async function archiveOldTasks(daysOld = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await db
    .update(tables.task)
    .set({
      status: "archived",
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(tables.task.status, "completed"),
        sql`${tables.task.completedAt} < ${cutoffDate.toISOString()}`,
      ),
    );

  return {
    archived: result.count,
    cutoffDate: cutoffDate.toISOString(),
  };
}
