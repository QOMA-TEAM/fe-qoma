"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface PlanBreadcrumbProps {
  segments?: BreadcrumbSegment[];
}

const DEFAULT_SEGMENTS: BreadcrumbSegment[] = [
  { label: "QOMA", href: "/superadmin/dashboard" },
  { label: "Kelola", href: "/superadmin" },
  { label: "Plan" },
];

export function PlanBreadcrumb({
  segments = DEFAULT_SEGMENTS,
}: PlanBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="text-xs text-gray-400">
        {segments.map((seg, idx) => {
          const isLast = idx === segments.length - 1;
          return (
            <BreadcrumbItem key={idx}>
              {isLast ? (
                <BreadcrumbPage className="text-xs text-gray-500 font-medium">
                  {seg.label}
                </BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <Link
                      href={seg.href ?? "#"}
                      className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      {seg.label}
                    </Link>
                  </BreadcrumbLink>
                  <BreadcrumbSeparator className="text-gray-300" />
                </>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
