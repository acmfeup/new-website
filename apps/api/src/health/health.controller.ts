import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { HealthService } from "./health.service";

@Controller("health")
export class HealthController {
  constructor(private readonly health: HealthService) {}

  @Get()
  async check() {
    const databaseUp = await this.health.isDatabaseUp();

    if (!databaseUp) {
      throw new ServiceUnavailableException({
        status: "degraded",
        api: "up",
        db: "down",
      });
    }

    return { status: "ok", api: "up", db: "up" };
  }
}
