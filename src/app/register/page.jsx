import { Suspense } from "react";
import RegisterUserContent from "./register-user-content";

export default function UserRegistrationPage() {
  return (
    <div
      className="min-h-screen bg-accent flex flex-col py-16 px-4 bg-cover"
      style={{
        backgroundImage:
          'url("/images/pexels-lovetosmile-36200692-blurred-dim.jpg")',
      }}
    >
      <Suspense fallback={null}>
        <RegisterUserContent />
      </Suspense>
    </div>
  );
}
