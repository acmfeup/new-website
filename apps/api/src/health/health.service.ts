import { Injectable, Logger } from "@nestjs/common";
import { pool } from "../db/client";

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  async isDatabaseUp(): Promise<boolean> {
    try {
      await pool.query("select 1");
      return true;
    } catch (error) {
      this.logger.warn("database unreachable", error);
      return false;
    }
  }
}
