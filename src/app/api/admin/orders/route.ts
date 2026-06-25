import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "5", 10), 50);

  const orders = await prisma.orders.findMany({
    take: limit,
    orderBy: { date: "desc" },
    include: { customers: { select: { name: true } } },
  });

  const items = orders.map((o) => ({
    id: String(o.id),
    customerName: o.customers?.name ?? "ไม่ระบุ",
    amount: Number(o.total_amount ?? 0),
    status: mapStatus(o.status),
    createdAt: o.date?.toISOString() ?? new Date().toISOString(),
  }));

  return NextResponse.json({ orders: items, total: items.length });
}

function mapStatus(
  status: string | null | undefined,
): "pending" | "completed" | "cancelled" {
  if (status === "processing") return "pending";
  if (status === "delivered") return "completed";
  if (status === "received") return "completed";
  return "pending";
}
