// components/modals/WelcomeModal.tsx
"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Smartphone, UtensilsCrossed } from "lucide-react";

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: <ShoppingBag className="w-16 h-16 text-orange-500" />,
    title: "Place an Order!",
    description: "Place order through our website",
  },
  {
    icon: <Smartphone className="w-16 h-16 text-orange-500" />,
    title: "Track Progress",
    description: "Input your name and show your ID order to cashier",
  },
  {
    icon: <UtensilsCrossed className="w-16 h-16 text-orange-500" />,
    title: "Get your Order!",
    description: "Wait and you'll get your food",
  },
];

export function WelcomeModal({ open, onClose }: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm w-full bg-orange-500 border-none p-6 rounded-2xl" showCloseButton={false}>
        <VisuallyHidden>
          <DialogTitle>Welcome Message</DialogTitle>
        </VisuallyHidden>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-full bg-white w-8 h-8 flex items-center justify-center text-orange-500 font-bold text-lg hover:bg-orange-100 transition"
        >
          ×
        </button>
        <div className="flex flex-col gap-4 mt-4">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-orange-50 rounded-2xl p-6 flex flex-col items-center text-center gap-3"
            >
              {step.icon}
              <h3 className="font-bold text-gray-800 text-lg">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
