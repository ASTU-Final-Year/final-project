import { Suspense } from "react";
import LoginFormContent from "./login-form-content";

export default function LoginPage({ searchParams }) {
  return (
    <div
      className="bg-cover min-h-screen bg-accent flex flex-col py-16 px-4"
      style={{
        backgroundImage:
          'url("/images/pexels-lovetosmile-36200692-blurred-dim.jpg")',
      }}
    >
      <Suspense fallback={null}>
        <LoginFormContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
