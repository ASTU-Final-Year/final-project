"use client";

import { Button } from "@/components/ui/button";
import Auth from "@/lib/auth";
import { useSessionStore } from "@/store";
import { redirect, RedirectType, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function EmployeeDashboard() {
  const session = useSessionStore(({ session }) => session);
  const router = useRouter();
  const [_loaded, _setLoaded] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!_loaded) (async () => _setLoaded(true))();
    if (_loaded && session?.user == null) {
      return redirect("/login", RedirectType.push);
    }
  }, [_loaded, session?.user]);

  if (!_loaded || session?.user == null) {
    return <div>Loading...</div>;
  }

  if (session?.user?.role === "organization_admin") {
    return redirect("/dashboard/organization", RedirectType.push);
  }
  return (
    <div className="min-h-dvh flex flex-col p-4 bg-accent">
      <Button
        onClick={() => {
          Auth.logout();
          router.push("/login");
        }}
      >
        logout
      </Button>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="bg-background border rounded">
          <h2
            className="text-lg mb-2 px-4 pt-2"
            onClick={() => {
              setCollapsed((prev) => !prev);
            }}
          >
            Plan
          </h2>
          <hr />
          <pre
            className={cn(
              "p-4 font-mono textsm px-4 overflow-clip",
              collapsed
                ? "h-0 max-h-0 p-0 transition-all duration-300 ease-in-out"
                : "",
            )}
          >
            <code>{JSON.stringify(session, null, 2)}</code>
          </pre>
        </div>
        <div>
          <form onSubmit={handleSubmit}></form>
        </div>
      </Suspense>
    </div>
  );
}
