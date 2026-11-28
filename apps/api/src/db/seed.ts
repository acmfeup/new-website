import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { and, eq } from "drizzle-orm";
import { db, pool } from "./client";
import { departments, events, teamMembers } from "./schema";

async function seed() {
  const departmentsPath = resolve(__dirname, "../../../web/src/data/team.json");
  const departmentsText = await readFile(departmentsPath, "utf8");

  const departmentsList = JSON.parse(departmentsText);

  for (const [index, department] of departmentsList.entries()) {
    await db
      .insert(departments)
      .values({
        name: department.name,
        sortOrder: index,
      })
      .onConflictDoNothing({
        target: departments.name,
      });

    const [savedDepartment] = await db
      .select({ id: departments.id })
      .from(departments)
      .where(eq(departments.name, department.name))
      .limit(1);

    if (!savedDepartment) {
      throw new Error(`Departamento não encontrado: ${department.name}`);
    }

    for (const [memberIndex, member] of department.members.entries()) {
      const [existingMember] = await db
        .select({ id: teamMembers.id })
        .from(teamMembers)
        .where(
          and(
            eq(teamMembers.departmentId, savedDepartment.id),
            eq(teamMembers.name, member.name),
            eq(teamMembers.role, member.role),
          ),
        )
        .limit(1);

      if (existingMember) {
        continue;
      }

      await db.insert(teamMembers).values({
        departmentId: savedDepartment.id,
        name: member.name,
        role: member.role,
        photoUrl: member.photoUrl,
        sortOrder: memberIndex,
        links: member.links,
      });
    }
  }

  const eventsPath = resolve(__dirname, "../../../web/src/data/events.json");
  const eventsText = await readFile(eventsPath, "utf8");
  const eventsList = JSON.parse(eventsText);

  for (const event of eventsList) {
    await db
      .insert(events)

      .values({
        slug: event.slug,
        title: event.title,
        startsAt: new Date(event.startsAt),
        endsAt: event.endsAt ? new Date(event.endsAt) : null,
        location: event.location,
        description: event.description,
        coverImage: event.coverImage ?? null,
        speakers: event.speakers ?? [],
        organisers: event.organisers ?? [],
        photos: event.photos ?? [],
        links: event.links ?? [],
      })

      .onConflictDoNothing({
        target: events.slug,
      });
  }
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
