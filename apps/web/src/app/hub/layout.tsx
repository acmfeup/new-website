import type { Metadata } from "next";
import HubSidebar from "@/components/hub/HubSidebar";
import { getCurrentUser } from "@/lib/hub";

export const metadata: Metadata = {
  title: "Hub | ACM FEUP",
  robots: { index: false, follow: false }, // dont come here bots!
};

export default async function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen bg-background md:flex">
      <HubSidebar role={user.role} />
      <main className="min-w-0 flex-1 px-6 py-10 md:px-12 md:py-16 lg:px-20">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
