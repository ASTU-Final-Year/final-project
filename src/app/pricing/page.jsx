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
  Zap,
  Building2,
  Users,
  Server,
  Tag,
  CircleDollarSign,
} from "lucide-react";
import { usePricingPlanStore } from "@/store";
import Link from "next/link";

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
  // const savingsPercentage = Math.round((savings / monthlyCost) * 100);

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

      {/* Tooltip on hover */}
      {/* <div className="absolute top-full left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-popover text-popover-foreground text-xs rounded-lg p-2 shadow-lg border border-border">
          <p className="font-medium mb-1">You save:</p>
          <p>{formatPrice(savings)} per year</p>
          <p className="text-muted-foreground mt-1">
            ({savingsPercentage}% off monthly rate)
          </p>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-popover border-r border-b border-border" />
        </div>
      </div> */}
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
            // const Icon = plan.icon;
            return (
              <SelectItem
                key={idx}
                value={plan.id}
                className="cursor-pointer rounded py-3 pl-8 pr-4 hover:bg-muted transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-primary/10">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
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

export function PricingPlanView({
  // selectedPlan,
  // setSelectedPlan,
  className,
  ...props
}) {
  const pricingPlans = usePricingPlanStore((state) => state.pricingPlans);
  const setPricingPlans = usePricingPlanStore((state) => state.setPricingPlans);
  const selectedPlan = usePricingPlanStore((state) => state.selectedPlan);
  const setSelectedPlan = usePricingPlanStore((state) => state.setSelectedPlan);
  const hasHydrated = usePricingPlanStore.persist?.hasHydrated();

  useEffect(() => {
    if (hasHydrated && Object.entries(pricingPlans).length === 0) {
      fetch("/api/v1/pricing-plans").then(async (res) => {
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
              console.log(popular);
              setSelectedPlan(popular ? popular.id : data.pricingPlans[0].id);
            }
          }
        }
      });
    }
  }, [
    selectedPlan,
    setPricingPlans,
    setSelectedPlan,
    hasHydrated,
    pricingPlans,
  ]);

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

  const monthlyDiscount = plan.discounts?.monthly ?? 1.0;
  const annualDiscount = plan.discounts?.annual ?? 1.0;

  const monthlyPrice = plan.price * monthlyDiscount;
  const annualPrice = plan.price * annualDiscount * 12;

  return (
    <div>
      <div className="flex flex-col gap-2 justify-center items-center p-2 mb-10">
        <div className="text-primary">
          <CircleDollarSign size={64} />
        </div>
        <h2 className="text-xl">
          choose the right pricing plan for your business
        </h2>
      </div>
      <Card
        className={cn(
          "group relative px-8 w-full min-w-lg sm:max-w-xl overflow-hidden border-border bg-card shadow-lg transition-all duration-500 hover:shadow-xl",
          className,
        )}
        {...props}
      >
        {/* Decorative gradient elements using theme colors */}
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
          {/* Price section with Savings Badge */}
          <div className="relative">
            <div className="text-center p-5 rounded-lg bg-muted/30 border-none">
              {monthlyPrice > 0 && monthlyDiscount <= 0.99 && (
                <CompactDiscountBadge value={monthlyDiscount} />
              )}
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-foreground">
                  {formatPrice(monthlyPrice)}
                </span>
                <span className="text-sm text-muted-foreground">/ month</span>
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
                      / year
                    </span>
                  </p>

                  {/* Savings Badge */}
                  <SavingsBadge
                    monthlyPrice={monthlyPrice}
                    annualPrice={annualPrice}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded p-3 bg-muted/30 border border-border relative">
              {/* {discounts.monthly < 1 && (
              <CompactDiscountBadge value={discounts.monthly} />
            )} */}
              <p className="text-xl font-semibold text-foreground">
                {plan.maxServices}
              </p>
              <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                <Server className="h-3.5 w-3.5" />
                <span className="text-xs">Services</span>
              </div>
            </div>
            <div className="p-3 rounded bg-muted/30 border border-border relative">
              {/* {discounts.annual < 1 && (
              <CompactDiscountBadge value={discounts.annual} />
            )} */}
              <p className="text-xl font-semibold text-foreground">
                {plan.maxEmployees}
              </p>
              <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                <Users className="h-3.5 w-3.5" />
                <span className="text-xs">Employees</span>
              </div>
            </div>
          </div>

          {/* Features list */}
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

          {/* CTA Button */}
          <div className="w-full flex items-stretch justify-center">
            <Link
              href={`/register?plan=${plan.id}`}
              className="p-2 text-center rounded flex-1 text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-sm hover:shadow"
            >
              Get Started with {plan.name}
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          {/* Trust indicator */}
          {/* <p className="text-center text-xs text-muted-foreground">
          No credit card required • Cancel anytime
        </p> */}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function PricingPlansPage() {
  // const [selectedPlan, setSelectedPlan] = React.useState(0);

  return (
    <div className="min-h-screen p-8 flex flex-col gap-6 justify-center items-center bg-background">
      <PricingPlanView
      // selectedPlan={selectedPlan}
      // setSelectedPlan={setSelectedPlan}
      />
    </div>
  );
}
