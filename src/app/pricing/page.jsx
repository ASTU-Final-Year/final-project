// src/app/pricing/page.jsx
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
  Sparkles,
} from "lucide-react";
import { usePricingPlanStore } from "@/store";
import Link from "next/link";
import RequestHandler from "@/lib/request-handler";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Compact Discount Badge for inline usage
function CompactDiscountBadge({ value }) {
  if (value >= 1) return null;
  const discountPercentage = Math.round((1 - value) * 100);
  return (
    <div className="relative w-full">
      <Badge className="absolute top-0 right-[20%] bg-amber-500 text-white border-0 px-2 py-0.5 text-[11px] font-bold shadow-lg animate-pulse">
        -{discountPercentage}%
      </Badge>
    </div>
  );
}

// Savings Calculator Badge
function SavingsBadge({ monthlyPrice, yearPrice }) {
  const monthlyCost = monthlyPrice * 12;
  const savings = monthlyCost - yearPrice;
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
          "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0",
          "px-3 py-1.5 text-xs font-medium shadow-md",
          "hover:shadow-lg transition-all duration-300 cursor-help"
        )}
      >
        <Tag className="h-3 w-3 mr-1" />
        Save {formatPrice(savings)}/year
      </Badge>
    </div>
  );
}

export function PricingSelect({ selectedPlan, setSelectedPlan, pricingPlans, ...props }) {
  return (
    <Select value={selectedPlan} onValueChange={(value) => setSelectedPlan(value)} {...props}>
      <SelectTrigger className="w-full text-xl font-semibold border-indigo-200 bg-white text-indigo-900 transition-all duration-300 p-8">
        <SelectValue placeholder="Select a plan" />
      </SelectTrigger>
      <SelectContent className="p-2 border-indigo-100 bg-white rounded">
        <SelectGroup>
          {Object.entries(pricingPlans)?.map(([id, plan], idx) => (
            <SelectItem
              key={idx}
              value={plan.id}
              className="cursor-pointer rounded py-3 pl-8 pr-4 hover:bg-indigo-50 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-indigo-100">
                  <CircleCheckBig className="h-3.5 w-3.5 text-indigo-600" />
                </div>
                <span className="font-medium text-indigo-900">{plan.name}</span>
                {plan.popular && (
                  <Badge variant="secondary" className="ml-2 bg-indigo-100 text-indigo-700 text-xs border-0">
                    Popular
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
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

  useEffect(() => {
    if (!pricingPlans || pricingPlans.length === 0) {
      RequestHandler.Get("/query/v1/pricingPlan?guest").then(async (res) => {
        if (res.ok) {
          const { pricingPlans } = await res.json();
          if (pricingPlans.length > 0) {
            const plans = {};
            for (const plan of pricingPlans) {
              plans[plan.id] = plan;
            }
            setPricingPlans(plans);
            if (!selectedPlan) {
              const popular = pricingPlans.find((plan) => plan.popular);
              setSelectedPlan(popular ? popular.id : pricingPlans[0].id);
            }
          }
        }
      });
    }
  }, [selectedPlan, setPricingPlans, setSelectedPlan, pricingPlans]);

  const plan = pricingPlans[selectedPlan];
  if (!plan) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const monthlyDiscount = plan.monthlyDiscount ?? 1.0;
  const yearlyDiscount = plan.yearlyDiscount ?? 1.0;
  const monthlyPrice = plan.price * monthlyDiscount;
  const yearPrice = plan.price * yearlyDiscount * 12;

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="text-center mb-8">
        <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 px-4 py-1.5 mb-4">
          <Sparkles className="h-3.5 w-3.5 mr-1 text-indigo-600" />
          Flexible Plans
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight text-indigo-950">
          Choose the right plan for your business
        </h1>
        <p className="text-indigo-600 mt-2">Scale as you grow – no hidden fees</p>
      </div>

      <Card
        className={cn(
          "group relative px-6 md:px-8 w-full overflow-hidden border-indigo-100 bg-white shadow-xl transition-all duration-500 hover:shadow-indigo-200/50 hover:-translate-y-1",
          className
        )}
        {...props}
      >
        {/* Soft indigo glow on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        <CardHeader className="relative pb-0 space-y-6">
          <CardTitle className="space-y-4">
            <div className="flex items-center justify-between">
              <PricingSelect
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
                pricingPlans={pricingPlans}
              />
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="relative space-y-6 border-none rounded px-4 md:px-10">
          <div className="relative">
            <div className="text-center p-6 rounded-xl bg-indigo-50/30 border border-indigo-100 shadow-inner">
              {monthlyPrice > 0 && monthlyDiscount <= 0.99 && (
                <CompactDiscountBadge value={monthlyDiscount} />
              )}
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-extrabold text-indigo-900">
                  {formatPrice(monthlyPrice)}
                </span>
                <span className="text-sm text-indigo-500">/ monthly</span>
              </div>
              {plan.price > 0 && (
                <div className="flex flex-col items-center gap-2 mt-3">
                  {yearPrice > 0 && yearlyDiscount <= 0.99 && (
                    <CompactDiscountBadge value={yearlyDiscount} />
                  )}
                  <p className="text-indigo-600">
                    <span className="font-semibold text-indigo-900">
                      {formatPrice(yearPrice)}
                    </span>{" "}
                    <span className="text-sm">/ yearly</span>
                  </p>
                  <SavingsBadge monthlyPrice={monthlyPrice} yearPrice={yearPrice} />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl p-4 bg-indigo-50/50 border border-indigo-100 text-center">
              <Server className="h-5 w-5 text-indigo-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-indigo-900">{plan.maxServices}</p>
              <p className="text-xs text-indigo-600">Services</p>
            </div>
            <div className="rounded-xl p-4 bg-indigo-50/50 border border-indigo-100 text-center">
              <Users className="h-5 w-5 text-indigo-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-indigo-900">{plan.maxEmployees}</p>
              <p className="text-xs text-indigo-600">Employees</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-indigo-500 uppercase tracking-wider text-center">
              Included features
            </h3>
            <ul className="space-y-2.5">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-indigo-700">
                  <Check className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full flex items-stretch justify-center pt-4">
            <Link
              href={`/register/organization?plan=${plan.id}`}
              className="w-full text-center py-3 rounded-xl text-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-indigo-500/30"
            >
              Get Started with {plan.name}
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-2 pb-6 text-xs text-indigo-400">
          No credit card required • Cancel anytime
        </CardFooter>
      </Card>
    </div>
  );
}

export function PricingComparisonTable() {
  const pricingPlans = usePricingPlanStore((state) => state.pricingPlans);
  const hasHydrated = usePricingPlanStore.persist?.hasHydrated();

  if (!hasHydrated || Object.keys(pricingPlans).length === 0) return null;

  const plans = Object.values(pricingPlans).sort((a, b) => a.price - b.price);
  const allFeatures = Array.from(new Set(plans.flatMap((plan) => plan.features))).filter(
    (feature) =>
      !feature.toLowerCase().includes("service included") &&
      !feature.toLowerCase().includes("services included") &&
      !feature.toLowerCase().includes("employees")
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
    <div className="w-full max-w-6xl mx-auto mt-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-950 tracking-tight">Compare all features</h2>
        <p className="text-indigo-600 mt-2">Find the perfect fit for your team&apos;s size and needs.</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-indigo-100 bg-white shadow-lg">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-indigo-100 bg-indigo-50/50">
              <th className="p-6 border-r border-indigo-100 w-[20%] align-bottom">
                <span className="font-semibold text-lg text-indigo-900">Features overview</span>
              </th>
              {plans.map((plan) => {
                const monthlyPrice = plan.price * (plan.monthlyDiscount ?? 1.0);
                return (
                  <th
                    key={plan.id}
                    className="p-6 border-b border-indigo-100 text-center min-w-[180px] bg-white"
                  >
                    <div className="flex justify-center h-6 mb-2">
                      {plan.popular && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 px-2 py-0.5">
                          Most Popular
                        </Badge>
                      )}
                    </div>
                    <div className="font-bold text-xl text-indigo-900 mb-1">{plan.name}</div>
                    <div className="text-indigo-600 text-sm font-normal mb-4">
                      {monthlyPrice > 0 ? `${formatPrice(monthlyPrice)} / mo` : "Free Forever"}
                    </div>
                    <Link
                      href={`/register/organization?plan=${plan.id}`}
                      className={cn(
                        "inline-block w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
                        plan.popular
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                          : "border border-indigo-200 hover:bg-indigo-50 text-indigo-700"
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
            <tr className="hover:bg-indigo-50/30 transition-colors">
              <td className="p-4 border-b border-r border-indigo-100 font-medium text-indigo-700">
                Max Employees
              </td>
              {plans.map((plan) => (
                <td key={`emp-${plan.id}`} className="p-4 border-b border-indigo-100 text-center font-semibold text-indigo-900">
                  {plan.maxEmployees}
                </td>
              ))}
            </tr>
            <tr className="hover:bg-indigo-50/30 transition-colors">
              <td className="p-4 border-b border-r border-indigo-100 font-medium text-indigo-700">
                Max Services
              </td>
              {plans.map((plan) => (
                <td key={`srv-${plan.id}`} className="p-4 border-b border-indigo-100 text-center font-semibold text-indigo-900">
                  {plan.maxServices}
                </td>
              ))}
            </tr>
            {allFeatures.map((feature, idx) => (
              <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                <td className="p-4 border-b border-r border-indigo-100 font-medium text-indigo-700 text-sm">
                  {feature}
                </td>
                {plans.map((plan) => (
                  <td key={`${plan.id}-${idx}`} className="p-4 border-b border-indigo-100 text-center">
                    {plan.features.includes(feature) ? (
                      <Check className="h-5 w-5 text-indigo-600 mx-auto" />
                    ) : (
                      <Minus className="h-5 w-5 text-indigo-300 mx-auto" />
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
    <>
      <SiteHeader />
      <div className="min-h-screen py-16 px-4 md:px-8 flex flex-col items-center bg-gradient-to-br from-indigo-50/50 via-white to-indigo-100/30">
        <PricingPlanView />
        <PricingComparisonTable />
      </div>
      <SiteFooter />
    </>
  );
}