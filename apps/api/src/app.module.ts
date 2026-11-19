import { Module } from "@nestjs/common";
import { EventsController } from "./events/events.controller";
import { EventsService } from "./events/events.service";
import { HealthController } from "./health/health.controller";
import { HealthService } from "./health/health.service";

@Module({
  controllers: [HealthController, EventsController],
  providers: [HealthService, EventsService],
})
export class AppModule {}
