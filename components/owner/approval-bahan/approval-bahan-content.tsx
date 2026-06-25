"use client"

import { useState } from "react"
import { useGetApprovalBahan, useApproveBahan, useRejectBahan } from "@/hooks/owner/use-approval-bahan"
import { ApprovalBahan } from "@/services/owner/approval-bahan"
import { ApprovalActionModal } from "./approval-action-modal"
import { formatRupiah } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Clock, Search, ChevronLeft, ChevronRight, Store, Check, X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"

export function ApprovalBahanContent() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedApproval, setSelectedApproval] = useState<ApprovalBahan | null>(null)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)

  const { data: response, isLoading } = useGetApprovalBahan(
    page,
    statusFilter !== "all" ? statusFilter : undefined
  )

  const { mutate: approve, isPending: isApproving } = useApproveBahan()
  const { mutate: reject, isPending: isRejecting } = useRejectBahan()

  const handleOpenAction = (approval: ApprovalBahan, action: "approve" | "reject") => {
    setSelectedApproval(approval)
    setActionType(action)
    setIsModalOpen(true)
  }

  const handleConfirmAction = (id: string, catatan: string) => {
    if (actionType === "approve") {
      approve(
        { id, catatan },
        {
          onSuccess: (data) => {
            toast.success(data.message || "Pengajuan disetujui")
            setIsModalOpen(false)
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Gagal menyetujui pengajuan")
          },
        }
      )
    } else if (actionType === "reject") {
      reject(
        { id, catatan },
        {
          onSuccess: (data) => {
            toast.success(data.message || "Pengajuan ditolak")
            setIsModalOpen(false)
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || "Gagal menolak pengajuan")
          },
        }
      )
    }
  }

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        )
      case "rejected":
        return (
          <span className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        )
      default:
        return (
          <span className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
            <Clock className="w-3.5 h-3.5" />
            Pending
          </span>
        )
    }
  }

  return (
    <>
      {/* Filters (Mimicking the Controls part of Bahan Baku) */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <div className="w-full sm:w-64">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white mt-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-gray-200">
              <TableHead className="text-gray-600 font-semibold text-sm">Tanggal Pengajuan</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm">Outlet & Bahan</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm">Perubahan Harga</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm">Alasan</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm">Status</TableHead>
              <TableHead className="text-gray-600 font-semibold text-sm text-right w-32">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400 py-12 text-sm">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : response?.data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-400 py-12 text-sm">
                  Tidak ada data pengajuan bahan baku.
                </TableCell>
              </TableRow>
            ) : (
              response?.data.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                  <TableCell className="text-gray-800 text-sm">
                    {new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-800 text-sm font-medium">
                        {item.bahan_outlet?.bahan_master?.nama || "Bahan Tidak Diketahui"}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Store className="w-3 h-3" />
                        {item.outlet?.nama_outlet || "Outlet Tidak Diketahui"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="line-through text-xs text-gray-400">
                        {formatRupiah(item.harga_lama)}
                      </span>
                      <span className="text-gray-800 text-sm font-medium">
                        {formatRupiah(item.harga_baru)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-600 line-clamp-2 max-w-[200px]" title={item.alasan}>
                      {item.alasan}
                    </p>
                  </TableCell>
                  <TableCell>{renderStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    {item.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenAction(item, "approve")}
                          className="flex items-center justify-center size-7 bg-[#3874BC] hover:bg-[#2c5b96] text-white rounded-md transition-colors cursor-pointer"
                          title="Setujui"
                        >
                          <Check className="size-4" />
                        </button>
                        <button
                          onClick={() => handleOpenAction(item, "reject")}
                          className="flex items-center justify-center size-7 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors cursor-pointer"
                          title="Tolak"
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-medium text-gray-400 italic">Selesai</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {response && response.meta.total > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-gray-500">
            Menampilkan Halaman <span className="font-medium text-gray-900">{response.meta.current_page}</span> dari <span className="font-medium text-gray-900">{response.meta.last_page}</span> halaman
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer bg-white"
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: response.meta.last_page }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`size-8 rounded-full text-xs font-medium transition-colors ${
                    page === pageNum
                      ? "bg-[#1D5E84] hover:bg-[#154663] text-white"
                      : "text-gray-600 hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(response.meta.last_page, p + 1))}
              disabled={page === response.meta.last_page}
              className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer bg-white"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ApprovalActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        isLoading={isApproving || isRejecting}
        approval={selectedApproval}
        actionType={actionType}
      />
    </>
  )
}
