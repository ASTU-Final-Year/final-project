"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  Building2,
  Users,
  Server,
  Tag,
  DollarSign,
  CircleCheckBig,
  Minus,
} from "lucide-react";
import { usePricingPlanStore } from "@/store";
import Link from "next/link";
import RequestHandler from "@/lib/request-handler";

// Compact Discount Badge for inline usage
function CompactDiscountBadge({ value }) {
  if (value >= 1) return null;

  const discountPercentage = Math.round((1 - value) * 100);

  return (
    <div className="relative w-full">
      <Badge className="absolute top-0 right-[20%] bg-amber-500 text-white border-0 px-1.5 py-0.5 text-[10px] font-bold shadow-lg animate-bounce">
        -{discountPercentage}%
      </Badge>
    </div>
  );
}

// Savings Calculator Badge
function SavingsBadge({ monthlyPrice, annualPrice }) {
  const monthlyCost = monthlyPrice * 12;
  const savings = monthlyCost - annualPrice;

  if (savings <= 0) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="relative group">
      <Badge
        className={cn(
          "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0",
          "px-3 py-1.5 text-xs font-medium shadow-md",
          "hover:shadow-lg transition-all duration-300",
          "cursor-help",
        )}
      >
        <Tag className="h-3 w-3 mr-1" />
        Save {formatPrice(savings)}/year
      </Badge>
    </div>
  );
}

