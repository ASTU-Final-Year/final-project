import { and, eq, sql } from "drizzle-orm";
import { Task, TaskInit, TaskProgress, TaskUpdate } from "~/base";
import { db } from "~/db";
import { organizations, organizationServices, tasks, users } from "~/db/schema";
import { fullTaskSelect } from "./selects";

export default class TaskService {
  static async createTask(taskInit: TaskInit): Promise<Task> {
    const [task] = await db.insert(sqTasks).values(taskInit).returning();
    return task as unknown as Task;
  }

  static async getAllTasks({
    offset,
    limit,
  }: {
    offset: number;
    limit: number;
  }): Promise<Task[]> {
    const tasks = await db
      .select(fullTaskSelect)
      .from(sqTasks)
      .innerJoin(
        organizationServices,
        eq(sqTasks.serviceId, organizationServices.id),
      )
      .innerJoin(organizations, eq(sqTasks.organizationId, organizations.id))
      .innerJoin(users, eq(sqTasks.clientId, users.id))
      .limit(limit)
      .offset(offset);
    return tasks as unknown as Task[];
  }

  static async getTaskById(taskId: string): Promise<Task | undefined> {
    const [task] = await db
      .select(fullTaskSelect)
      .from(sqTasks)
      .innerJoin(
        organizationServices,
        eq(sqTasks.serviceId, organizationServices.id),
      )
      .innerJoin(organizations, eq(sqTasks.organizationId, organizations.id))
      .innerJoin(users, eq(sqTasks.clientId, users.id))
      .where(eq(sqTasks.id, taskId))
      .limit(1);
    return task as unknown as Task | undefined;
  }

  static async getAllTasksByOrganizationId(
    organizationId: string,
    { offset, limit }: { offset: number; limit: number },
  ): Promise<Task[]> {
    const tasks = await db
      .select(fullTaskSelect)
      .from(sqTasks)
      .innerJoin(
        organizationServices,
        eq(sqTasks.serviceId, organizationServices.id),
      )
      .innerJoin(organizations, eq(sqTasks.organizationId, organizations.id))
      .innerJoin(users, eq(sqTasks.clientId, users.id))
      .where(eq(sqTasks.organizationId, organizationId))
      .limit(limit)
      .offset(offset);
    return tasks as unknown as Task[];
  }

  static async getTasksCountByOrganizationId(
    organizationId: string,
  ): Promise<number> {
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sqTasks)
      .where(eq(sqTasks.organizationId, organizationId));
    return countResult[0]?.count ?? 0;
  }

  static async getAllTasksByClientId(
    clientId: string,
    { offset, limit }: { offset: number; limit: number },
  ): Promise<Task[]> {
    const tasks = await db
      .select(fullTaskSelect)
      .from(sqTasks)
      .innerJoin(
        organizationServices,
        eq(sqTasks.serviceId, organizationServices.id),
      )
      .innerJoin(organizations, eq(sqTasks.organizationId, organizations.id))
      .innerJoin(users, eq(sqTasks.clientId, users.id))
      .where(eq(sqTasks.clientId, clientId))
      .limit(limit)
      .offset(offset);
    return tasks as unknown as Task[];
  }

  static async getTasksCountByClientId(clientId: string): Promise<number> {
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sqTasks)
      .where(eq(sqTasks.clientId, clientId));
    return countResult[0]?.count ?? 0;
  }

  static async getAllTasksByServiceId(
    serviceId: string,
    { offset, limit }: { offset: number; limit: number },
  ): Promise<Task[]> {
    const tasks = await db
      .select(fullTaskSelect)
      .from(sqTasks)
      .innerJoin(
        organizationServices,
        eq(sqTasks.serviceId, organizationServices.id),
      )
      .innerJoin(organizations, eq(sqTasks.organizationId, organizations.id))
      .innerJoin(users, eq(sqTasks.clientId, users.id))
      .where(eq(sqTasks.serviceId, serviceId))
      .limit(limit)
      .offset(offset);
    return tasks as unknown as Task[];
  }

  static async getTasksCountByServiceId(serviceId: string): Promise<number> {
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sqTasks)
      .where(eq(sqTasks.serviceId, serviceId));
    return countResult[0]?.count ?? 0;
  }

  static async updateTask(taskUpdate: TaskUpdate): Promise<Task> {
    const [task] = await db
      .update(sqTasks)
      .set({ ...taskUpdate, updatedAt: new Date() })
      .where(eq(sqTasks.id, taskUpdate.id))
      .returning();
    return task as unknown as Task;
  }

  static async deleteTaskById(taskId: string): Promise<void> {
    await db.delete(sqTasks).where(eq(sqTasks.id, taskId));
  }

  static async appendTaskProgress(
    taskId: string,
    progress: TaskProgress,
  ): Promise<Task | undefined> {
    const [currentTask] = await db
      .select()
      .from(sqTasks)
      .where(eq(sqTasks.id, taskId))
      .limit(1);
    if (!currentTask) {
      return undefined;
    }

    // Default to empty array if progress is null/undefined in DB
    const currentProgress: TaskProgress[] = Array.isArray(currentTask.progress)
      ? currentTask.progress
      : [];

    const updatedProgress = [...currentProgress, progress];

    const [task] = await db
      .update(sqTasks)
      .set({ progress: updatedProgress, updatedAt: new Date() })
      .where(eq(sqTasks.id, taskId))
      .returning();

    return task as unknown as Task;
  }

  static async getTasksCount(): Promise<number> {
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(sqTasks);
    return countResult[0]?.count ?? 0;
  }
}
