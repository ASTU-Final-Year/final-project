import { Suspense } from "react";
import LoginFormContent from "./login-form-content";
import { Loader2 } from "lucide-react";

export default function LoginPage({ searchParams }) {
  return (
    <div
      className="bg-cover min-h-screen bg-accent flex flex-col py-16 px-4"
      style={{
        backgroundImage:
          'url("/images/pexels-lovetosmile-36200692-blurred-dim.jpg")',
      }}
    >
      <Suspense
        fallback={
          <div className="min-h-dvh flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <LoginFormContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
