"use client";

import React, { useState, useEffect } from "react";
import {
  MonitorSmartphone,
  Stethoscope,
  Microscope,
  CreditCard,
  CheckCircle,
  RefreshCcw,
  Pause,
  Play,
  ArrowLeft,
  ArrowRight,
  Split,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "./ui/button-group";
import { Alert, AlertDescription } from "./ui/alert";
import { useParams } from "next/navigation";

const transitionDelay = 2000;
const GRID_X = 160;
const GRID_Y = 160;
const X_OFFSET = 0.5;
const Y_OFFSET = 0.4;

const STEPS = [
  // { id: 0, actor: "Patient", title: "Entry", icon: User, x: 0, y: 0 },
  {
    id: 0,
    actor: "Front Desk",
    title: "Triage",
    description: "Appointment time arrived",
    icon: MonitorSmartphone,
    x: X_OFFSET + 0,
    y: Y_OFFSET + 0.25,
  },
  {
    id: 1,
    actor: "System",
    title: "Payment",
    description: "Paying for services",
    icon: CreditCard,
    x: X_OFFSET + 0.75,
    y: Y_OFFSET + 0,
  },
  {
    id: 2,
    actor: "Doctor",
    title: "Consult",
    description: "Patient being examined",
    icon: Stethoscope,
    x: X_OFFSET + 1.5,
    y: Y_OFFSET + 0.25,
  },
  {
    id: 3,
    actor: "Laboratory",
    title: "Lab Tests",
    description: "Patient taking tests",
    icon: Microscope,
    x: X_OFFSET + 2.25,
    y: Y_OFFSET + 0,
    attachment: "Lab_Results.pdf",
  },
  {
    id: 4,
    actor: "Doctor",
    title: "Follow-up",
    description: "Patient receiving treatment and prescription",
    icon: Stethoscope,
    x: X_OFFSET + 3,
    y: Y_OFFSET + 0.25,
  },
  {
    id: 5,
    actor: "System",
    title: "Complete",
    description: "Service marked done",
    icon: CheckCircle,
    x: X_OFFSET + 3.75,
    y: Y_OFFSET + 0.25,
  },
];

export function WorkflowAnimation() {
  const { locale } = useParams();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setTimeout(
        () => setActiveIdx((prev) => (prev + 1) % STEPS.length),
        transitionDelay,
      );
    } else {
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [activeIdx, isPlaying]);

  function togglePlayPause() {
    if (!isPlaying) {
      setActiveIdx((prev) => (prev + 1) % STEPS.length);
    }
    setIsPlaying((isPlaying) => !isPlaying);
  }

  return (
    <div className="w-full max-w-6xl min-h-[350] mx-auto px-4 bg-transparent font-sans flex flex-col items-center justify-between">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-2">
          {/* <Split className="inline-block w-8 h-8 mr-2 text-primary" /> */}
          <span>Dynamic Workflow</span>
        </h2>
        <Alert>
          <AlertDescription className="px-8 py-1 flex items-center gap-4">
            <span className="text-primary">
              <Info size={32} />
            </span>
            <span>
              No workflow is predefined, instead the next flow is decided by the
              current employee
              <br />
              <em>Scenario: A patient receiving treatment in a hospital.</em>
            </span>
          </AlertDescription>
        </Alert>
        {/* <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
            Dynamic workflow illustration
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            No workflow is predefined, instead the next flow is decided by the
            current employee.
            <br />
            <em>Scenario: A patient receiving treatment in a hospital.</em>
          </p>
        </div> */}
      </div>

      <div className="relative w-full min-h-[300] bottom-0 top-0 left-0 right-0 overflow-auto">
        {/* Advanced SVG Pathing */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {STEPS.map((step, i) => {
            if (i === 0) return null;
            const prev = STEPS[i - 1];
            const isVisible = i <= activeIdx;

            const x1 = 80 + prev.x * GRID_X;
            const y1 = 50 + prev.y * GRID_Y;
            const x2 = 80 + step.x * GRID_X;
            const y2 = 50 + step.y * GRID_Y;

            return (
              <g key={`path-group-${i}`}>
                {/* Background Shadow Path */}
                {i <= activeIdx + 1 && (
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    // stroke="#f1f5f9"
                    className="stroke-primary/15"
                    strokeWidth="2"
                  />
                )}

                {/* Active Laser Path */}
                {isVisible && (
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    // stroke="#ea580c"
                    strokeWidth="2"
                    strokeDasharray="1000"
                    strokeDashoffset={isVisible ? 0 : 1000}
                    filter="url(#glow)"
                    className="transition-all stroke-primary duration-1000 ease-in-out"
                    style={{
                      strokeDashoffset: isVisible ? 0 : 1000,
                      transitionProperty: "stroke-dashoffset",
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes Layer */}
        {STEPS.map((step, i) => {
          // Logic: Follow-up Doctor re-uses the original Doctor node's position
          // if (step.id === 4) return null;

          const isRevealed =
            i <= activeIdx || (step.id === 2 && activeIdx >= 4);
          const isActive = activeIdx === i;

          if (!isRevealed) return null; // Node doesn't exist in DOM until reached

          return (
            <div
              key={`node-${i}`}
              className={`absolute transition-all duration-500 flex flex-col items-center animate-in fade-in zoom-in-75
                ${isActive ? "z-30 scale-110" : "z-10 scale-100"}
              `}
              style={{
                left: `${80 + step.x * GRID_X}px`,
                top: `${80 + step.y * GRID_Y}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Core Node Icon */}
              <div
                className={`
                w-16 h-16 rounded flex items-center justify-center transition-all duration-300 shadow-2xl
                ${isActive ? "bg-slate-900 text-primary border-b-4 border-primary/90" : "bg-white border-2 border-primary/15 text-slate-400"}
              `}
              >
                <step.icon
                  size={28}
                  className={isActive ? "animate-pulse" : ""}
                />
              </div>

              {/* Data Label */}
              <div className="mt-6 text-center w-36">
                <p
                  className={`text-[10px] font-black uppercase tracking-tighter mb-1 ${isActive ? "text-primary" : "text-slate-400"}`}
                >
                  {step.actor}
                </p>
                <p className="text-sm font-black text-slate-800 tracking-tight">
                  {step.title}
                </p>
              </div>

              {/* Dynamic Metadata Tooltip */}
              {isActive && (
                <div className="absolute -top-10 bg-slate-900 text-white text-sm px-3 py-1 font-mono border-l-2 border-primary whitespace-nowrap shadow-xl animate-in slide-in-from-bottom-2">
                  {step.description}
                  {step.attachment && (
                    <span className="ml-2 text-primary">
                      [{step.attachment}]
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Animation Controls */}
      <ButtonGroup className="shadow-md rounded-[0.5em]">
        <Button
          variant="ghost"
          onClick={() =>
            setActiveIdx((prev) =>
              prev === 0 ? STEPS.length - 1 : (prev - 1) % STEPS.length,
            )
          }
          className="text-slate-400 hover:text-primary hover:bg-primary/10 rounded-none border-b border-slate-200 rounded-s-[0.5em]"
        >
          <ArrowLeft />
        </Button>
        <Button
          variant="ghost"
          onClick={() => togglePlayPause()}
          className="text-slate-400 hover:text-primary hover:bg-primary/10 rounded-none border-b border-slate-200"
        >
          {isPlaying ? <Pause /> : <Play />}
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveIdx((prev) => (prev + 1) % STEPS.length)}
          className="text-slate-400 hover:text-primary hover:bg-primary/10 rounded-none border-b border-slate-200"
        >
          <ArrowRight />
        </Button>
        <Button
          variant="ghost"
          onClick={() => setActiveIdx(0)}
          className="text-slate-400 hover:text-primary hover:bg-primary/10 rounded-none border-b border-slate-200 rounded-r-[0.5em]"
        >
          <RefreshCcw />
        </Button>
      </ButtonGroup>
    </div>
  );
}
