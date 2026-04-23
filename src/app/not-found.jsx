// Import global styles and fonts

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Home } from "lucide-react";

// import "./globals.css";
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "404 - Page Not Found",
//   description: "The page you are looking for does not exist.",
// };

export default function GlobalNotFound() {
  return (
    // <html lang="en" className={inter.className}>
    //   <body>
    <NotFound />
    //   </body>
    // </html>
  );
}

function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50/30 flex flex-col py-12 px-4">
      <div className="container mx-auto max-w-[500px]">
        <Card className="border-2 shadow-xl shadow-slate-200/50 overflow-hidden text-center">
          <CardHeader className="pb-6 pt-10 border-b border-slate-100 bg-white">
            <div className="text-6xl font-black text-primary mb-2 tracking-tighter">
              404
            </div>

            <CardTitle className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Page Not Found
            </CardTitle>

            <CardDescription className="text-base mt-2 mx-auto max-w-[300px]">
              We couldn&apos;t find the page you&apos;re looking for. It might
              have been moved or deleted.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-8 sm:p-10 bg-white space-y-4">
            <Button
              onClick={() => router.push("/")}
              className="w-full h-12 text-base font-bold shadow-md hover:shadow-lg transition-all"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>

            <Button
              variant="outline"
              onClick={() => router.back()}
              className="w-full h-12 text-base font-bold border-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>

          <CardFooter className="flex justify-center border-t border-slate-100 p-6 bg-slate-50/50">
            <p className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
              ServeSync+ • Error 404
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
