import { redirect } from "next/navigation";

/** Острова временно скрыты — маршрут назначается вручную в /admin/path */
export default function MapPage() {
  redirect("/tasks");
}
