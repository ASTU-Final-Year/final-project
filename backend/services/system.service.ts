// services/system.service.ts

import { checkDBConnection } from "~/db";

export default class SystemService {
  static async checkDBConnection(): Promise<boolean> {
    return await checkDBConnection();
  }

  static async getSystemStatus(): Promise<{
    dbActive: boolean;
    systemActive: boolean;
  }> {
    const dbActive = await this.checkDBConnection();
    const systemActive = dbActive;
    const systemStatus = {
      dbActive,
      systemActive,
    };
    return systemStatus;
  }
}
