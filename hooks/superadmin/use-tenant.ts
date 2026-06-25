"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantService } from "@/services/superadmin/tenantServices";
import type {
  TenantListFilters,
} from "@/types/superadmin/tenant";

export function useTenant(filters: TenantListFilters = {}, perPage = 15) {
  const queryClient = useQueryClient();

  // 1. Fetch data menggunakan React Query
  const {
    data: response,
    isLoading: loading,
    refetch,
  } = useQuery({
    // Tambahkan filters dan perPage ke queryKey agar otomatis fetch ulang saat berubah
    queryKey: ["superadmin-tenants", filters, perPage],
    queryFn: async () => {
      return await tenantService.list(filters, perPage);
    },
  });

  const tenants = response?.data ?? [];
  const meta = response?.meta ?? null;

  // 2. Mutations
  const approveMutation = useMutation({
    mutationFn: (id: string) => tenantService.approve(id),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, alasan }: { id: string; alasan: string }) =>
      tenantService.reject(id, alasan),
  });

  const suspendMutation = useMutation({
    mutationFn: ({ id, catatan }: { id: string; catatan?: string }) =>
      tenantService.suspend(id, catatan),
  });

  const unsuspendMutation = useMutation({
    mutationFn: (id: string) => tenantService.unsuspend(id),
  });

  const submitting =
    approveMutation.isPending ||
    rejectMutation.isPending ||
    suspendMutation.isPending ||
    unsuspendMutation.isPending;

  // Expose fetchTenants untuk re-fetch manual jika diperlukan komponen
  const fetchTenants = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Wrappers untuk mempertahankan API lama
  const approveTenant = async (id: string): Promise<boolean> => {
    try {
      await approveMutation.mutateAsync(id);
      toast.success("Tenant berhasil di-approve");
      await queryClient.invalidateQueries({ queryKey: ["superadmin-tenants"] });
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Gagal approve tenant");
      return false;
    }
  };

  const rejectTenant = async (
    id: string,
    alasan: string
  ): Promise<boolean> => {
    try {
      await rejectMutation.mutateAsync({ id, alasan });
      toast.success("Tenant berhasil di-reject");
      await queryClient.invalidateQueries({ queryKey: ["superadmin-tenants"] });
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Gagal reject tenant");
      return false;
    }
  };

  const suspendTenant = async (
    id: string,
    catatan?: string
  ): Promise<boolean> => {
    try {
      await suspendMutation.mutateAsync({ id, catatan });
      toast.success("Tenant berhasil disuspend");
      await queryClient.invalidateQueries({ queryKey: ["superadmin-tenants"] });
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Gagal suspend tenant");
      return false;
    }
  };

  const unsuspendTenant = async (id: string): Promise<boolean> => {
    try {
      await unsuspendMutation.mutateAsync(id);
      toast.success("Tenant berhasil diaktifkan kembali");
      await queryClient.invalidateQueries({ queryKey: ["superadmin-tenants"] });
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Gagal unsuspend tenant");
      return false;
    }
  };

  const getDetail = async (id: string) => {
    try {
      const res = await tenantService.detail(id);
      return res.data;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Gagal memuat detail tenant");
      return null;
    }
  };

  return {
    tenants,
    meta,
    loading,
    submitting,
    fetchTenants,
    approveTenant,
    rejectTenant,
    suspendTenant,
    unsuspendTenant,
    getDetail,
  };
}
