"use client";

import { useSessionStore } from "@/store";
import { redirect, RedirectType, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PortalDashboard() {
  const session = useSessionStore(({ session }) => session);
  // const [_loaded, _setLoaded] = useState(false);

  // useEffect(() => {
  //   if (!_loaded) {
  //     (async () => {
  //       // if (_loaded && session?.user == null) {
  //       //   return router.push("/login");
  //       // }
  //       Auth.isLoggedIn().then((isLoggedIn) => {
  //         if (!isLoggedIn) {
  //           router.push("/login");
  //         }
  //       });
  //       _setLoaded(true);
  //     })();
  //   }
  // }, [router, _loaded, session?.user]);

  // useEffect(() => {
  //   if (!_loaded) (async () => _setLoaded(true))();

  //   console.log(session);
  //   // if (_loaded && session?.user == null) {
  //   //   return redirect("/login", RedirectType.push);
  //   // }
  // }, [_loaded, session?.user]);

  if (session?.user == null) {
    return <div>Loading...</div>;
  }
  if (session.user?.role === "employee") {
    return redirect("/dashboard/employee", RedirectType.push);
  } else if (session.user?.role === "organization_admin") {
    return redirect("/dashboard/organization", RedirectType.push);
  } else if (session.user?.role === "client") {
    return redirect("/dashboard/client", RedirectType.push);
  }
  return (
    <div className="min-h-dvh flex flex-col p-4 bg-accent">
      <div className="bg-background border rounded">
        <h2 className="text-lg mb-2 px-4 pt-2">Session</h2>
        <hr />
        <pre className="p-4 font-mono textsm px-4">
          <code>{JSON.stringify(session, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}
