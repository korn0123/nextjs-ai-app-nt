"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import type { AdminOrderItem } from "@/types/admin";

interface RecentOrdersTableProps {
  orders: AdminOrderItem[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  pending: { label: "รอดำเนินการ", variant: "secondary" },
  completed: { label: "สำเร็จ", variant: "default" },
  cancelled: { label: "ยกเลิก", variant: "destructive" },
};

function formatTHB(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(value);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("th-TH");
}

export function RecentOrdersTable({ orders, loading, error, onRetry }: RecentOrdersTableProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-sm text-muted-foreground">
        <p>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            ลองใหม่
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner className="size-5 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>คำสั่งซื้อ</TableHead>
          <TableHead>ลูกค้า</TableHead>
          <TableHead>ยอดเงิน</TableHead>
          <TableHead>สถานะ</TableHead>
          <TableHead>วันที่</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
              ไม่มีคำสั่งซื้อ
            </TableCell>
          </TableRow>
        ) : (
          orders.map((order) => {
            const statusInfo = statusMap[order.status] ?? statusMap.pending;
            return (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{formatTHB(order.amount)}</TableCell>
                <TableCell>
                  <Badge variant={statusInfo.variant as "default" | "secondary" | "destructive"}>{statusInfo.label}</Badge>
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
