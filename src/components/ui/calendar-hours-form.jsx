import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function WeeklyHoursConfig({ weekly, weeklyHours, onChange }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handleTimeChange = (dayIdx, isEnd, value) => {
    const current = weeklyHours?.[dayIdx] || ["08:00", "17:00"];
    const newHours = [...current];
    newHours[isEnd ? 1 : 0] = value;
    onChange({ ...weeklyHours, [dayIdx]: newHours });
  };

  const setAllDays = (timeRange) => {
    const newWeeklyHours = {};
    weekly.forEach((d) => {
      newWeeklyHours[d] = timeRange;
    });
    onChange(newWeeklyHours);
  };

  if (!weekly || weekly.length === 0) return null;

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/50 p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-blue-100 p-1.5 text-blue-600">
            <Clock className="h-4 w-4" />
          </div>
          <Label className="text-base font-semibold text-slate-800">
            Configure Daily Hours
          </Label>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 shrink-0 rounded-lg border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          onClick={() => setAllDays(["08:30", "17:30"])}
        >
          Set all to 08:30 - 17:30
        </Button>
      </div>

      <div className="grid gap-0 divide-y divide-slate-100">
        {weekly.sort().map((dayIdx) => {
          const hours = weeklyHours?.[dayIdx] || ["08:00", "17:00"];
          return (
            <div
              key={dayIdx}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 transition-colors hover:bg-slate-50/50"
            >
              <div className="w-16 shrink-0">
                <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                  {days[dayIdx]}
                </span>
              </div>
              <div className="flex flex-1 items-center gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <Input
                    type="time"
                    value={hours[0]}
                    onChange={(e) =>
                      handleTimeChange(dayIdx, false, e.target.value)
                    }
                    className="h-10 w-full sm:w-[140px] rounded-lg border-slate-200 px-3 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>
                <span className="text-xs font-medium text-slate-400">to</span>
                <div className="relative flex-1 sm:flex-none">
                  <Input
                    type="time"
                    value={hours[1]}
                    onChange={(e) =>
                      handleTimeChange(dayIdx, true, e.target.value)
                    }
                    className="h-10 w-full sm:w-[140px] rounded-lg border-slate-200 px-3 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function GlobalHoursConfig({
  hours,
  onChange,
  label = "Blocked Time Slots",
}) {
  const handleAdd = () => {
    onChange([...(hours || []), ["12:00", "13:00"]]);
  };

  const handleRemove = (idx) => {
    const newHours = [...hours];
    newHours.splice(idx, 1);
    onChange(newHours);
  };

  const handleTimeChange = (idx, isEnd, value) => {
    const newHours = [...hours];
    newHours[idx] = [...newHours[idx]];
    newHours[idx][isEnd ? 1 : 0] = value;
    onChange(newHours);
  };

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-orange-200/60 bg-white shadow-sm transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100 bg-orange-50/50 p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-orange-100 p-1.5 text-orange-600">
            <AlertCircle className="h-4 w-4" />
          </div>
          <Label className="text-base font-semibold text-orange-900">
            {label}
          </Label>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 shrink-0 rounded-lg border-orange-200 bg-white text-xs font-medium text-orange-700 shadow-sm hover:bg-orange-50 hover:text-orange-800"
          onClick={handleAdd}
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Blocked Slot
        </Button>
      </div>

      <div className="p-4">
        {(!hours || hours.length === 0) ? (
          <div className="flex items-center justify-center rounded-lg border border-dashed border-orange-200 bg-orange-50/30 py-8">
            <p className="text-sm font-medium text-orange-600/70">
              No blocked slots defined.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {(hours || []).map((slot, idx) => (
              <div
                key={idx}
                className="group flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border border-orange-100 bg-white p-3 shadow-sm transition-all hover:border-orange-200 hover:shadow-md"
              >
                <div className="flex flex-1 items-center gap-3">
                  <div className="relative flex-1 sm:flex-none">
                    <Input
                      type="time"
                      value={slot[0]}
                      onChange={(e) =>
                        handleTimeChange(idx, false, e.target.value)
                      }
                      className="h-10 w-full sm:w-[140px] rounded-lg border-orange-200 px-3 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-orange-400"
                    />
                  </div>
                  <span className="text-xs font-medium text-orange-300">to</span>
                  <div className="relative flex-1 sm:flex-none">
                    <Input
                      type="time"
                      value={slot[1]}
                      onChange={(e) =>
                        handleTimeChange(idx, true, e.target.value)
                      }
                      className="h-10 w-full sm:w-[140px] rounded-lg border-orange-200 px-3 shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-orange-400"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 shrink-0 self-end sm:self-auto rounded-lg text-orange-500 opacity-80 hover:bg-red-50 hover:text-red-600 hover:opacity-100 transition-all sm:opacity-0 sm:group-hover:opacity-100"
                  onClick={() => handleRemove(idx)}
                  title="Remove slot"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
