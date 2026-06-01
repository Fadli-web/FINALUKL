// app/manager/layout.tsx
import LayoutWrapper from "@/components/layout-wrapper";
import { ReactNode } from "react";

export default function ManagerLayout({ children }: { children: ReactNode }) {
  return (
    <LayoutWrapper allowedRoles={["MANAGER"]}>
      {children}
    </LayoutWrapper>
  );
}