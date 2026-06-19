"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { planService } from "@/services/superadmin/planServices";
import {
  CreatePlanPayload,
  Plan,
  UpdatePlanPayload,
} from "@/types/superadmin/plan";

export interface PlanActionOptions {
  showToast?: boolean;
  skipFetch?: boolean;
}

export function usePlan() {
  const queryClient = useQueryClient();

  // 1. Fetch data menggunakan React Query
  const {
    data: plans = [],
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ["superadmin-plans"],
    queryFn: async () => {
      const res = await planService.getAll();
      return res.data;
    },
  });

  // 2. Mutations (tidak auto-invalidate agar bisa dikontrol via opsi 'skipFetch' di loop)
  const createMutation = useMutation({
    mutationFn: (payload: CreatePlanPayload) => planService.create(payload),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePlanPayload }) =>
      planService.update(id, payload),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => planService.delete(id),
  });

  const submitting =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  // Expose fetchPlans for manual re-fetching (dipanggil setelah bulk hapus/edit)
  const fetchPlans = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const createPlan = async (
    payload: CreatePlanPayload,
    opts?: PlanActionOptions
  ): Promise<boolean> => {
    const showToast = opts?.showToast ?? true;
    const skipFetch = opts?.skipFetch ?? false;
    try {
      await createMutation.mutateAsync(payload);
      if (showToast) toast.success("Plan berhasil ditambahkan");
      if (!skipFetch) {
        await queryClient.invalidateQueries({ queryKey: ["superadmin-plans"] });
      }
      return true;
    } catch (err: any) {
      const message =
        err?.response?.data?.errors
          ? Object.values<string[]>(err.response.data.errors)[0]?.[0]
          : err?.response?.data?.message;
      toast.error(message ?? "Gagal menambahkan plan");
      return false;
    }
  };

  const updatePlan = async (
    id: string,
    payload: UpdatePlanPayload,
    opts?: PlanActionOptions
  ): Promise<boolean> => {
    const showToast = opts?.showToast ?? true;
    const skipFetch = opts?.skipFetch ?? false;
    try {
      await updateMutation.mutateAsync({ id, payload });
      if (showToast) toast.success("Plan berhasil diperbarui");
      if (!skipFetch) {
        await queryClient.invalidateQueries({ queryKey: ["superadmin-plans"] });
      }
      return true;
    } catch (err: any) {
      const message =
        err?.response?.data?.errors
          ? Object.values<string[]>(err.response.data.errors)[0]?.[0]
          : err?.response?.data?.message;
      toast.error(message ?? "Gagal memperbarui plan");
      return false;
    }
  };

  const deletePlan = async (
    id: string,
    opts?: PlanActionOptions
  ): Promise<boolean> => {
    const showToast = opts?.showToast ?? true;
    const skipFetch = opts?.skipFetch ?? false;
    try {
      await deleteMutation.mutateAsync(id);
      if (showToast) toast.success("Plan berhasil dihapus");
      if (!skipFetch) {
        await queryClient.invalidateQueries({ queryKey: ["superadmin-plans"] });
      }
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Gagal menghapus plan");
      return false;
    }
  };

  return {
    plans,
    loading,
    submitting,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
  };
}