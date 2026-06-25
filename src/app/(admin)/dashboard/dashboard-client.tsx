"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type {
  AdminStats,
  RevenuePoint,
  AdminOrderItem,
} from "@/types/admin";
import { KpiCard, KpiCardSkeleton } from "@/components/admin/kpi-card";
import { PeriodSelector } from "@/components/admin/period-selector";
import { RecentOrdersTable } from "@/components/admin/recent-orders-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const RevenueChart = dynamic(
  () => import("@/components/admin/revenue-chart").then((m) => ({ default: m.RevenueChart })),
  { ssr: false },
);

function useStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch("/api/admin/stats")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<AdminStats>;
      })
      .then(setStats)
      .catch(() => setError("ไม่สามารถโหลดสถิติได้"))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error, load };
}

function useOrders() {
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch("/api/admin/orders?limit=5")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<{ orders: AdminOrderItem[] }>;
      })
      .then((data) => setOrders(data.orders))
      .catch(() => setError("ไม่สามารถโหลดคำสั่งซื้อล่าสุดได้"))
      .finally(() => setLoading(false));
  }, []);

  return { orders, loading, error, load };
}

function useRevenue(period: string) {
  const [data, setData] = useState<RevenuePoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ctrl = new AbortController();

    fetch(`/api/admin/revenue?period=${period}`, { signal: ctrl.signal })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json() as Promise<RevenuePoint[]>;
      })
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [period]);

  return { data, loading };
}

export function DashboardClient() {
  const { stats, loading: statsLoading, error: statsError, load: loadStats } = useStats();
  const { orders, loading: ordersLoading, error: ordersError, load: loadOrders } = useOrders();
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const { data: revenue, loading: revenueLoading } = useRevenue(period);

  useEffect(() => {
    loadStats();
    loadOrders();
    const interval = setInterval(() => {
      loadStats();
      loadOrders();
    }, 30_000);
    return () => clearInterval(interval);
  }, [loadStats, loadOrders]);

  function formatTHB(value: number) {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(value);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">ภาพรวม</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {statsLoading
          ? Array.from({ length: 5 }).map((_, i) => <KpiCardSkeleton key={i} />)
          : statsError
            ? (
              <div className="col-span-full flex flex-col items-center gap-2 py-8 text-sm text-muted-foreground">
                <p>{statsError}</p>
                <Button variant="outline" size="sm" onClick={loadStats}>
                  ลองใหม่
                </Button>
              </div>
            )
            : stats && (
              <>
                <KpiCard title="ยอดขายวันนี้" value={formatTHB(stats.todaySales)} />
                <KpiCard title="ออเดอร์วันนี้" value={String(stats.todayOrders)} />
                <KpiCard title="รอดำเนินการ" value={String(stats.pendingOrders)} />
                <KpiCard title="สินค้าทั้งหมด" value={String(stats.totalProducts)} />
                <KpiCard title="ผู้ใช้ทั้งหมด" value={String(stats.totalUsers)} />
              </>
            )}
      </div>

      <div className="flex items-center gap-2">
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={revenue} loading={revenueLoading} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>คำสั่งซื้อล่าสุด</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrdersTable
              orders={orders}
              loading={ordersLoading}
              error={ordersError}
              onRetry={loadOrders}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
