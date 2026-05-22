"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { planService } from "@/services/superadmin/planServices";
import {
  CreatePlanPayload,
  Plan,
  UpdatePlanPayload,
} from "@/types/superadmin/plan";

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

  const createPlan = async (payload: CreatePlanPayload): Promise<boolean> => {
    setSubmitting(true);
    try {
      await planService.create(payload);
      toast.success("Plan berhasil ditambahkan");
      await fetchPlans();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Gagal menambahkan plan");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updatePlan = async (
    id: string,
    payload: UpdatePlanPayload,
  ): Promise<boolean> => {
    setSubmitting(true);
    try {
      await planService.update(id, payload);
      toast.success("Plan berhasil diperbarui");
      await fetchPlans();
      return true;
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Gagal memperbarui plan");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deletePlan = async (id: string): Promise<boolean> => {
    setSubmitting(true);
    try {
      await planService.delete(id);
      toast.success("Plan berhasil dihapus");
      await fetchPlans();
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
