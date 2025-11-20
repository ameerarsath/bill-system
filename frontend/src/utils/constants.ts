export const ORDER_TYPES = [
  { value: 'DINE_IN', label: 'Dine In' },
  { value: 'PARCEL', label: 'Parcel' },
  { value: 'TAKEAWAY', label: 'Takeaway' },
];

export const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'UPI', label: 'UPI' },
  { value: 'CARD', label: 'Card' },
  { value: 'WALLET', label: 'Wallet' },
  { value: 'CREDIT', label: 'Credit' },
];

export const ORDER_STATUSES = {
  PENDING: 'Pending',
  COOKING: 'Cooking',
  READY: 'Ready',
  SERVED: 'Served',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const PAYMENT_STATUSES = {
  PENDING: 'Pending',
  PARTIAL: 'Partial',
  PAID: 'Paid',
};

export const ROLES = {
  ADMIN: 'Admin',
  SERVANT: 'Servant',
  KITCHEN: 'Kitchen',
  CASHIER: 'Cashier',
};
