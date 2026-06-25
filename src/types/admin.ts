export interface AdminStats {
  todaySales: number;
  todayOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalUsers: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface AdminOrderItem {
  id: string;
  customerName: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface AdminProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: string;
  categoryName: string;
}

export interface CategoryOption {
  id: string;
  name: string;
}
