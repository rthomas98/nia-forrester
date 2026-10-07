import type { Metadata } from "next";
import SerialPage from "@/components/pages/serial-page";
export const metadata: Metadata = { title: "Serials & Essays", description: "Published writing by Nia Forrester", alternates: { canonical: "/serial" } };
export default async function Page({ searchParams }: { searchParams: Promise<{slug?:string}> }) { const {slug}=await searchParams; return <SerialPage slug={slug}/>; }
