"use client";

import { Button } from "@/components/ui/button";
import Auth from "@/lib/auth";
import RequestHandler from "@/lib/request-handler";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/store";
import { redirect, RedirectType, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function EmployeeDashboard() {
  const session = useSessionStore(({ session }) => session);
  const router = useRouter();
  const [collapsed, setCollapsed] = useState({ session: false });
  const [_loaded, _setLoaded] = useState(false);
  const [organization, setOrganization] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [calendars, setCalendars] = useState([]);

  useEffect(() => {
    if (!_loaded) (async () => _setLoaded(true))();
    if (_loaded && session?.user == null) {
      return redirect("/login", RedirectType.push);
    }
  }, [_loaded, session?.user]);

  useEffect(() => {
    RequestHandler.Get("/api/v1/organization").then(async (res) => {
      if (res.ok) {
        const { organization } = await res.json();
        setOrganization(organization);
      }
    });
  }, []);

  useEffect(() => {
    if (organization != null) {
      RequestHandler.Get(
        `/api/v1/organization/${organization.id}/employees`,
      ).then(async (res) => {
        if (res.ok) {
          const { employees } = await res.json();
          setEmployees(employees);
        }
      });
    }
  }, [organization]);

  useEffect(() => {
    if (organization != null) {
      RequestHandler.Get(
        `/api/v1/organization/${organization.id}/services`,
      ).then(async (res) => {
        if (res.ok) {
          const { services } = await res.json();
          setServices(services);
        }
      });
    }
  }, [organization]);

  useEffect(() => {
    if (organization != null) {
      RequestHandler.Get(
        `/api/v1/organization/${organization.id}/calendars`,
      ).then(async (res) => {
        if (res.ok) {
          const { calendars } = await res.json();
          setCalendars(calendars);
        }
      });
    }
  }, [organization]);

  if (!_loaded || session?.user == null) {
    return <div>Loading...</div>;
  }

  if (session?.user?.role === "employee") {
    return redirect("/dashboard/employee", RedirectType.push);
  }

  const handleSubmit = () => {};

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
        {/* Session */}
        <Collapsible title="Session">
          <pre className={cn("font-mono textsm")}>
            <code>{JSON.stringify(session, null, 2)}</code>
          </pre>
        </Collapsible>
        {/* Organization */}
        <Collapsible title="Organization">
          <pre className={cn("font-mono textsm")}>
            <code>{JSON.stringify(organization, null, 2)}</code>
          </pre>
        </Collapsible>
        {/* Employees */}
        <Collapsible title="Employees">
          <pre className={cn("font-mono textsm")}>
            <code>{JSON.stringify(employees, null, 2)}</code>
          </pre>
        </Collapsible>
        {/* Services */}
        <Collapsible title="Services">
          <pre className={cn("font-mono textsm")}>
            <code>{JSON.stringify(services, null, 2)}</code>
          </pre>
        </Collapsible>
        {/* Calendars */}
        <Collapsible title="Calendars">
          <pre className={cn("font-mono textsm")}>
            <code>{JSON.stringify(calendars, null, 2)}</code>
          </pre>
        </Collapsible>
      </Suspense>
    </div>
  );
}

function Collapsible({ title, children }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="bg-background border rounded">
      <h2
        className="text-lg mb-2 px-4 pt-2"
        onClick={() => {
          setCollapsed((prev) => !prev);
        }}
      >
        {title}
      </h2>
      <hr />
      <div
        className={cn(
          "p-4 overflow-clip",
          collapsed
            ? "h-0 max-h-0 p-0 transition-all duration-300 ease-in-out"
            : "",
        )}
      >
        {children}
      </div>
    </div>
  );
}
