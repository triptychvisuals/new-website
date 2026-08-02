import type { Metadata } from "next";
import ProjectHub from "@/components/dashboard/ProjectHub";

export const metadata: Metadata = {
  title: "Triptych — Dashboard",
};

/** Internal production dashboard (behind the site-wide preview password). */
export default function DashboardPage() {
  return <ProjectHub />;
}
