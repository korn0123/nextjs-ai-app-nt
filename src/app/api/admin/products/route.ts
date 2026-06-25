import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { productSchema } from "@/lib/validations/product";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = 10;
  const skip = (page - 1) * limit;

  const where = search
    ? { name: { contains: search } }
    : {};

  const [products, total] = await Promise.all([
    prisma.products.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: "desc" },
      include: { categories: { select: { id: true, name: true } } },
    }),
    prisma.products.count({ where }),
  ]);

  const data = products.map((p) => ({
    id: String(p.id),
    name: p.name ?? "",
    description: p.description,
    price: Number(p.price ?? 0),
    categoryId: String(p.category_id ?? ""),
    categoryName: p.categories?.name ?? "",
  }));

  return NextResponse.json({ success: true, data, total });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
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

  const product = await prisma.products.create({
    data: {
      name,
      description: description || null,
      price,
      category_id: parseInt(categoryId, 10) || null,
    },
    include: { categories: { select: { id: true, name: true } } },
  });

  return NextResponse.json(
    {
      success: true,
      data: {
        id: String(product.id),
        name: product.name ?? "",
        description: product.description,
        price: Number(product.price ?? 0),
        categoryId: String(product.category_id ?? ""),
        categoryName: product.categories?.name ?? "",
      },
    },
    { status: 201 },
  );
}
