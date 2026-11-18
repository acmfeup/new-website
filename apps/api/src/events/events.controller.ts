import { Controller, Get, ServiceUnavailableException } from "@nestjs/common";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Get()
  async getEvents() {
    const eventList = await this.events.findAll();

    return eventList;
  }
}
