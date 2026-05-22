"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PlanCard,
  PlanCardSkeleton,
} from "@/components/superadmin/plan/plan-card";
import { ModalTambahPlan } from "@/components/superadmin/plan/modal-tambah-plan";
import { ModalEditPlan } from "@/components/superadmin/plan/modal-edit-plan";
import { ModalHapusPlan } from "@/components/superadmin/plan/modal-hapus-plan";
import { PlanBreadcrumb } from "@/components/superadmin/plan/breadcrumb";
import { SuperadminHeader } from "@/components/superadmin/header";
import { usePlan } from "@/hooks/superadmin/use-plan";
import { Plan } from "@/types/plan";

export default function ManagementPlanPage() {
  const { plans, loading, submitting, createPlan, updatePlan, deletePlan } =
    usePlan();

  // ─── Modal State ──────────────────────────────────────────────────────────
  const [modalTambah, setModalTambah] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalHapus, setModalHapus] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const handleOpenEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setModalEdit(true);
  };

  const handleOpenHapus = (plan: Plan) => {
    setSelectedPlan(plan);
    setModalHapus(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      {/* Top Header */}
      <SuperadminHeader username="Super Admin" notificationCount={3} />

      <main className="flex-1 px-6 py-6 max-w-screen-xl mx-auto w-full space-y-6">
        {/* Breadcrumb */}
        <PlanBreadcrumb />

        {/* Page Title + Action */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Management Plan</h2>
            <p className="text-sm text-gray-400 mt-0.5">
              Manejemen plan subscription
            </p>
          </div>

          <Button
            onClick={() => setModalTambah(true)}
            className="bg-blue-700 hover:bg-blue-800 text-white h-9 text-sm gap-1.5 flex-shrink-0"
          >
            <Plus className="h-4 w-4" />
            Tambah Plan
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
            plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onEdit={handleOpenEdit}
                onDelete={handleOpenHapus}
              />
            ))
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
        onClose={() => {
          setModalEdit(false);
          setSelectedPlan(null);
        }}
        onSubmit={updatePlan}
        submitting={submitting}
      />

      <ModalHapusPlan
        open={modalHapus}
        plan={selectedPlan}
        onClose={() => {
          setModalHapus(false);
          setSelectedPlan(null);
        }}
        onConfirm={deletePlan}
        submitting={submitting}
      />
    </div>
  );
}
