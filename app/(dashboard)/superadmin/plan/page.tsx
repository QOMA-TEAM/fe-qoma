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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HeaderActions } from "@/components/dashboard/header-actions";
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
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-sm text-muted-foreground">KELOLA</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm">Plan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderActions />
      </header>

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
            className="h-9 rounded-lg bg-orange-600 hover:bg-orange-700 text-white gap-1.5 px-4 text-sm cursor-pointer flex-shrink-0"
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