export function PricingSelect({
  selectedPlan,
  setSelectedPlan,
  pricingPlans,
  ...props
}) {
  return (
    <Select
      value={selectedPlan}
      onValueChange={(value) => setSelectedPlan(value)}
      {...props}
    >
      <SelectTrigger className="w-full text-xl font-semibold border-0 bg-transparent transition-all duration-300 p-8">
        <SelectValue placeholder="Select a plan" />
      </SelectTrigger>
      <SelectContent
        className="p-2 border-border bg-card rounded"
        position="item-aligned"
      >
        <SelectGroup>
          {Object.entries(pricingPlans)?.map(([id, plan], idx) => {
            return (
              <SelectItem
                key={idx}
                value={plan.id}
                className="cursor-pointer rounded py-3 pl-8 pr-4 hover:bg-muted transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-primary/10">
                    <CircleCheckBig className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-medium">{plan.name}</span>
                  {plan.popular && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-primary/10 text-primary text-xs border-0"
                    >
                      Popular
                    </Badge>
                  )}
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export function PricingPlanView({ className, ...props }) {
  const pricingPlans = usePricingPlanStore((state) => state.pricingPlans);
  const setPricingPlans = usePricingPlanStore((state) => state.setPricingPlans);
  const selectedPlan = usePricingPlanStore((state) => state.selectedPlan);
  const setSelectedPlan = usePricingPlanStore((state) => state.setSelectedPlan);
  const hasHydrated = usePricingPlanStore((state) => state.hasHydrated);
  // const hasHydrated = usePricingPlanStore.persist?.hasHydrated();

  useEffect(() => {
    if (!pricingPlans || pricingPlans.length === 0) {
      RequestHandler.Get("/api/v1/pricing-plans").then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data.pricingPlans.length > 0) {
            const plans = {};
            for (const plan of data.pricingPlans) {
              plans[plan.id] = plan;
            }
            setPricingPlans(plans);
            if (!selectedPlan) {
              const popular = data.pricingPlans.find((plan) => plan.popular);
              setSelectedPlan(popular ? popular.id : data.pricingPlans[0].id);
            }
          }
        }
      });
    }
  }, [selectedPlan, setPricingPlans, setSelectedPlan, pricingPlans]);

  const plan = pricingPlans[selectedPlan];
  if (!hasHydrated || !plan) {
    return <div>Loading...</div>;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const monthlyDiscount = plan.monthlyDiscount ?? 1.0;
  const annualDiscount = plan.annualDiscount ?? 1.0;

  const monthlyPrice = plan.price * monthlyDiscount;
  const annualPrice = plan.price * annualDiscount * 12;

  return (
    <div className="w-full max-w-xl">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
          <DollarSign className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Choose the right plan for your business
        </h1>
      </div>
      <Card
        className={cn(
          "group relative px-8 w-full overflow-hidden border-border bg-card shadow-lg transition-all duration-500 hover:shadow-xl",
          className,
        )}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl group-hover:scale-150 transition-transform duration-1000 pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl group-hover:scale-150 transition-transform duration-1000 pointer-events-none" />

        <CardHeader className="relative pb-0 space-y-6">
          <CardTitle className="space-y-4">
            <div className="flex items-center justify-between">
              <PricingSelect
                defaultValue="small"
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
                pricingPlans={pricingPlans}
              />
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="relative space-y-6 border-none rounded px-16">
          <div className="relative">
            <div className="text-center p-5 rounded-lg bg-muted/30 border-none">
              {monthlyPrice > 0 && monthlyDiscount <= 0.99 && (
                <CompactDiscountBadge value={monthlyDiscount} />
              )}
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-foreground">
                  {formatPrice(monthlyPrice)}
                </span>
                <span className="text-sm text-muted-foreground">/ monthly</span>
              </div>
              {plan.price > 0 && (
                <div className="flex flex-col items-center gap-2 mt-2">
                  {annualPrice > 0 && annualDiscount <= 0.99 && (
                    <CompactDiscountBadge value={annualDiscount} />
                  )}
                  <p className="text-lg text-muted-foreground">
                    <span className="font-semibold">
                      {formatPrice(annualPrice)}
                    </span>{" "}
                    <span className="text-sm text-muted-foreground">
                      / annually
                    </span>
                  </p>

                  <SavingsBadge
                    monthlyPrice={monthlyPrice}
                    annualPrice={annualPrice}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded p-3 bg-muted/30 border border-border relative">
              <p className="text-xl font-semibold text-foreground">
                {plan.maxServices}
              </p>
              <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                <Server className="h-3.5 w-3.5" />
                <span className="text-xs">Services</span>
              </div>
            </div>
            <div className="p-3 rounded bg-muted/30 border border-border relative">
              <p className="text-xl font-semibold text-foreground">
                {plan.maxEmployees}
              </p>
              <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                <Users className="h-3.5 w-3.5" />
                <span className="text-xs">Employees</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Included features
            </h3>
            <ul className="space-y-2.5">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <div className="mt-0.5 p-0.5 rounded-full bg-primary/20">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full flex items-stretch justify-center">
            <Link
              href={`/register/organization?plan=${plan.id}`}
              className="p-2 text-center rounded flex-1 text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow"
            >
              Get Started with {plan.name}
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center" />
      </Card>
    </div>
  );
}

export function PricingComparisonTable() {
  const pricingPlans = usePricingPlanStore((state) => state.pricingPlans);
  const hasHydrated = usePricingPlanStore.persist?.hasHydrated();

  if (!hasHydrated || Object.keys(pricingPlans).length === 0) {
    return null;
  }

  // Sort plans by price so they appear in logical order (Free -> Small -> Medium -> Large)
  const plans = Object.values(pricingPlans).sort((a, b) => a.price - b.price);

  // Extract all unique features, but FILTER OUT the ones that mention
  // "services included" or "employees" since we have hardcoded rows for those.
  const allFeatures = Array.from(
    new Set(plans.flatMap((plan) => plan.features)),
  ).filter(
    (feature) =>
      !feature.toLowerCase().includes("service included") &&
      !feature.toLowerCase().includes("services included") &&
      !feature.toLowerCase().includes("employees"),
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-24">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Compare all features
        </h2>
        <p className="text-slate-500 mt-2">
          Find the perfect fit for your team&apos;s size and needs.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="p-6 border-b border-r border-border bg-muted/30 w-[20%] align-bottom">
                <span className="font-semibold text-lg text-foreground">
                  Features overview
                </span>
              </th>
              {plans.map((plan) => {
                const monthlyPrice = plan.price * (plan.monthlyDiscount ?? 1.0);
                return (
                  <th
                    key={plan.id}
                    className="p-6 border-b border-border bg-muted/30 flex-1 text-center min-w-[180px]"
                  >
                    <div className="flex justify-center h-6 mb-2">
                      {plan.popular && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary border-0"
                        >
                          Most Popular
                        </Badge>
                      )}
                    </div>
                    <div className="font-bold text-xl text-foreground mb-1">
                      {plan.name}
                    </div>
                    <div className="text-muted-foreground text-sm font-normal mb-4">
                      {monthlyPrice > 0
                        ? `${formatPrice(monthlyPrice)} / mo`
                        : "Free Forever"}
                    </div>
                    <Link
                      href={`/register/organization?plan=${plan.id}`}
                      className={cn(
                        "inline-block w-full py-2.5 px-4 rounded text-sm font-medium transition-all",
                        plan.popular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                          : "border border-border hover:bg-muted text-foreground",
                      )}
                    >
                      Choose {plan.name}
                    </Link>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {/* Limit Rows - Pulled directly from maxEmployees / maxServices */}
            <tr className="hover:bg-muted/10 transition-colors">
              <td className="p-4 border-b border-r border-border font-medium text-slate-700">
                Max Employees
              </td>
              {plans.map((plan) => (
                <td
                  key={`emp-${plan.id}`}
                  className="p-4 border-b border-border text-center font-semibold text-foreground"
                >
                  {plan.maxEmployees}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-muted/10 transition-colors">
              <td className="p-4 border-b border-r border-border font-medium text-slate-700">
                Max Services
              </td>
              {plans.map((plan) => (
                <td
                  key={`srv-${plan.id}`}
                  className="p-4 border-b border-border text-center font-semibold text-foreground"
                >
                  {plan.maxServices}
                </td>
              ))}
            </tr>

            {/* Dynamic Features Rows - Filtered to prevent duplicates */}
            {allFeatures.map((feature, idx) => (
              <tr key={idx} className="hover:bg-muted/10 transition-colors">
                <td className="p-4 border-b border-r border-border font-medium text-slate-600 text-sm">
                  {feature}
                </td>
                {plans.map((plan) => (
                  <td
                    key={`${plan.id}-${idx}`}
                    className="p-4 border-b border-border text-center"
                  >
                    {plan.features.includes(feature) ? (
                      <Check className="h-5 w-5 text-primary mx-auto" />
                    ) : (
                      <Minus className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PricingPlansPage() {
  return (
    <div className="min-h-screen py-16 px-4 md:px-8 flex flex-col items-center bg-background">
      <PricingPlanView />
      <PricingComparisonTable />
    </div>
  );
}
