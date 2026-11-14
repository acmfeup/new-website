import { NotFoundException } from "@nestjs/common";
import { describe, expect, it } from "vitest";
import { EventsController } from "./events.controller";
import type { EventsService } from "./events.service";

const event = {
  id: 1,
  slug: "example-event",
  title: "Example event",
  startsAt: new Date("2025-04-10T17:00:00Z"),
  endsAt: null,
  location: "FEUP, Porto",
  description: "Demonstration record.",
  coverImage: "/porto.png",
  speakers: [],
  organisers: ["ACM FEUP"],
  links: [],
};

function controllerWith(found: typeof event | undefined) {
  const service = { findBySlug: async () => found } as unknown as EventsService;
  return new EventsController(service);
}

describe("EventsController.findOne", () => {
  it("returns the event when the slug exists", async () => {
    await expect(
      controllerWith(event).findOne("example-event"),
    ).resolves.toEqual(event);
  });

  it("answers 404 when the slug does not exist", async () => {
    await expect(
      controllerWith(undefined).findOne("missing"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("serialises dates as ISO 8601 strings", () => {
    expect(JSON.parse(JSON.stringify(event)).startsAt).toBe(
      "2025-04-10T17:00:00.000Z",
    );
  });
});
