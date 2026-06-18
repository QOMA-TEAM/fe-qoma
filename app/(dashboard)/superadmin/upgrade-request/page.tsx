import { Metadata } from "next";
import { UpgradeRequestContent } from "@/components/superadmin/upgrade-request/upgrade-request-content";
import { SuperadminHeader } from "@/components/superadmin/header";
export const metadata: Metadata = {
  title: "Upgrade Requests | QOMA",
  description: "Kelola permintaan upgrade plan dari tenant",
};

export default function UpgradeRequestPage() {
  return (
    <div className="flex flex-col flex-1 overflow-auto bg-gray-50/40">
      <SuperadminHeader />
      <UpgradeRequestContent />
    </div>
  );
}
