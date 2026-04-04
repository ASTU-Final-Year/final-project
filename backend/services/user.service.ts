// services/user.service.ts

import { eq } from "drizzle-orm";
import { User, UserSec, UserSecInit } from "~/base";
import { db } from "~/db";
import { users } from "~/db/schema";
import PasswordService from "./password.service";

export default class UserService {
  static async createUser(userInit: UserSecInit): Promise<UserSec> {
    const password = await PasswordService.hashPassword(userInit.password);
    const userData: UserSecInit = {
      firstname: userInit.firstname,
      lastname: userInit.lastname,
      gender: userInit.gender,
      role: userInit.role,
      email: userInit.email,
      phone: userInit.phone,
      password,
    };
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  static async createClientUser(
    clientUserInit: Omit<UserSecInit, "role">,
  ): Promise<UserSec> {
    const password = await PasswordService.hashPassword(
      clientUserInit.password,
    );
    const userData: UserSecInit = {
      firstname: clientUserInit.firstname,
      lastname: clientUserInit.lastname,
      gender: clientUserInit.gender,
      role: "client",
      email: clientUserInit.email,
      phone: clientUserInit.phone,
      password,
    };
    const [clientUser] = await db.insert(users).values(userData).returning();
    return clientUser;
  }

  static async createEmployeeUser(
    employeeUserInit: Omit<UserSecInit, "role">,
  ): Promise<UserSec> {
    const password = await PasswordService.hashPassword(
      employeeUserInit.password,
    );
    const userData: UserSecInit = {
      firstname: employeeUserInit.firstname,
      lastname: employeeUserInit.lastname,
      gender: employeeUserInit.gender,
      role: "employee",
      email: employeeUserInit.email,
      phone: employeeUserInit.phone,
      password,
    };
    const [employeeUser] = await db.insert(users).values(userData).returning();
    return employeeUser;
  }

  static async createAdminUser(
    clientUserInit: Omit<UserSecInit, "role">,
  ): Promise<UserSec> {
    const password = await PasswordService.hashPassword(
      clientUserInit.password,
    );
    const userData: UserSecInit = {
      firstname: clientUserInit.firstname,
      lastname: clientUserInit.lastname,
      gender: clientUserInit.gender,
      role: "organization_admin",
      email: clientUserInit.email,
      phone: clientUserInit.phone,
      password,
    };
    const [organizationAdminUser] = await db
      .insert(users)
      .values(userData)
      .returning();
    return organizationAdminUser;
  }

  static async existsUserWithEmail(email: string): Promise<boolean> {
    const [user] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.email, email));
    return user != null;
  }

  static async getUserByEmail(email: string): Promise<UserSec> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  static async getUserById(userId: string): Promise<UserSec> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user;
  }

  static async updateUserById(
    userUpdate: UserSecInit & Pick<User, "id">,
  ): Promise<UserSec> {
    const { id, ...userUpdateSafe } = userUpdate;
    const [user] = await db
      .update(users)
      .set({ ...userUpdateSafe, updatedAt: new Date() })
      .where(eq(users.id, userUpdate.id))
      .returning();
    return user;
  }

  static async deleteUserById(userId: string): Promise<void> {
    await db.delete(users).where(eq(users.id, userId));
  }
}
