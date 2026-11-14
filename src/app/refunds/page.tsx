import type { Metadata } from "next";
import LegalDoc from "@/components/legal/LegalDoc";
import { legalBySlug } from "@/lib/legal";

const doc = legalBySlug("refunds")!;

export const metadata: Metadata = {
  title: doc.title,
  description: doc.lead,
};

export default function Page() {
  return <LegalDoc doc={doc} />;
}
