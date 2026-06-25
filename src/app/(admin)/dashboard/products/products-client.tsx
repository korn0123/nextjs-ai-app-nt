"use client";

import { useEffect, useState } from "react";
import type { AdminProduct, ApiResponse } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductFormModal } from "./product-form-modal";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";
import { RiAddLine, RiPencilLine, RiDeleteBinLine, RiSearchLine } from "@remixicon/react";

function useProductList(search: string, page: number) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));

    fetch(`/api/admin/products?${params}`)
      .then((res) => res.json() as Promise<ApiResponse<AdminProduct[]> & { total: number }>)
      .then((json) => {
        if (json.success) {
          setProducts(json.data);
          setTotal(json.total);
        }
      })
      .finally(() => setLoading(false));
  }, [search, page]);

  return { products, total, loading };
}

export function ProductsClient() {
  const [page, setPage] = useState(1);
  const [inputVal, setInputVal] = useState("");
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);

  const { products, total, loading } = useProductList(search, page);

  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(inputVal);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [inputVal]);

  function openCreate() {
    setEditProduct(null);
    setFormOpen(true);
  }

  function openEdit(product: AdminProduct) {
    setEditProduct(product);
    setFormOpen(true);
  }

  function formatTHB(value: number) {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(value);
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">จัดการสินค้า</h2>
          <Button onClick={openCreate}>
            <RiAddLine className="size-4" />
            เพิ่มสินค้า
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>สินค้าทั้งหมด ({total})</CardTitle>
              <div className="relative w-64">
                <RiSearchLine className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาสินค้า..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner className="size-5 text-muted-foreground" />
              </div>
            ) : products.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {search ? "ไม่พบสินค้าที่ค้นหา" : "ยังไม่มีสินค้า"}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ชื่อสินค้า</TableHead>
                      <TableHead>ราคา</TableHead>
                      <TableHead>หมวดหมู่</TableHead>
                      <TableHead className="w-24" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{formatTHB(p.price)}</TableCell>
                        <TableCell>{p.categoryName}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => openEdit(p)}
                            >
                              <RiPencilLine className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setDeleteTarget(p)}
                            >
                              <RiDeleteBinLine className="size-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      ก่อนหน้า
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {page} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      ถัดไป
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <ProductFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editProduct}
        onSuccess={() => {
          setFormOpen(false);
          setEditProduct(null);
        }}
      />

      <DeleteConfirmDialog
        product={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onSuccess={() => setDeleteTarget(null)}
      />
    </>
  );
}
