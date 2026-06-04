"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { tenantService } from "@/services/superadmin/tenantServices";
import type {
  Tenant,
  TenantListFilters,
  TenantListResponse,
} from "@/types/superadmin/tenant";

export function useTenant(filters: TenantListFilters = {}, perPage = 15) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [meta, setMeta] = useState<TenantListResponse["meta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tenantService.list(filters, perPage);
      setTenants(res.data);
      setMeta(res.meta);
    } catch {
      toast.error("Gagal memuat data tenant");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters), perPage]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const approveTenant = async (id: string): Promise<boolean> => {
    setSubmitting(true);
    try {
      await tenantService.approve(id);
      toast.success("Tenant berhasil di-approve");
      await fetchTenants();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Gagal approve tenant");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const rejectTenant = async (
    id: string,
    alasan: string,
  ): Promise<boolean> => {
    setSubmitting(true);
    try {
      await tenantService.reject(id, alasan);
      toast.success("Tenant berhasil di-reject");
      await fetchTenants();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Gagal reject tenant");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const suspendTenant = async (
    id: string,
    catatan?: string,
  ): Promise<boolean> => {
    setSubmitting(true);
    try {
      await tenantService.suspend(id, catatan);
      toast.success("Tenant berhasil disuspend");
      await fetchTenants();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Gagal suspend tenant");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const unsuspendTenant = async (id: string): Promise<boolean> => {
    setSubmitting(true);
    try {
      await tenantService.unsuspend(id);
      toast.success("Tenant berhasil diaktifkan kembali");
      await fetchTenants();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Gagal unsuspend tenant");
      return false;
    } finally {
      setSubmitting(false);
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
