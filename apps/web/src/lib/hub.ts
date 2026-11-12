import data from "@/data/hub.json";

export type HubRole = "member" | "editor" | "admin";

export interface HubUser {
  name: string;
  department: string;
  role: HubRole;
}

// Fake API data until the hub is connected to the backend.
export async function getCurrentUser(): Promise<HubUser> {
  const role = data.user.role;
  if (role !== "member" && role !== "editor" && role !== "admin") {
    throw new Error(`Unknown hub role: ${role}`);
  }
  return { ...data.user, role };
}

export async function getUpcomingEvents() {
  return data.events;
}

export async function getResources() {
  return data.resources;
}
