import { Suspense } from "react";
import RegisterOrganizationContent from "./register-organization-content";

export default function RegisterOrganizationPage({ searchParams }) {
  return (
    <div className="min-h-screen bg-accent flex flex-col py-16 px-4">
      <Suspense fallback={null}>
        <RegisterOrganizationContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
