import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ServiceUnavailableException,
} from "@nestjs/common";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Get()
  async getEvents() {
    const eventList = await this.events.findAll();

    return eventList;
  }

  @Get(":slug")
  async findOne(@Param("slug") slug: string) {
    const event = await this.events.findBySlug(slug);

    if (!event) {
      throw new NotFoundException(`Event "${slug}" not found`);
    }

    return event;
  }
}
