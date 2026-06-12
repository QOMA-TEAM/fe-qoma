// components/modals/OutletInfoSheet.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MapPin, Phone } from "lucide-react";
import Image from "next/image";

interface OutletInfoSheetProps {
  open: boolean;
  onClose: () => void;
  outlet: {
    name: string;
    logo: string;
    address: string;
    operationalHours: { day: string; hours: string }[];
    visitUrl?: string;
    contactUrl?: string;
  };
}

export function OutletInfoSheet({
  open,
  onClose,
  outlet,
}: OutletInfoSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-xl font-bold">Outlet Info</SheetTitle>
        </SheetHeader>
        <Separator />

        {/* Outlet Identity */}
        <div className="flex items-start gap-4 py-5">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-amber-50 border flex-shrink-0">
            <Image
              src={outlet.logo}
              alt={outlet.name}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-gray-900 text-base">{outlet.name}</h3>
            <div className="flex items-start gap-1.5 text-gray-500 text-sm">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-400" />
              <span>{outlet.address}</span>
            </div>
            <div className="flex gap-2 mt-2">
              {outlet.visitUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-500 border-orange-400 hover:bg-orange-50 text-xs"
                  onClick={() => window.open(outlet.visitUrl, "_blank")}
                >
                  Visit Us
                </Button>
              )}
              {outlet.contactUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-500 border-orange-400 hover:bg-orange-50 text-xs"
                  onClick={() => window.open(outlet.contactUrl, "_blank")}
                >
                  Contact Us
                </Button>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Operational Hours */}
        <div className="py-5">
          <h4 className="font-semibold text-gray-800 mb-4">
            Operational Hours
          </h4>
          <div className="flex flex-col gap-2">
            {outlet.operationalHours.map((row) => (
              <div
                key={row.day}
                className="flex justify-between items-center border border-orange-300 rounded-xl px-4 py-3"
              >
                <span className="text-gray-700 font-medium text-sm">
                  {row.day}
                </span>
                <span className="text-gray-700 text-sm">{row.hours}</span>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
