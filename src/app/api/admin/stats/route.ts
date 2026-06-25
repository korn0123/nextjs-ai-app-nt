import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todayOrdersResult, pendingOrdersCount, totalProducts, totalUsers] =
    await Promise.all([
      prisma.orders.findMany({
        where: { date: { gte: today } },
        select: { total_amount: true },
      }),
      prisma.orders.count({
        where: { status: "processing" },
      }),
      prisma.products.count(),
      prisma.user.count(),
    ]);

  const todaySales = todayOrdersResult.reduce(
    (sum, o) => sum + Number(o.total_amount ?? 0),
    0,
  );

  return NextResponse.json({
    todaySales,
    todayOrders: todayOrdersResult.length,
    pendingOrders: pendingOrdersCount,
    totalProducts,
    totalUsers,
  });
}
