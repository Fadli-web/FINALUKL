// app/cashier/layout.tsx
import LayoutWrapper from "@/components/layout-wrapper";
import { ReactNode } from "react";

export default function CashierLayout({ children }: { children: ReactNode }) {
  return (
    <LayoutWrapper allowedRoles={["CASHIER"]}>
      {children}
    </LayoutWrapper>
  );
}