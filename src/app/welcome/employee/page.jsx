"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Building2,
  Briefcase,
  PartyPopper,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

function WelcomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const infoParam = searchParams.get("i");

  const [welcomeData, setWelcomeData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (infoParam) {
      try {
        // Decode the Base64 string and parse the JSON payload
        const decodedString = atob(infoParam);
        const parsedData = JSON.parse(decodedString);
        (() => setWelcomeData(parsedData))();
      } catch (err) {
        console.error("Failed to parse welcome info:", err);
        (() => setError(true))();
      }
    } else {
      (() => setError(true))();
    }
  }, [infoParam]);

  // Loading State
  if (!welcomeData && !error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
        <p className="text-slate-500 font-medium">
          Setting up your workspace...
        </p>
      </div>
    );
  }

  // Error State (Invalid or missing token)
  if (error) {
    return (
      <Card className="border-5 rounded shadow-xl max-w-md">
        <CardContent className="pt-10 pb-8 flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
            Invalid Link
          </CardTitle>
          <CardDescription className="text-base mb-8">
            We couldn&apos;t verify your invitation details. The link may be
            broken or expired.
          </CardDescription>
          <Button
            onClick={() => router.push("/")}
            className="h-11 w-full font-semibold"
          >
            Return to Home
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Success State
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center mb-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 ring-8 ring-green-50/50">
          <PartyPopper className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome aboard!
        </h2>
        <div className="text-base mt-2">
          Hi{" "}
          <span className="font-semibold text-slate-900">
            {welcomeData.firstname}
          </span>
          , your account is ready.
        </div>
      </div>
      <Card className="border-5 min-w-full md:min-w-[600] rounded shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-500">
        {/* <CardHeader className="text-center pb-6 border-b border-slate-100 bg-white pt-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 ring-8 ring-green-50/50">
            <PartyPopper className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome aboard!
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Hi{" "}
            <span className="font-semibold text-slate-900">
              {welcomeData.firstname}
            </span>
            , your account is ready.
          </CardDescription>
        </CardHeader> */}

        <CardContent className="p-8 bg-white space-y-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
            {/* <div className="h-px w-full bg-slate-200" /> */}

            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-primary/10 p-2">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                  Organization
                </p>
                <p className="font-semibold text-slate-900">
                  {welcomeData.organization}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-lg bg-primary/10 p-2">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">
                  Your Role
                </p>
                <p className="font-semibold text-slate-900">
                  {welcomeData.jobTitle}
                </p>
                {welcomeData.jobDescription && (
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {welcomeData.jobDescription}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={() => router.push("/dashboard")}
            className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all group"
          >
            Go to your Dashboard
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>

        {/* <CardFooter className="flex justify-center border-t border-slate-100 p-6 bg-slate-50/50">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-slate-400 font-bold">
            <ShieldCheck className="h-3 w-3" />
            Securely Authenticated
          </div>
        </CardFooter> */}
      </Card>
    </div>
  );
}

export default function EmployeeWelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 flex justify-center items-start py-12 px-4">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }
      >
        <WelcomeContent />
      </Suspense>
    </div>
  );
}
