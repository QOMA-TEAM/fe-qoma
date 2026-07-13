"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PendingApproval } from "@/types/superadmin/dashboard";
import { CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface PendingApprovalCardProps {
  approvals: PendingApproval[];
  isLoading?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), "d MMM yyyy", { locale: id });
  } catch {
    return dateStr;
  }
}

export function PendingApprovals({
  approvals,
  isLoading,
  onApprove,
  onReject,
}: PendingApprovalCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F1F5F9] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-[#1E293B] font-bold text-lg">Pending Approval</h4>
          <p className="text-[#64748B] text-sm font-medium mt-1">Usaha menunggu persetujuan</p>
        </div>
        <Badge
          variant="secondary"
          className="bg-orange-50 text-orange-500 border-0 text-xs px-3 py-1"
        >
          {approvals.length} pending
        </Badge>
      </div>

      <div className="flex-1 w-full relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400">
            Memuat data...
          </div>
        ) : approvals.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400">
            Tidak ada usaha yang menunggu persetujuan
          </div>
        ) : (
          <ScrollArea className="h-[288px]">
            <div className="space-y-3 pr-4">
              {approvals.map((approval) => (
                <div
                  key={approval.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-bold">
                      {getInitials(approval.owner.nama_lengkap)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1E293B] truncate">
                      {approval.nama_usaha}
                    </p>
                    <p className="text-xs font-medium text-[#64748B] truncate mt-0.5">
                      {approval.owner.nama_lengkap} ·{" "}
                      {formatDate(approval.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-full bg-white shadow-sm border border-gray-100"
                      onClick={() => onApprove?.(approval.id)}
                      title="Setujui"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full bg-white shadow-sm border border-gray-100"
                      onClick={() => onReject?.(approval.id)}
                      title="Tolak"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
}
