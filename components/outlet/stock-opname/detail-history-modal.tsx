import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon } from "lucide-react";
import type { StockOpnameSession } from "@/services/outlet/stock-opname-service";

interface DetailHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: StockOpnameSession | null;
  onViewPhoto: (url: string) => void;
}

export function DetailHistoryModal({ open, onOpenChange, session, onViewPhoto }: DetailHistoryModalProps) {
  if (!session) return null;

  const formatTipe = (tipe: string) => {
    switch (tipe) {
      case "busuk": return "Busuk";
      case "rusak": return "Rusak";
      case "ga_layak": return "Tidak Layak";
      case "hilang": return "Hilang";
      default: return tipe;
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === "draft") {
      return <Badge variant="outline" className="border-yellow-400 text-yellow-600 bg-yellow-50 rounded-full px-3 font-medium capitalize">Draft</Badge>;
    }
    if (status === "final") {
      return <Badge variant="outline" className="border-emerald-400 text-emerald-600 bg-emerald-50 rounded-full px-3 font-medium capitalize">Final</Badge>;
    }
    return <Badge>{status}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl sm:max-w-4xl bg-white border-0 rounded-2xl shadow-xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="px-6 py-4 border-b border-gray-100 flex flex-row items-center justify-between shrink-0">
          <DialogTitle className="text-xl font-bold text-gray-800">
            Detail Sesi {new Date(session.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 border-gray-200">
                  <TableHead className="w-16 text-center text-gray-600 font-semibold text-sm py-3">No</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-sm py-3">Bahan Baku</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Tipe</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Jumlah</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Total Kerugian</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Bukti</TableHead>
                  <TableHead className="text-gray-600 font-semibold text-sm py-3 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!session.items || session.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-400 py-12 text-sm">
                      Tidak ada detail item pada sesi ini.
                    </TableCell>
                  </TableRow>
                ) : (
                  session.items.map((row, index) => {
                    const hargaDefault = row.bahan_master?.harga_default ? parseFloat(row.bahan_master.harga_default.toString()) : 0;
                    const kerugian = row.status === 'final' ? row.jumlah * hargaDefault : 0;
                    return (
                      <TableRow key={row.id} className="hover:bg-gray-50/50 border-gray-100 transition-colors">
                        <TableCell className="text-gray-500 text-sm text-center py-3">
                          {index + 1}
                        </TableCell>
                        <TableCell className="text-gray-800 text-sm font-medium py-3">
                          <div className="flex flex-col">
                            <span>{row.bahan_master?.nama || "Unknown"}</span>
                            {row.keterangan && <span className="text-xs text-gray-500 line-clamp-1">{row.keterangan}</span>}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm text-center py-3">
                          {formatTipe(row.tipe)}
                        </TableCell>
                        <TableCell className="text-red-600 text-sm font-semibold text-center py-3">
                          - {row.jumlah} {row.bahan_master?.satuan || ""}
                        </TableCell>
                        <TableCell className="text-red-600 text-sm font-semibold text-center py-3">
                          {row.status === 'final' ? `Rp ${new Intl.NumberFormat('id-ID').format(kerugian)}` : '-'}
                        </TableCell>
                        <TableCell className="text-center py-3">
                          {row.foto_bukti ? (
                            <button 
                              onClick={() => onViewPhoto(row.foto_bukti!)}
                              className="text-blue-500 hover:text-blue-700 flex items-center justify-center w-full"
                              title="Lihat Foto Bukti"
                            >
                              <ImageIcon className="w-5 h-5" />
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center py-3">
                          <StatusBadge status={row.status} />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
