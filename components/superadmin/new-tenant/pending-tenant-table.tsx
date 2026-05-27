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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, ChevronsUpDown, Search, Loader2, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tenant } from "@/types/superadmin/tenant";

type SortKey = "nama_usaha" | "email" | "status" | "created_at" | "outlets_count";
type SortDir = "asc" | "desc";

interface PendingTenantTableProps {
  tenants: Tenant[];
  loading: boolean;
  onView: (tenant: Tenant) => void;
  onApprove: (tenant: Tenant) => void;
  onReject: (tenant: Tenant) => void;
}

export function PendingTenantTable({ tenants, loading, onView, onApprove, onReject }: PendingTenantTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("nama_usaha");
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
      approved: "bg-green-100 text-green-700",
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

  const columns: { key: SortKey; label: string; className?: string }[] = [
    { key: "nama_usaha", label: "Nama Perusahaan" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Created At" },
    { key: "outlets_count", label: "Jumlah Outlet" },
  ];

  return (
    <>
      {/* Controls */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Pending Tenant
          </h1>

          <p className="text-sm text-orange-400 mt-0.5">
            Daftar tenant yang menunggu persetujuan
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort By Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-1.5 text-sm border-gray-200 text-gray-700 h-9 rounded-full px-4"
              >
                Sort By
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              {sortOptions.map((item) => (
                <DropdownMenuItem
                  key={item.key}
                  onClick={() => handleColumnSort(item.key)}
                  className={cn(
                    "cursor-pointer",
                    sortKey === item.key && "font-medium text-blue-600",
                  )}
                >
                  {item.label}

                  {sortKey === item.key && (
                    <span className="ml-auto text-xs text-gray-400">
                      {sortDir === "asc" ? "\u2191" : "\u2193"}
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9 h-9 w-44 text-sm border-gray-200 rounded-full"
            />

            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
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
                  className={cn("cursor-pointer select-none", col.className)}
                  onClick={() => handleColumnSort(col.key)}
                >
                  <div className="flex items-center text-gray-600 font-semibold text-sm">
                    {col.label}
                    <SortIcon col={col.key} />
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
                  Tidak ada tenant pending.
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
                    {row.created_at}
                  </TableCell>

                  <TableCell className="text-gray-600 text-sm">
                    {row.outlets_count}
                  </TableCell>

                  <TableCell className="text-gray-600 text-sm">
                    {typeof row.subscription?.plan === 'object' && row.subscription?.plan !== null ? row.subscription.plan.nama_plan : (row.subscription?.plan ?? "-")}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 h-8 w-8 px-0 rounded-full"
                        onClick={() => onApprove(row)}
                        title="Approve"
                      >
                        <CheckCircle size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 h-8 px-3 rounded-full text-xs font-semibold"
                        onClick={() => onView(row)}
                      >
                        VIEW
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:bg-red-50 hover:text-red-600 h-8 w-8 px-0 rounded-full"
                        onClick={() => onReject(row)}
                        title="Reject"
                      >
                        <XCircle size={18} />
                      </Button>
                    </div>
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
