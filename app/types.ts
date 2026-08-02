export type OrderStatus =
  | 'pending'
  | 'calling'
  | 'call_later'
  | 'confirmed'
  | 'cancelled'
  | 'delivered';

export type OrderPriority = 'urgent' | 'high' | 'normal';

export type DeliveryType = 'home' | 'desk';

export type ActivityType =
  | 'created'
  | 'called'
  | 'no_answer'
  | 'whatsapp'
  | 'confirmed'
  | 'cancelled'
  | 'delivered'
  | 'note_added'
  | 'reminder_set';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface NoteItem {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  tag?: string;
}

export interface ReminderItem {
  id: string;
  orderId: string;
  date: string;
  time: string;
  reason: string;
  createdAt: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  altPhone?: string;
  productName: string;
  productImage: string;
  color: string;
  colorHex?: string;
  size: string;
  quantity: number;
  price: number;
  shippingFee: number;
  totalAmount: number;
  city: string;
  wilayaCode: string;
  address: string;
  deliveryType: DeliveryType;
  creationDate: string;
  status: OrderStatus;
  priority: OrderPriority;
  notes: NoteItem[];
  activities: ActivityItem[];
  reminder?: ReminderItem;
  callAttempts: number;
  lastCallAt?: string;
  landingPage: string;
}

export interface FilterOptions {
  search: string;
  status: OrderStatus | 'all';
  city: string;
  dateRange: 'all' | 'today' | 'yesterday' | 'week' | 'month';
  product: string;
  sortBy: 'newest' | 'oldest' | 'highest_price' | 'lowest_price';
}

export interface StatsSummary {
  totalOrders: number;
  pendingCount: number;
  callingCount: number;  callLaterCount: number;
  confirmedCount: number;
  cancelledCount: number;
  deliveredCount: number;
  closingRate: number;
  totalRevenue: number;
  pendingFollowUps: number;
  avgConfirmationTimeMinutes: number;
}
