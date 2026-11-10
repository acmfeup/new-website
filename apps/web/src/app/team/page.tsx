import type { Metadata } from "next";
import MemberCard from "@/components/MemberCard";
import { getTeam } from "@/lib/team";

export const metadata: Metadata = {
  title: "Team | ACM FEUP",
  description: "Meet the people behind ACM FEUP, department by department.",
};

export default async function TeamPage() {
  const departments = await getTeam();

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-balance">
            Who We Are
          </h1>
          <p className="mt-4 text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto text-pretty">
            Meet the students who make ACM FEUP happen.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {departments.map((department) => (
          <section
            key={department.id}
            aria-labelledby={`department-${department.id}`}
          >
            <h2
              id={`department-${department.id}`}
              className="text-2xl md:text-3xl font-bold text-foreground text-center text-balance wrap-break-word mb-8"
            >
              {department.name}
            </h2>
            <ul className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
              {department.members.map((member) => (
                <li key={member.id} className="w-full sm:w-64">
                  <MemberCard member={member} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
