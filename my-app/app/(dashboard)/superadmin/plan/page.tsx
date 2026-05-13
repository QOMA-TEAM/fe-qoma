"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useState } from "react";
import { PlusCircle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Plan = {
  id: number;
  name: string;
  price: number;
  period: string;
  outlets: number;
  active: boolean;
};

const initialPlans: Plan[] = [
  {
    id: 1,
    name: "Free",
    price: 0,
    period: "Per 30 Hari",
    outlets: 1,
    active: true,
  },
  {
    id: 2,
    name: "Pro",
    price: 100000,
    period: "Per 30 Hari",
    outlets: 10,
    active: true,
  },
];

function formatRupiah(amount: number) {
  return `Rp. ${amount.toLocaleString("id-ID")}`;
}

export default function ManagementPlanPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newPlan, setNewPlan] = useState<Omit<Plan, "id" | "active">>({
    name: "",
    price: 0,
    period: "Per 30 Hari",
    outlets: 1,
  });

  const handleDelete = (id: number) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const handleEditOpen = (plan: Plan) => {
    setEditingPlan({ ...plan });
    setIsEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editingPlan) return;
    setPlans((prev) =>
      prev.map((p) => (p.id === editingPlan.id ? editingPlan : p)),
    );
    setIsEditOpen(false);
    setEditingPlan(null);
  };

  const handleAddSave = () => {
    const id = Date.now();
    setPlans((prev) => [...prev, { ...newPlan, id, active: true }]);
    setNewPlan({ name: "", price: 0, period: "Per 30 Hari", outlets: 1 });
    setIsAddOpen(false);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Top Header Bar */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <span className="text-muted-foreground text-sm">
                  Management Subscription
                </span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Plan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-5xl">
          {/* Page Title + Action */}
          <div className="flex items-start justify-between mb-1">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Management Plan
              </h1>
              <nav className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                <span>{"<"} Management Subscription</span>
                <span>{"<"} Plan</span>
              </nav>
            </div>
            <Button
              onClick={() => setIsAddOpen(true)}
              className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm gap-2 text-sm font-medium"
              variant="outline"
            >
              <PlusCircle className="w-4 h-4 text-blue-500" />
              Tambah Plan
            </Button>
          </div>

          <hr className="my-6 border-gray-200" />

          {/* Plan Cards */}
          <div className="flex flex-wrap gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="w-72 rounded-2xl border border-gray-200 shadow-sm bg-white"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-6">
                  <span className="text-lg font-semibold text-gray-800">
                    {plan.name}
                  </span>
                  {plan.active && (
                    <Badge
                      variant="outline"
                      className="text-teal-600 border-teal-400 bg-teal-50 rounded-full px-3 py-0.5 text-xs font-medium"
                    >
                      Aktif
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="px-6 pb-0">
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {formatRupiah(plan.price)}
                  </p>
                  <p className="text-sm text-gray-400 mt-1 mb-3">
                    {plan.period}
                  </p>
                  <hr className="border-gray-200 mb-3" />
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    <li className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-gray-400" />
                      {plan.outlets} Outlet
                    </li>
                  </ul>
                </CardContent>

                <CardFooter className="flex gap-2 px-6 pb-5">
                  <Button
                    onClick={() => handleEditOpen(plan)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium h-9"
                  >
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium h-9"
                      >
                        Hapus
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Plan?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus plan{" "}
                          <strong>{plan.name}</strong>? Tindakan ini tidak dapat
                          dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(plan.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Plan</DialogTitle>
            </DialogHeader>
            {editingPlan && (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nama Plan</Label>
                  <Input
                    id="edit-name"
                    value={editingPlan.name}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Harga (Rp)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingPlan.price}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-outlets">Jumlah Outlet</Label>
                  <Input
                    id="edit-outlets"
                    type="number"
                    value={editingPlan.outlets}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        outlets: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Batal
              </Button>
              <Button
                onClick={handleEditSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Simpan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Plan Baru</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="add-name">Nama Plan</Label>
                <Input
                  id="add-name"
                  placeholder="cth: Enterprise"
                  value={newPlan.name}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-price">Harga (Rp)</Label>
                <Input
                  id="add-price"
                  type="number"
                  placeholder="0"
                  value={newPlan.price}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, price: Number(e.target.value) })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-outlets">Jumlah Outlet</Label>
                <Input
                  id="add-outlets"
                  type="number"
                  placeholder="1"
                  value={newPlan.outlets}
                  onChange={(e) =>
                    setNewPlan({ ...newPlan, outlets: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                Batal
              </Button>
              <Button
                onClick={handleAddSave}
                disabled={!newPlan.name}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Tambah
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
