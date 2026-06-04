// hooks/superadmin/use-plan.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
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
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const res = await planService.getAll();
      setPlans(res.data);
    } catch {
      toast.error("Gagal memuat data plan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const createPlan = async (
    payload: CreatePlanPayload,
    opts?: PlanActionOptions
  ): Promise<boolean> => {
    setSubmitting(true);
    const showToast = opts?.showToast ?? true;
    const skipFetch = opts?.skipFetch ?? false;
    try {
      await planService.create(payload);
      if (showToast) toast.success("Plan berhasil ditambahkan");
      if (!skipFetch) await fetchPlans();
      return true;
    } catch (err: any) {
      const message =
        err?.response?.data?.errors
          ? Object.values<string[]>(err.response.data.errors)[0]?.[0]
          : err?.response?.data?.message;
      toast.error(message ?? "Gagal menambahkan plan");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updatePlan = async (
    id: string,
    payload: UpdatePlanPayload,
    opts?: PlanActionOptions
  ): Promise<boolean> => {
    setSubmitting(true);
    const showToast = opts?.showToast ?? true;
    const skipFetch = opts?.skipFetch ?? false;
    try {
      await planService.update(id, payload);
      if (showToast) toast.success("Plan berhasil diperbarui");
      if (!skipFetch) await fetchPlans();
      return true;
    } catch (err: any) {
      const message =
        err?.response?.data?.errors
          ? Object.values<string[]>(err.response.data.errors)[0]?.[0]
          : err?.response?.data?.message;
      alert("DEBUG ERROR: " + JSON.stringify(err?.response?.data || err?.message));
      toast.error(message ?? "Gagal memperbarui plan");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deletePlan = async (
    id: string,
    opts?: PlanActionOptions
  ): Promise<boolean> => {
    setSubmitting(true);
    const showToast = opts?.showToast ?? true;
    const skipFetch = opts?.skipFetch ?? false;
    try {
      await planService.delete(id);
      if (showToast) toast.success("Plan berhasil dihapus");
      if (!skipFetch) await fetchPlans();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Gagal menghapus plan");
      return false;
    } finally {
      setSubmitting(false);
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