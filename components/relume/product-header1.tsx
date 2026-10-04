/**
 * Relume Product Header 1 (slug: product-header1), vendored via the Relume Library MCP.
 * Adaptations: keeps the breadcrumb and two-column header grid; the image carousel,
 * star rating, variant select, quantity field and shipping/returns accordion were
 * removed because books have one cover and none of that data exists — rendering it
 * would be fabricated. Media and details are slots for the live catalog book.
 */
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type BreadcrumbProps = {
  url?: string;
  title: string;
};

export type ProductHeader1Props = {
  breadcrumbs: BreadcrumbProps[];
  media: ReactNode;
  children: ReactNode;
};

export const ProductHeader1 = ({ breadcrumbs, media, children }: ProductHeader1Props) => {
  return (
    <header className="px-[5%] pt-8 pb-12 md:pt-10 md:pb-16 lg:pb-20">
      <div className="mx-auto w-full max-w-content">
        <Breadcrumb className="mb-6 flex flex-wrap items-center">
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <Fragment key={`${item.title}-${index}`}>
                <BreadcrumbItem>
                  {item.url ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.url}>{item.title}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.title}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid grid-cols-1 gap-y-8 md:gap-y-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-x-20">
          <div className="mx-auto w-full max-w-[18rem] lg:max-w-none">{media}</div>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </header>
  );
};
