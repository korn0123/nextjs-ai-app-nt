"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { AdminProduct, ApiResponse } from "@/types/admin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

interface DeleteConfirmDialogProps {
  product: AdminProduct | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteConfirmDialog({
  product,
  onClose,
  onSuccess,
}: DeleteConfirmDialogProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!product) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });

      const json: ApiResponse<null> = await res.json();

      if (json.success) {
        toast.success("ลบสินค้าสำเร็จ");
        onSuccess();
      } else {
        toast.error(json.error);
      }
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
    } finally {
      setDeleting(false);
      onClose();
    }
  }

  return (
    <AlertDialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบ</AlertDialogTitle>
          <AlertDialogDescription>
            คุณแน่ใจหรือไม่ที่จะลบ{" "}
            <span className="font-medium text-foreground">
              {product?.name}
            </span>
            ? การกระทำนี้ไม่สามารถย้อนกลับได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleting}
            onClick={handleDelete}
          >
            {deleting && <Spinner className="size-4" />}
            ลบ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
