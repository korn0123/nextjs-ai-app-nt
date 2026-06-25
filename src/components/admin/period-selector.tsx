"use client";

import { Button } from "@/components/ui/button";

const periods = [
  { value: "7d", label: "7 วัน" },
  { value: "30d", label: "30 วัน" },
  { value: "90d", label: "90 วัน" },
] as const;

interface PeriodSelectorProps {
  value: string;
  onChange: (value: "7d" | "30d" | "90d") => void;
}

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex gap-1">
      {periods.map((p) => (
        <Button
          key={p.value}
          variant={value === p.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(p.value)}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}
