import { Suspense } from "react";
import RegisterUserContent from "./register-user-content";

export default function UserRegistrationPage() {
  return (
    <div className="min-h-screen bg-accent flex flex-col py-16 px-4">
      <Suspense fallback={null}>
        <RegisterUserContent />
      </Suspense>
    </div>
  );
}
