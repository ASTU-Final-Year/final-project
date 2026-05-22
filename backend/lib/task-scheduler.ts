// lib/task-scheduler.ts
import { db } from "~/db";
import { tables } from "~/db/schema";
import { and, eq, sql, isNull, gte, lte, inArray } from "drizzle-orm";

/**
 * Main cron job function to process pending appointments that don't have tasks
 * This only processes appointments that were missed by the ACL afterQuery
 */
export async function processPendingAppointments(): Promise<{
  processed: number;
  created: number;
  errors: number;
}> {
  console.log(`[${new Date()}] Starting appointment processing...`);

  const result = {
    processed: 0,
    created: 0,
    errors: 0,
  };

  try {
    // Get appointments that are scheduled, active, start within next 7 days, and have NO task
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const appointments = await db
      .select({
        id: tables.appointment.id,
        serviceId: tables.appointment.serviceId,
        clientId: tables.appointment.clientId,
        startTime: tables.appointment.startTime,
        endTime: tables.appointment.endTime,
        organizationId: tables.appointment.organizationId,
      })
      .from(tables.appointment)
      .leftJoin(
        tables.task,
        eq(tables.task.appointmentId, tables.appointment.id),
      )
      .where(
        and(
          eq(tables.appointment.status, "scheduled"),
          eq(tables.appointment.isActive, true),
          lte(tables.appointment.startTime, sevenDaysFromNow),
          gte(tables.appointment.startTime, new Date()),
          // isNull(tables.task.id), // Only appointments WITHOUT tasks
        ),
      );

    console.log(`Found ${appointments.length} appointments missing tasks`);

    // For each appointment without a task, we need to simulate the ACL logic
    // Since we can't directly call the ACL from here, we'll need to recreate the task creation logic
    for (const appointment of appointments) {
      result.processed++;
      try {
        await db.transaction(async (tx) => {
          // Get all first employees for this service
          const firstEmployees = await tx
            .select({
              employeeId: tables.serviceFirstEmployee.employeeId,
            })
            .from(tables.serviceFirstEmployee)
            .innerJoin(
              tables.employee,
              eq(tables.employee.id, tables.serviceFirstEmployee.employeeId),
            )
            .where(
              and(
                eq(
                  tables.serviceFirstEmployee.serviceId,
                  appointment.serviceId,
                ),
                eq(tables.employee.isActive, true),
              ),
            );

          if (firstEmployees.length === 0) {
            console.log(
              `No active first employees found for service ${appointment.serviceId}`,
            );
            return;
          }

          // Get current workload for each employee
          const employeeIds = firstEmployees.map((fe) => fe.employeeId);
          const workload = await tx
            .select({
              employeeId: tables.task.employeeId,
              count: sql<number>`count(*)`,
            })
            .from(tables.task)
            .where(
              and(
                inArray(tables.task.employeeId, employeeIds),
                sql`${tables.task.status} IN ('pending', 'active')`,
                eq(tables.task.isDone, false),
              ),
            )
            .groupBy(tables.task.employeeId);

          const workloadMap = new Map<string, number>();
          for (const w of workload) {
            workloadMap.set(w.employeeId, w.count);
          }
          for (const empId of employeeIds) {
            if (!workloadMap.has(empId)) {
              workloadMap.set(empId, 0);
            }
          }

          // Select employee with least workload
          const sorted = firstEmployees.sort((a, b) => {
            const workloadA = workloadMap.get(a.employeeId) || 0;
            const workloadB = workloadMap.get(b.employeeId) || 0;
            return workloadA - workloadB;
          });

          const selectedEmployee = sorted[0];
          const startTime = new Date(appointment.startTime);
          const endTime = new Date(appointment.endTime);

          // Calculate task duration (minimum 1 hour, maximum appointment duration)
          const durationHours = Math.max(
            1,
            (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60),
          );
          const taskEndTime = new Date(startTime);
          taskEndTime.setHours(taskEndTime.getHours() + durationHours);

          // Create task
          // const taskName = `Service: ${appointment.serviceId.slice(0, 8)} for ${appointment.clientId.slice(0, 8)}`;
          const taskName = `Initial Task`;

          await tx.insert(tables.task).values({
            appointmentId: appointment.id,
            employeeId: selectedEmployee.employeeId,
            name: taskName,
            startTime: startTime,
            endTime: taskEndTime,
            status: "pending",
            isDone: false,
            requirements: {
              appointmentId: appointment.id,
              serviceId: appointment.serviceId,
              clientId: appointment.clientId,
              startTime: appointment.startTime,
              endTime: appointment.endTime,
              createdByCron: true,
              createdAt: new Date(),
            },
          });

          console.log(
            `Cron created task for appointment ${appointment.id} assigned to employee ${selectedEmployee.employeeId}`,
          );
          result.created++;
        });
      } catch (error) {
        console.error(`Error processing appointment ${appointment.id}:`, error);
        result.errors++;
      }
    }

    console.log(
      `Completed. Processed: ${result.processed}, Created: ${result.created}, Errors: ${result.errors}`,
    );
  } catch (error) {
    console.error("Error in processPendingAppointments:", error);
    result.errors++;
  }

  return result;
}

