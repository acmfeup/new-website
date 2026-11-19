import data from "@/data/hub.json";

export type HubRole = "member" | "editor" | "admin";

export interface HubUser {
  id: number;
  name: string;
  department: string;
  role: HubRole;
}

// TODO: replace w/ real thing
export async function getCurrentUser(): Promise<HubUser> {
  const role = data.user.role;
  // Is this BAD CODE??
  return { ...data.user, role: data.user.role as HubRole };
}

export async function getUpcomingEvents() {
  return data.events;
}
