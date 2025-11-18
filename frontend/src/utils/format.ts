export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    // Order statuses
    PENDING: 'bg-yellow-100 text-yellow-800',
    COOKING: 'bg-blue-100 text-blue-800',
    READY: 'bg-green-100 text-green-800',
    SERVED: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
    CANCELLED: 'bg-red-100 text-red-800',

    // Table statuses
    FREE: 'bg-green-100 text-green-800',
    OCCUPIED: 'bg-red-100 text-red-800',
    RESERVED: 'bg-yellow-100 text-yellow-800',

    // Payment statuses
    PAID: 'bg-green-100 text-green-800',
    PARTIAL: 'bg-yellow-100 text-yellow-800',
  };

  return statusColors[status] || 'bg-gray-100 text-gray-800';
};
