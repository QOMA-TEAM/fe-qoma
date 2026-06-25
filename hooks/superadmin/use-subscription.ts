"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface SubscriptionUpgrade {
  id: string;
  usaha_id: string;
  nama_perusahaan: string;
  nama_owner: string;
  jenis_subscription: string;
  tipe: string;
  start_subscription: string;
  end_date: string | null;
  status: string;
  harga: number;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PendingUpgradesResponse {
  message: string;
  data: SubscriptionUpgrade[];
  meta: PaginationMeta;
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/**
 * Mengambil daftar request upgrade plan yang statusnya masih pending
 */
export function usePendingUpgrades(page: number = 1, search: string = "") {
  return useQuery<PendingUpgradesResponse>({
    queryKey: ["superadmin-pending-upgrades", page, search],
    queryFn: async () => {
      let url = `/super-admin/subscriptions?status=pending&tipe=upgrade&page=${page}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }
      const response = await axios.get(url);
      return response.data;
    },
  });
}

/**
 * Fungsi untuk Approve (Konfirmasi Pembayaran) Upgrade
 */
export async function approveUpgrade(id: string) {
  const response = await axios.post(`/super-admin/subscriptions/${id}/konfirmasi-pembayaran`);
  return response.data;
}

/**
 * Fungsi untuk Reject (Tolak) Upgrade
 */
export async function rejectUpgrade(id: string, alasan: string) {
  const response = await axios.post(`/super-admin/subscriptions/${id}/tolak`, {
    alasan,
  });
  return response.data;
}
