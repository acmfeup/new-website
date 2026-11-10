import team from "@/data/team.json";

// A missing value is null, never an omitted key.
export type TeamMember = {
  id: number;
  name: string;
  role: string;
  // Path under apps/web/public
  photoUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
};

export type Department = {
  id: number;
  name: string;
  members: TeamMember[];
};

// When the API is ready, only this body changes.
export async function getTeam(): Promise<Department[]> {
  return team;
}
