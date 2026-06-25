"use client";

import { Card, CardContent } from "@/components/ui/card";


interface KpiCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
}

export function KpiCard({ title, value, icon }: KpiCardProps) {
  return (
    <Card size="sm">
      <CardContent className="flex items-center gap-3">
        {icon && (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-xl font-semibold tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function KpiCardSkeleton() {
  return (
    <Card size="sm">
      <CardContent className="flex items-center gap-3">
        <div className="size-10 shrink-0 animate-pulse rounded-xl bg-muted" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="h-6 w-24 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}
