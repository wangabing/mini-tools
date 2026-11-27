import type { Metadata } from "next";
import { BeToolWorkbench } from "@/components/betool/BeToolWorkbench";

export const metadata: Metadata = { title: "URL编码/解码" };

export default function UrlEncodePage() {
  return <BeToolWorkbench tool="urlencode" />;
}