/**
 * Reassign tasks from inactive employees to active ones
 */
export async function reassignOrphanedTasks(): Promise<{
  reassigned: number;
  errors: number;
}> {
  console.log(`[${new Date()}] Starting orphaned task reassignment...`);

  const result = {
    reassigned: 0,
    errors: 0,
  };

  try {
    // Get tasks assigned to inactive employees
    const orphanedTasks = await db
      .select({
        id: tables.task.id,
        serviceId: tables.appointment.serviceId,
        employeeId: tables.task.employeeId,
      })
      .from(tables.task)
      .innerJoin(
        tables.appointment,
        eq(tables.appointment.id, tables.task.appointmentId),
      )
      .innerJoin(
        tables.employee,
        eq(tables.employee.id, tables.task.employeeId),
      )
      .where(
        and(
          sql`${tables.task.status} IN ('pending', 'active')`,
          eq(tables.task.isDone, false),
          eq(tables.employee.isActive, false),
        ),
      );

    console.log(`Found ${orphanedTasks.length} orphaned tasks`);

    for (const task of orphanedTasks) {
      try {
        await db.transaction(async (tx) => {
          // Get all active first employees for this service
          const firstEmployees = await tx
            .select({
              employeeId: tables.serviceFirstEmployee.employeeId,
            })
            .from(tables.serviceFirstEmployee)
            .innerJoin(
              tables.employee,
              eq(tables.employee.id, tables.serviceFirstEmployee.employeeId),
            )
            .where(
              and(
                eq(tables.serviceFirstEmployee.serviceId, task.serviceId),
                eq(tables.employee.isActive, true),
              ),
            );

          if (firstEmployees.length === 0) {
            console.log(
              `No active first employees for service ${task.serviceId}`,
            );
            return;
          }

          // Get workload for these employees
          const employeeIds = firstEmployees.map((fe) => fe.employeeId);
          const workload = await tx
            .select({
              employeeId: tables.task.employeeId,
              count: sql<number>`count(*)`,
            })
            .from(tables.task)
            .where(
              and(
                inArray(tables.task.employeeId, employeeIds),
                sql`${tables.task.status} IN ('pending', 'active')`,
                eq(tables.task.isDone, false),
              ),
            )
            .groupBy(tables.task.employeeId);

          const workloadMap = new Map<string, number>();
          for (const w of workload) {
            workloadMap.set(w.employeeId, w.count);
          }
          for (const empId of employeeIds) {
            if (!workloadMap.has(empId)) {
              workloadMap.set(empId, 0);
            }
          }

          // Select employee with least workload (excluding the current assignee if they're inactive)
          const availableEmployees = firstEmployees.filter(
            (fe) => fe.employeeId !== task.employeeId,
          );

          if (availableEmployees.length === 0) {
            console.log(`No alternative employees for task ${task.id}`);
            return;
          }

          const sorted = availableEmployees.sort((a, b) => {
            const workloadA = workloadMap.get(a.employeeId) || 0;
            const workloadB = workloadMap.get(b.employeeId) || 0;
            return workloadA - workloadB;
          });

          const newEmployeeId = sorted[0].employeeId;

          await tx
            .update(tables.task)
            .set({
              employeeId: newEmployeeId,
              status: "pending",
              updatedAt: new Date(),
            })
            .where(eq(tables.task.id, task.id));

          console.log(
            `Reassigned task ${task.id} from ${task.employeeId} to ${newEmployeeId}`,
          );
          result.reassigned++;
        });
      } catch (error) {
        console.error(`Error reassigning task ${task.id}:`, error);
        result.errors++;
      }
    }
  } catch (error) {
    console.error("Error in reassignOrphanedTasks:", error);
    result.errors++;
  }

  return result;
}
