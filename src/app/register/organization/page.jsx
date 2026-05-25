import { Suspense } from "react";
import RegisterOrganizationContent from "./register-organization-content";

export default function RegisterOrganizationPage({ searchParams }) {
  return (
    <div
      className="min-h-screen  flex flex-col py-16 px-4 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          'url("/images/pexels-lovetosmile-36200692-blurred-dim.jpg")',
      }}
    >
      <Suspense fallback={null}>
        <RegisterOrganizationContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
