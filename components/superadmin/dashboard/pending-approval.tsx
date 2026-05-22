"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PendingApproval } from "@/types/dashboard";
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
    <Card className="border border-gray-100 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-gray-800">
              Pending Approval
            </CardTitle>
            <CardDescription className="text-xs text-gray-400 mt-0.5">
              Usaha menunggu persetujuan
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className="bg-orange-50 text-orange-500 border-0 text-xs"
          >
            {approvals.length} pending
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400">
            Memuat data...
          </div>
        ) : approvals.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400">
            Tidak ada usaha yang menunggu persetujuan
          </div>
        ) : (
          <ScrollArea className="max-h-72">
            <div className="space-y-3">
              {approvals.map((approval) => (
                <div
                  key={approval.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                >
                  {/* Avatar */}
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
                      {getInitials(approval.owner.nama_lengkap)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {approval.nama_usaha}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {approval.owner.nama_lengkap} ·{" "}
                      {formatDate(approval.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50 rounded-full"
                      onClick={() => onApprove?.(approval.id)}
                      title="Setujui"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-full"
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
      </CardContent>
    </Card>
  );
}
