"use client";

import { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PlanCard,
  PlanCardSkeleton,
} from "@/components/superadmin/plan/plan-card";
import { ModalTambahPlan } from "@/components/superadmin/plan/modal-tambah-plan";
import { ModalEditPlan } from "@/components/superadmin/plan/modal-edit-plan";
import { ModalHapusPlan } from "@/components/superadmin/plan/modal-hapus-plan";
import { usePlan } from "@/hooks/superadmin/use-plan";
import type { Plan } from "@/types/superadmin/plan";

export function PlanContent() {
  const { plans, loading, submitting, createPlan, updatePlan, deletePlan } =
    usePlan();

  // ─── Modal State ──────────────────────────────────────────────────────────
  const [modalTambah, setModalTambah] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalHapus, setModalHapus] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedPlanGroupForDelete, setSelectedPlanGroupForDelete] = useState<
    Plan[] | null
  >(null);

  const handleOpenEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setModalEdit(true);
  };

  const handleOpenHapus = (group: Plan[]) => {
    setSelectedPlanGroupForDelete(group);
    setModalHapus(true);
  };

  const groupedPlans = useMemo(() => {
    const map = new Map<string, Plan[]>();
    plans.forEach((p) => {
      if (!map.has(p.nama_plan)) map.set(p.nama_plan, []);
      map.get(p.nama_plan)!.push(p);
    });
    return Array.from(map.values());
  }, [plans]);

  return (
    <>
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Page Title + Action */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Plan</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Informasi detail plan subscription
            </p>
          </div>

          <Button
            onClick={() => setModalTambah(true)}
            className="h-9 rounded-lg bg-orange-600 hover:bg-orange-700 text-white gap-1.5 px-4 text-sm cursor-pointer shrink-0"
          >
            <Plus className="size-4" /> Tambah Plan
          </Button>
        </div>

        {/* Plan Cards Grid */}
        <div className="flex flex-wrap gap-5">
          {loading ? (
            <>
              <PlanCardSkeleton />
              <PlanCardSkeleton />
              <PlanCardSkeleton />
            </>
          ) : plans.length === 0 ? (
            <div className="w-full py-20 flex flex-col items-center justify-center text-center text-gray-400 gap-2">
              <p className="text-base font-medium">Belum ada plan</p>
              <p className="text-sm">
                Klik &ldquo;Tambah Plan&rdquo; untuk membuat plan baru
              </p>
            </div>
          ) : (
            groupedPlans.map((group) => {
              const representative = group[0];
              return (
                <PlanCard
                  key={representative.nama_plan}
                  plan={representative}
                  allVariants={group}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenHapus}
                />
              );
            })
          )}
        </div>
      </main>

      {/* ─── Modals ──────────────────────────────────────────────────────── */}
      <ModalTambahPlan
        open={modalTambah}
        onClose={() => setModalTambah(false)}
        onSubmit={createPlan}
        submitting={submitting}
      />

      <ModalEditPlan
        open={modalEdit}
        plan={selectedPlan}
        allPlans={plans}
        onClose={() => {
          setModalEdit(false);
          setSelectedPlan(null);
        }}
        onUpdate={updatePlan}
        onCreate={createPlan}
        onDelete={deletePlan}
        submitting={submitting}
      />

      <ModalHapusPlan
        open={modalHapus}
        planGroup={selectedPlanGroupForDelete}
        onClose={() => {
          setModalHapus(false);
          setSelectedPlanGroupForDelete(null);
        }}
        onConfirm={deletePlan}
        submitting={submitting}
      />
    </>
  );
}
