// app/customer/layout.tsx
import LayoutWrapper from "@/components/layout-wrapper";
import { ReactNode } from "react";

export default function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <LayoutWrapper allowedRoles={["CUSTOMER"]}>
      {children}
    </LayoutWrapper>
  );
}