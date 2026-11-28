import data from "@/data/hub.json";

export type HubRole = "member" | "editor" | "admin";

export interface HubUser {
  id: number;
  name: string;
  department: string;
  role: HubRole;
}

export interface HubEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
}

// When the API is ready, only this body changes.
export async function getCurrentUser(): Promise<HubUser> {
  return { ...data.user, role: data.user.role as HubRole };
}

// When the API is ready, only this body changes.
export async function getUpcomingEvents(): Promise<HubEvent[]> {
  return data.events;
}
