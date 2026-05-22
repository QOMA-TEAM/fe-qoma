"use client";

import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { ChevronDown, ChevronUp, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Subscription = {
  id: number;
  namaPerusahaan: string;
  createdAt: string;
  updatedAt: string;
  jenisSubscription: string;
  kadaluarsaSubscription: string;
};

const subscriptions: Subscription[] = [
  {
    id: 1,
    namaPerusahaan: "Budiono Burjo",
    createdAt: "2026-04-29",
    updatedAt: "2026-04-29",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-05-29",
  },
  {
    id: 2,
    namaPerusahaan: "Aisha Karim",
    createdAt: "2026-05-01",
    updatedAt: "2026-05-01",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-06-01",
  },
  {
    id: 3,
    namaPerusahaan: "Carlos Mendez",
    createdAt: "2026-05-05",
    updatedAt: "2026-05-05",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-06-05",
  },
  {
    id: 4,
    namaPerusahaan: "Diana Lee",
    createdAt: "2026-05-10",
    updatedAt: "2026-05-10",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-06-10",
  },
  {
    id: 5,
    namaPerusahaan: "Ethan Kim",
    createdAt: "2026-05-15",
    updatedAt: "2026-05-15",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-06-15",
  },
  {
    id: 6,
    namaPerusahaan: "Fatima Zahir",
    createdAt: "2026-05-20",
    updatedAt: "2026-05-20",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-06-20",
  },
  {
    id: 7,
    namaPerusahaan: "George Clark",
    createdAt: "2026-05-25",
    updatedAt: "2026-05-25",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-06-25",
  },
  {
    id: 8,
    namaPerusahaan: "Hannah Patel",
    createdAt: "2026-06-01",
    updatedAt: "2026-06-01",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-07-01",
  },
  {
    id: 9,
    namaPerusahaan: "Ian Chen",
    createdAt: "2026-06-05",
    updatedAt: "2026-06-05",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-07-05",
  },
  {
    id: 10,
    namaPerusahaan: "Jasmine Wu",
    createdAt: "2026-06-10",
    updatedAt: "2026-06-10",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-07-10",
  },
  {
    id: 11,
    namaPerusahaan: "Kevin O'Brien",
    createdAt: "2026-06-15",
    updatedAt: "2026-06-15",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-07-15",
  },
  {
    id: 12,
    namaPerusahaan: "Lara Thompson",
    createdAt: "2026-06-20",
    updatedAt: "2026-06-20",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-07-20",
  },
  {
    id: 13,
    namaPerusahaan: "Mohammed Ali",
    createdAt: "2026-06-25",
    updatedAt: "2026-06-25",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-07-25",
  },
  {
    id: 14,
    namaPerusahaan: "Nora Smith",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-08-01",
  },
  {
    id: 15,
    namaPerusahaan: "Oscar Garcia",
    createdAt: "2026-07-05",
    updatedAt: "2026-07-05",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-08-05",
  },
  {
    id: 16,
    namaPerusahaan: "Penny Wong",
    createdAt: "2026-07-10",
    updatedAt: "2026-07-10",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-08-10",
  },
  {
    id: 17,
    namaPerusahaan: "Quinton Reyes",
    createdAt: "2026-07-15",
    updatedAt: "2026-07-15",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-08-15",
  },
  {
    id: 18,
    namaPerusahaan: "Rita Johnson",
    createdAt: "2026-07-20",
    updatedAt: "2026-07-20",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-08-20",
  },
  {
    id: 19,
    namaPerusahaan: "Simon Hayes",
    createdAt: "2026-07-25",
    updatedAt: "2026-07-25",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-08-25",
  },
  {
    id: 20,
    namaPerusahaan: "Tina Nguyen",
    createdAt: "2026-07-30",
    updatedAt: "2026-07-30",
    jenisSubscription: "Pro",
    kadaluarsaSubscription: "2026-08-30",
  },
];

type SortKey = keyof Subscription;
type SortDir = "asc" | "desc";

export default function DetailSubscriptionPage() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("id");
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
    return subscriptions.filter(
      (s) =>
        s.namaPerusahaan.toLowerCase().includes(q) ||
        s.jenisSubscription.toLowerCase().includes(q),
    );
  }, [search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
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
    { key: "id", label: "No" },
    { key: "namaPerusahaan", label: "Nama Perusahaan" },
    { key: "createdAt", label: "Created At" },
    { key: "kadaluarsaSubscription", label: "Kadaluarsa" },
  ];

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex items-center h-14 border-b px-6">
        <Separator orientation="vertical" className="mr-2 h-4" />

        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-muted-foreground text-sm">
                Management Subscription
              </span>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Detail Subscription</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* Page Content */}
      <div className="p-8">
        {/* Page Title + Controls */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Detail Subscription
            </h1>

            <p className="text-sm text-orange-400 mt-0.5">
              Informasi Subscription
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
                        {sortDir === "asc" ? "↑" : "↓"}
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
                {[
                  { key: "id" as SortKey, label: "No", className: "w-16" },
                  {
                    key: "namaPerusahaan" as SortKey,
                    label: "Nama Perusahaan",
                    className: "",
                  },
                  {
                    key: "createdAt" as SortKey,
                    label: "Created At",
                    className: "",
                  },
                  {
                    key: "updatedAt" as SortKey,
                    label: "Updated At",
                    className: "",
                  },
                  {
                    key: "jenisSubscription" as SortKey,
                    label: "Jenis Subscription",
                    className: "",
                  },
                  {
                    key: "kadaluarsaSubscription" as SortKey,
                    label: "Kadaluarsa Subscription",
                    className: "",
                  },
                ].map((col) => (
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
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sorted.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-50/50 border-gray-100 transition-colors"
                >
                  <TableCell className="text-gray-500 text-sm">
                    {row.id}
                  </TableCell>

                  <TableCell className="text-gray-800 text-sm">
                    {row.namaPerusahaan}
                  </TableCell>

                  <TableCell className="text-gray-600 text-sm">
                    {row.createdAt}
                  </TableCell>

                  <TableCell className="text-gray-600 text-sm">
                    {row.updatedAt}
                  </TableCell>

                  <TableCell className="text-gray-600 text-sm">
                    {row.jenisSubscription}
                  </TableCell>

                  <TableCell className="text-gray-600 text-sm">
                    {row.kadaluarsaSubscription}
                  </TableCell>

                  <TableCell>
                    <button className="bg-green-100 hover:bg-green-200 text-green-700 text-xs font-bold h-7 px-5 rounded-full transition-colors">
                      VIEW
                    </button>
                  </TableCell>
                </TableRow>
              ))}

              {sorted.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-gray-400 py-12 text-sm"
                  >
                    Tidak ada data ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
