"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ChevronDown, ChevronUp, ChevronsUpDown, Search, Loader2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tenant } from "@/types/superadmin/tenant";
import { format } from "date-fns";
import { id } from "date-fns/locale";

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    return format(new Date(dateStr), "d MMM yyyy", { locale: id });
  } catch {
    return dateStr;
  }
}

type SortKey = "nama_usaha" | "email" | "status" | "created_at" | "outlets_count";
type SortDir = "asc" | "desc";

interface TenantTableProps {
  tenants: Tenant[];
  loading: boolean;
  onView: (tenant: Tenant) => void;
}

export function TenantTable({ tenants, loading, onView }: TenantTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleColumnSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tenants.filter(
      (t) =>
        t.nama_usaha.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        (t.owner?.nama_lengkap?.toLowerCase().includes(q) ?? false),
    );
  }, [tenants, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av: string | number = "";
      let bv: string | number = "";

      switch (sortKey) {
        case "nama_usaha":
          av = a.nama_usaha;
          bv = b.nama_usaha;
          break;
        case "email":
          av = a.email;
          bv = b.email;
          break;
        case "status":
          av = a.status;
          bv = b.status;
          break;
        case "created_at":
          av = a.created_at;
          bv = b.created_at;
          break;
        case "outlets_count":
          av = a.outlets_count;
          bv = b.outlets_count;
          break;
      }

      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col)
      return <ChevronsUpDown className="w-3 h-3 ml-1 opacity-40" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 ml-1" />
    ) : (
      <ChevronDown className="w-3 h-3 ml-1" />
    );
  };

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "nama_usaha", label: "Nama Perusahaan" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Created At" },
    { key: "outlets_count", label: "Jumlah Outlet" },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      active: "bg-green-100 text-green-700",
      approved: "bg-green-100 text-green-700", // fallback
      pending: "bg-yellow-100 text-yellow-700",
      rejected: "bg-red-100 text-red-700",
      suspended: "bg-gray-100 text-gray-700",
    };
    return (
      <span
        className={cn(
          "text-xs font-semibold px-3 py-1 rounded-full capitalize",
          map[status] ?? "bg-gray-100 text-gray-600",
        )}
      >
        {status}
      </span>
    );
  };

  const columns: { key: SortKey; label: string; className?: string; sortable?: boolean }[] = [
    { key: "nama_usaha", label: "Nama Perusahaan", sortable: false },
    { key: "email", label: "Email", sortable: false },
    { key: "status", label: "Status", sortable: false },
    { key: "created_at", label: "Created At", sortable: true },
    { key: "outlets_count", label: "Jumlah Outlet", sortable: true },
  ];

  return (
    <>
      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap sm:justify-between mb-4 pt-2">
        {/* Search */}
        <div className="relative">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9 h-9 w-44 text-sm border-gray-200 rounded-full bg-white"
          />

          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>


      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-gray-200">
              <TableHead className="w-16 text-gray-600 font-semibold text-sm">
                No
              </TableHead>

              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(col.sortable !== false && "cursor-pointer select-none", col.className)}
                  onClick={() => col.sortable !== false && handleColumnSort(col.key)}
                >
                  <div className="flex items-center text-gray-600 font-semibold text-sm">
                    {col.label}
                    {col.sortable !== false && <SortIcon col={col.key} />}
                  </div>
                </TableHead>
              ))}

              <TableHead className="text-gray-600 font-semibold text-sm">
                Subscription
              </TableHead>

              <TableHead className="text-gray-600 font-semibold text-sm text-center">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-gray-400 py-12 text-sm"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memuat data...
                  </div>
                </TableCell>
              </TableRow>
            ) : sorted.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-gray-400 py-12 text-sm"
                >
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((row, idx) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-50/50 border-gray-100 transition-colors"
                >
                  <TableCell className="text-gray-500 text-sm">
                    {idx + 1}
                  </TableCell>

                  <TableCell className="text-gray-800 text-sm">
                    {row.nama_usaha}
                  </TableCell>

                  <TableCell className="text-gray-600 text-sm">
                    {row.email}
                  </TableCell>

                  <TableCell>{statusBadge(row.status)}</TableCell>

                  <TableCell className="text-gray-600 text-sm">
                    {formatDate(row.created_at)}
                  </TableCell>

                  <TableCell className="text-gray-600 text-sm">
                    {row.outlets_count}
                  </TableCell>

                  <TableCell className="text-gray-600 text-sm">
                    {typeof row.subscription?.plan === 'string'
                      ? row.subscription.plan
                      : (row.subscription?.plan as any)?.nama_plan ?? "-"}
                  </TableCell>

                  <TableCell>
                    <button
                      onClick={() => onView(row)}
                      className="bg-[#3874BC] hover:bg-[#2c5b96] text-white flex items-center justify-center w-7 h-7 rounded-full mx-auto transition-colors cursor-pointer"
                      title="View"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
