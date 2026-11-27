import type { Metadata } from "next";
import { BeToolWorkbench } from "@/components/betool/BeToolWorkbench";

export const metadata: Metadata = { title: "UUID生成器" };

export default function UuidPage() {
  return <BeToolWorkbench tool="uuid" />;
}
