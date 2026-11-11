import team from "@/data/team.json";

// "github", "linkedin", "instagram", "website", or a type added later.
export type MemberLink = {
  type: string;
  url: string;
};

// A missing value is null, never an omitted key.
export type TeamMember = {
  id: number;
  name: string;
  role: string;
  // Path under apps/web/public
  photoUrl: string | null;
  // Empty when the member has none. List order is display order.
  // At most 3 per member, enforced by the backend later.
  links: MemberLink[];
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
