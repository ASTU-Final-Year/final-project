import { eq } from "drizzle-orm";
import { UserSec, UserSecInit } from "~/base";
import { db } from "~/db";
import { users } from "~/db/schema";

export default class UserService {
  static async getUserByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result.length > 0 ? result[0] : undefined;
  }

  static async createAdminUser(user: UserSecInit) {
    const userData: UserSecInit = {
      id: crypto.randomUUID(),
      ...user,
    };
    const result = await db.insert(users).values(userData).returning();
    // console.log(await db.select().from(users));
    return result.length > 0 ? result[0] : undefined;
  }
}
