import type { Metadata } from "next";
import StatusCheck from "./status-check";

export const metadata: Metadata = {
  title: "Status | ACM FEUP",
  robots: { index: false },
};

export default function StatusPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <StatusCheck />
    </main>
  );
}
