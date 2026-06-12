import { PublicMenuItem } from "@/types/public/menu";
import { MenuItem } from "@/components/user/MenuDetailModal";

export const OUTLET_INFO = {
  name: "Pizza Mizna",
  logo: "/images/coffee-cat-logo.png",
  address:
    "Jalan Senandika No.05, Siliwangi, Kec. Semarang Sel., Kota Semarang, Jawa Tengah 50241, Indonesia",
  operationalHours: [
    { day: "Monday", hours: "09:00 - 22:00" },
    { day: "Tuesday", hours: "09:00 - 22:00" },
    { day: "Wednesday", hours: "09:00 - 22:00" },
    { day: "Thursday", hours: "09:00 - 22:00" },
    { day: "Friday", hours: "09:00 - 22:00" },
    { day: "Saturday", hours: "09:00 - 22:00" },
    { day: "Sunday", hours: "09:00 - 22:00" },
  ],
};

export const TABLE_NUMBER = "08";

export function generateOrderId(): string {
  return "ORD-" + Date.now().toString(36).toUpperCase();
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getImageUrl(path: string | null) {
  if (!path) return "/logoqoma.svg"; // Fallback to a valid public image
  if (path.startsWith("http")) return path;
  
  // Extract base storage URL from API URL automatically
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const storageBaseUrl = apiUrl.replace(/\/api\/?$/, "/storage/");
  
  return `${storageBaseUrl}${path}`;
}

export function mapToMenuItem(p: PublicMenuItem): MenuItem {
  return {
    id: p.id,
    name: p.nama,
    price: p.harga,
    description: p.keterangan || "",
    image: getImageUrl(p.gambar),
    addOnToppings: [],
    specialForYou: [],
  };
}
