import { ReactNode } from "react";
import { useAppStore, type Certification } from "../store/useAppStore";

export type { Certification };

export function CertificationProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useCertifications() {
  return useAppStore((state) => ({
    certifications: state.certifications,
    selectedCertId: state.selectedCertId,
    updateCertifications: state.updateCertifications,
    selectCertification: state.selectCertification,
  }));
}
