"use client";

import { useState } from "react";
import { Search, Loader2, ArrowUpCircle, ClipboardCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SubscriptionUpgrade, usePendingUpgrades } from "@/hooks/superadmin/use-subscription";
import { formatRupiah } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { DetailUpgradeDialog } from "./detail-upgrade-dialog";

export function UpgradeRequestContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [selectedRequest, setSelectedRequest] = useState<SubscriptionUpgrade | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, isError, refetch } = usePendingUpgrades(page, debouncedSearch);

  const requests = data?.data || [];
  const meta = data?.meta;

  const handleOpenDetail = (req: SubscriptionUpgrade) => {
    setSelectedRequest(req);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Upgrade Requests</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Kelola permintaan upgrade plan dari Owner tenant
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap sm:justify-between pt-2">
        {/* Search */}
        <div className="relative">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pr-9 h-9 w-44 text-sm border-gray-200 rounded-full"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white mt-4">
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-b-gray-200">
                <TableHead className="font-semibold text-gray-600">Usaha & Owner</TableHead>
                <TableHead className="font-semibold text-gray-600">Plan Tujuan</TableHead>
                <TableHead className="font-semibold text-gray-600">Tanggal Request</TableHead>
                <TableHead className="font-semibold text-gray-600 text-right">Harga Plan</TableHead>
                <TableHead className="font-semibold text-gray-600 text-center w-20">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center text-red-500">
                    Gagal memuat data. Silakan coba lagi.
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <ArrowUpCircle className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-lg font-medium text-gray-900">Belum Ada Request</p>
                      <p className="text-sm">Semua permintaan upgrade plan sudah tertangani.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((req: SubscriptionUpgrade) => (
                  <TableRow key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">{req.nama_perusahaan}</span>
                        <span className="text-sm text-gray-500">{req.nama_owner}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-slate-100 text-[#1D5E84] text-xs font-semibold">
                        {req.jenis_subscription}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {new Date(req.start_subscription).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right font-medium text-gray-900">
                      {formatRupiah(req.harga)}
                    </TableCell>
                    <TableCell className="text-center">
                      <button
                        onClick={() => handleOpenDetail(req)}
                        className="bg-[#3874BC] hover:bg-[#2c5b96] text-white flex items-center justify-center w-7 h-7 rounded-full mx-auto transition-colors cursor-pointer"
                        title="Proses Request"
                      >
                        <ClipboardCheck className="w-3.5 h-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {meta && meta.last_page > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-gray-500">
              Menampilkan Halaman <span className="font-medium text-gray-900">{meta.current_page}</span> dari{" "}
              <span className="font-medium text-gray-900">{meta.last_page}</span> halaman
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={meta.current_page === 1}
                className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={meta.current_page === meta.last_page}
                className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
      </div>

      <DetailUpgradeDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        request={selectedRequest}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
