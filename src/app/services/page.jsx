// src/app/services/page.jsx
"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import SearchComponent from "@/components/public/search";

export default function ServicesSearchPage() {
  return (
    <div
      className="flex min-h-screen flex-col font-sans bg-cover"
      style={{
        backgroundImage:
          'url("/images/pexels-lovetosmile-36200692-blurred-dim.jpg")',
      }}
    >
      <SiteHeader />

      <main className="flex-1 min-h-200 pt-8 md:pt-16">
        <SearchComponent
          dark={true}
          className="light"
          resultsClassName="mb-6 max-h-800"
        />
      </main>

      <SiteFooter />
    </div>
  );
}
