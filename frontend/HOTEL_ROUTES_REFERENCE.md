# Hotel Admin Panel - Routes Reference

## Quick Navigation

### Main Routes

| Page | URL | Description |
|------|-----|-------------|
| 🏠 Dashboard | `/hotel` | Overview with stats, charts, and top items |
| 💰 Billing | `/hotel/billing` | View and manage all bills |
| ⏰ Live Orders | `/hotel/live-orders` | Real-time order tracking (Kanban board) |
| 📜 Order History | `/hotel/order-history` | Past orders (placeholder) |
| 🍽️ Menu Management | `/hotel/menu` | Manage food items and pricing |
| 👥 Staff Management | `/hotel/staff` | Manage team members |
| ⚙️ Settings | `/hotel/settings` | Hotel configuration |

## URL Examples

### Local Development
```
http://localhost:5173/hotel
http://localhost:5173/hotel/billing
http://localhost:5173/hotel/live-orders
http://localhost:5173/hotel/order-history
http://localhost:5173/hotel/menu
http://localhost:5173/hotel/staff
http://localhost:5173/hotel/settings
```

### Existing Super Admin Routes (unchanged)
```
http://localhost:5173/admin              - Super Admin Dashboard
http://localhost:5173/admin/tenants      - Tenant Management
http://localhost:5173/admin/subscriptions - Subscriptions
http://localhost:5173/admin/users        - Tenant Users
http://localhost:5173/admin/features     - Feature Flags
http://localhost:5173/admin/monitoring   - System Monitoring
```

## Navigation Flow

```
Login Page (/)
    │
    ├─► Super Admin Panel (/admin/*)
    │   ├─ Dashboard
    │   ├─ Tenants
    │   ├─ Subscriptions
    │   ├─ Users
    │   ├─ Features
    │   └─ Monitoring
    │
    └─► Hotel Admin Panel (/hotel/*)
        ├─ Dashboard
        ├─ Billing
        ├─ Live Orders
        ├─ Order History
        ├─ Menu Management
        ├─ Staff Management
        └─ Settings
```

## Sidebar Menu Items

### Hotel Admin Sidebar

1. **Dashboard** 🏠
   - Icon: LayoutDashboard
   - Path: `/hotel`

2. **Billing** 💰
   - Icon: Receipt
   - Path: `/hotel/billing`

3. **Live Orders** ⏰
   - Icon: Clock
   - Path: `/hotel/live-orders`

4. **Order History** 📜
   - Icon: History
   - Path: `/hotel/order-history`

5. **Menu Management** 🍽️
   - Icon: UtensilsCrossed
   - Path: `/hotel/menu`

6. **Staff Management** 👥
   - Icon: Users
   - Path: `/hotel/staff`

7. **Settings** ⚙️
   - Icon: Settings
   - Path: `/hotel/settings`

## Testing Checklist

- [ ] Navigate to `/hotel` - See dashboard with 4 stat cards
- [ ] Click on "Billing" - See bills table
- [ ] Click on "Live Orders" - See Kanban board with 3 columns
- [ ] Click on "Order History" - See placeholder page
- [ ] Click on "Menu Management" - See menu items grid
- [ ] Click on "Staff Management" - See staff table
- [ ] Click on "Settings" - See settings form
- [ ] Check sidebar active state changes
- [ ] Verify real-time clock in header
- [ ] Test responsive layout

## API Integration Points (Future)

When connecting to backend, update these pages:

| Page | API Endpoints Needed |
|------|---------------------|
| Dashboard | `GET /api/dashboard/stats`, `GET /api/dashboard/sales-chart`, `GET /api/dashboard/top-items` |
| Billing | `GET /api/bills`, `GET /api/bills/:id`, `PATCH /api/bills/:id` |
| Live Orders | `GET /api/orders/live`, `PATCH /api/orders/:id/status`, WebSocket: `/ws/orders` |
| Order History | `GET /api/orders/history`, `GET /api/orders/:id` |
| Menu | `GET /api/menu`, `POST /api/menu`, `PATCH /api/menu/:id`, `DELETE /api/menu/:id` |
| Staff | `GET /api/staff`, `POST /api/staff`, `PATCH /api/staff/:id`, `DELETE /api/staff/:id` |
| Settings | `GET /api/settings`, `PATCH /api/settings` |

## Component Hierarchy

```
HotelAdminLayout
├── HotelAdminSidebar
│   └── Navigation Links (7 items)
├── HotelAdminHeader
│   ├── Welcome Message
│   └── Real-time Clock
└── Outlet (Route Content)
    ├── HotelDashboard
    ├── BillingPage
    ├── LiveOrdersPage
    ├── OrderHistoryPage
    ├── MenuManagementPage
    ├── StaffManagementPage
    └── SettingsPage
```

## Key Features by Page

### Dashboard
- Today's revenue stat
- Total orders stat
- Total bills stat
- Active orders stat
- Weekly sales chart (7 days)
- Top 4 selling items

### Billing
- Bills table with 6 columns
- Search functionality (UI ready)
- Status badges
- Responsive table

### Live Orders
- 3 Kanban columns
- Order cards with details
- Live updates indicator
- Animated cards

### Menu Management
- 3-column grid
- Menu item cards
- Edit/Delete buttons
- Add new button
- Availability toggle

### Staff Management
- Staff table with 6 columns
- Role badges
- Add staff button
- Status indicators

### Settings
- Hotel name input
- GST number input
- Service charge input
- WhatsApp message template
- Save button

---

**Quick Start**: `npm run dev` → Navigate to `http://localhost:5173/hotel`
