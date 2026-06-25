"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { productSchema, type ProductFormValues } from "@/lib/validations/product";
import type { AdminProduct, CategoryOption, ApiResponse } from "@/types/admin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: AdminProduct | null;
  onSuccess: () => void;
}

const defaultValues: ProductFormValues = {
  name: "",
  description: "",
  price: 0,
  categoryId: "",
};

export function ProductFormModal({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductFormModalProps) {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ProductFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues,
  });

  useEffect(() => {
    if (open) {
      fetch("/api/admin/categories")
        .then((res) => res.json() as Promise<ApiResponse<CategoryOption[]>>)
        .then((json) => {
          if (json.success) setCategories(json.data);
        });
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      if (product) {
        form.reset({
          name: product.name,
          description: product.description ?? "",
          price: product.price,
          categoryId: product.categoryId,
        });
      } else {
        form.reset(defaultValues);
      }
    }
  }, [open, product, form]);

  async function onSubmit(data: ProductFormValues) {
    setSubmitting(true);

    const url = product
      ? `/api/admin/products/${product.id}`
      : "/api/admin/products";
    const method = product ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json: ApiResponse<AdminProduct> = await res.json();

      if (json.success) {
        toast.success(product ? "แก้ไขสินค้าสำเร็จ" : "เพิ่มสินค้าสำเร็จ");
        onSuccess();
      } else {
        toast.error(json.error);
      }
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {product ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
          </DialogTitle>
        </DialogHeader>

        <form id="product-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>ชื่อสินค้า</FieldLabel>
                  <Input
                    {...field}
                    placeholder="ชื่อสินค้า"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>รายละเอียด</FieldLabel>
                  <Input
                    {...field}
                    placeholder="รายละเอียดสินค้า (ไม่บังคับ)"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>ราคา</FieldLabel>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="categoryId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>หมวดหมู่</FieldLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            ยกเลิก
          </Button>
          <Button
            type="submit"
            form="product-form"
            disabled={submitting}
          >
            {submitting && <Spinner className="size-4" />}
            {product ? "บันทึก" : "เพิ่มสินค้า"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
