import type { Metadata } from "next";
import { BeToolWorkbench } from "@/components/betool/BeToolWorkbench";

export const metadata: Metadata = { title: "Base64加解密" };

export default function Base64Page() {
  return <BeToolWorkbench tool="base64" />;
}
