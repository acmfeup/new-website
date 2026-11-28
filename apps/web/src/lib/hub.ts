import data from "@/data/hub.json";
import type { MemberLink, TeamMember } from "@/lib/team";

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

export interface ProfileUpdate {
  name: string;
  photoUrl: string | null;
  links: MemberLink[];
}

// When the API is ready, only this body changes.
export async function getCurrentUser(): Promise<HubUser> {
  return { ...data.user, role: data.user.role as HubRole };
}

// When the API is ready, only this body changes.
export async function getUpcomingEvents(): Promise<HubEvent[]> {
  return data.events;
}

// When the API is ready, only this body changes.
export async function getMyProfile(): Promise<TeamMember> {
  return data.profile;
}

// When the API is ready, only this body changes.
export async function updateMyProfile(
  input: ProfileUpdate,
): Promise<TeamMember> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return { ...data.profile, ...input };
}
