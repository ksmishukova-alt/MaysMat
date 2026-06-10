import { redirect } from "next/navigation";

/** Сразу в полноэкранный flow — без промежуточного лендинга с сайдбаром */
export default function DiagnosticPage() {
  redirect("/diagnostic/run");
}
