import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";
import { NextResponse } from "next/server";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
  }

  const existing = await prisma.products.findUnique({ where: { id: productId } });
  if (!existing) {
    return NextResponse.json({ success: false, error: "ไม่พบสินค้า" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues.map((i) => i.message).join(", ") },
      { status: 400 },
    );
  }

  const { name, description, price, categoryId } = parsed.data;

  const product = await prisma.products.update({
    where: { id: productId },
    data: {
      name,
      description: description || null,
      price,
      category_id: parseInt(categoryId, 10) || null,
    },
    include: { categories: { select: { id: true, name: true } } },
  });

  return NextResponse.json({
    success: true,
    data: {
      id: String(product.id),
      name: product.name ?? "",
      description: product.description,
      price: Number(product.price ?? 0),
      categoryId: String(product.category_id ?? ""),
      categoryName: product.categories?.name ?? "",
    },
  });
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const productId = parseInt(id, 10);
  if (isNaN(productId)) {
    return NextResponse.json({ success: false, error: "Invalid product ID" }, { status: 400 });
  }

  const existing = await prisma.products.findUnique({ where: { id: productId } });
  if (!existing) {
    return NextResponse.json({ success: false, error: "ไม่พบสินค้า" }, { status: 404 });
  }

  const orderCount = await prisma.order_items.count({
    where: { product_id: productId },
  });

  if (orderCount > 0) {
    return NextResponse.json(
      { success: false, error: `ไม่สามารถลบได้ สินค้านี้มีคำสั่งซื้อ ${orderCount} รายการ` },
      { status: 409 },
    );
  }

  await prisma.products.delete({ where: { id: productId } });

  return NextResponse.json({ success: true, data: null });
}
