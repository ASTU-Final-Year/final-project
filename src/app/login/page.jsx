import { Suspense } from "react";
import LoginFormContent from "./login-form-content";

export default function LoginPage({ searchParams }) {
  return (
    <div className="min-h-screen bg-accent flex flex-col py-16 px-4">
      <Suspense fallback={null}>
        <LoginFormContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
