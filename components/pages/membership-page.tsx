"use client";
import {useState} from "react";
import Link from "next/link";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {MembershipAction,ManageMembership} from "@/components/membership-action";
import {QueryBoundary} from "@/components/catalog/query-boundary";
import {StatePanel} from "@/components/catalog/catalog-states";
import {authIsConfigured} from "@/lib/auth-client";
import {Pricing14, Pricing14Plan, Pricing14Toggle} from "@/components/relume/pricing14";
import {Button, buttonVariants} from "@/components/ui/button";
import {statusText, textLink} from "@/lib/typography";

const currency = new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"});
const cadences = [{value:"monthly",label:"Monthly"},{value:"annual",label:"Annual"}] as const;

function Plans(){
  const plans=useQuery(api.billing.plans,{});
  const [annual,setAnnual]=useState(false);
  return <>
    <Pricing14Toggle label="Billing cadence" options={cadences} value={annual?"annual":"monthly"} onChange={(value)=>setAnnual(value==="annual")}/>
    {!plans ? <p role="status" className={`text-center ${statusText}`}>Loading membership plans…</p>
    : !plans.length ? <StatePanel role="status" eyebrow="Membership" title="No Plans Available">No membership plans are currently available.</StatePanel>
    : <div className="grid grid-cols-1 gap-8 md:grid-cols-2">{plans.map(p=>(
        <Pricing14Plan
          key={p._id}
          planName={p.name}
          price={p.key==="free"?"Free":currency.format((annual?p.annualPriceInCents:p.monthlyPriceInCents)/100)}
          cadence={p.key==="free"?undefined:annual?"year":"month"}
          description={p.description}
          features={p.features}
          action={<MembershipAction name={p.name} tier={p.key==="free"?null:p.key} annual={annual} className={`${buttonVariants({variant:p.key==="free"?"secondary":"default"})} w-full`}>{p.key==="free"?"Free Account":"Choose Plan"}</MembershipAction>}
        />
      ))}</div>}
    <ManageMembership/>
  </>;
}

export default function MembershipPage(){
  return <main>
    <Pricing14 tagline="Membership" heading="Join the Circle" description={<p>Explore the currently published membership plans.</p>}>
      {authIsConfigured
        ? <QueryBoundary fallback={(_e,retry)=><StatePanel role="alert" eyebrow="Something went wrong" title="Plans Are Unavailable" actions={<Button type="button" onClick={retry}>Retry</Button>}>We couldn’t load the membership plans.</StatePanel>}><Plans/></QueryBoundary>
        : <StatePanel role="status" eyebrow="Not connected" title="Membership Is Not Connected Yet">Membership plans will appear here once billing is connected.</StatePanel>}
      <div className="mt-10 text-center">
        <Link href="/contact" className={textLink}>Questions? Contact the Circle ↗</Link>
      </div>
    </Pricing14>
  </main>;
}
