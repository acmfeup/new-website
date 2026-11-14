import { Controller, Get, NotFoundException, Param } from "@nestjs/common";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Get(":slug")
  async findOne(@Param("slug") slug: string) {
    const event = await this.events.findBySlug(slug);

    if (!event) {
      throw new NotFoundException(`Event "${slug}" not found`);
    }

    return event;
  }
}
