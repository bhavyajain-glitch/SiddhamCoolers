# Use Case Diagram — Siddham Coolers E-Commerce Platform

<div align="center">

### 📊 Rendered Diagram

<img src="Assets/UseCaseDiagram.png" alt="Use Case Diagram — Siddham Coolers" width="800"/>

</div>

---

## Actors

| Actor | Description |
|---|---|
| **Customer** | End user who browses, orders products, and optionally applies a retailer coupon |
| **Retailer** | Distribution partner who shares coupon codes and earns commission |
| **Admin** | Business administrator who manages orders, products, and retailer analytics |
| **Payment Gateway** | External system (Razorpay / Stripe) that processes payments |

---

## Use Case Diagram

```mermaid
graph LR
    %% ── Actors ──
    Customer(("👤 Customer"))
    Retailer(("🏪 Retailer"))
    Admin(("🔧 Admin"))
    PG(("💳 Payment Gateway"))

    %% ── System Boundary ──
    subgraph SiddhamCoolers ["Siddham Coolers E-Commerce Platform"]
        %% Customer Use Cases
        UC1["Register / Login"]
        UC2["Browse Product Catalogue"]
        UC3["Search & Filter Products"]
        UC4["View Product Details"]
        UC5["Manage Cart"]
        UC6["Manage Wishlist"]
        UC7["Apply Retailer Coupon"]
        UC8["Checkout & Place Order"]
        UC9["Make Payment"]
        UC10["Track Order Status"]
        UC11["Write Product Review"]

        %% Retailer Use Cases
        UC12["Register as Retailer"]
        UC13["Login"]
        UC14["View / Share Coupon Code"]
        UC15["View Sales Dashboard"]
        UC16["View Earnings & Payouts"]
        UC17["Update Profile / Bank Details"]

        %% Admin Use Cases
        UC18["Login"]
        UC19["Manage Products (CRUD)"]
        UC20["View All Orders"]
        UC21["Update Order / Delivery Status"]
        UC22["Approve Retailer Registration"]
        UC23["View Retailer Analytics"]
        UC24["View Revenue Dashboard"]
        UC25["Manage Users"]
    end

    %% ── Customer Connections ──
    Customer --> UC1
    Customer --> UC2
    Customer --> UC3
    Customer --> UC4
    Customer --> UC5
    Customer --> UC6
    Customer --> UC7
    Customer --> UC8
    Customer --> UC9
    Customer --> UC10
    Customer --> UC11

    %% ── Retailer Connections ──
    Retailer --> UC12
    Retailer --> UC13
    Retailer --> UC14
    Retailer --> UC15
    Retailer --> UC16
    Retailer --> UC17

    %% ── Admin Connections ──
    Admin --> UC18
    Admin --> UC19
    Admin --> UC20
    Admin --> UC21
    Admin --> UC22
    Admin --> UC23
    Admin --> UC24
    Admin --> UC25

    %% ── External System ──
    UC9 --> PG
```

---

## Use Case Descriptions

### Customer Use Cases

| # | Use Case | Description | Pre-condition | Post-condition |
|---|---|---|---|---|
| UC1 | Register / Login | Customer creates an account or logs in | None | Customer is authenticated |
| UC2 | Browse Product Catalogue | View all available air coolers | None | Product list displayed |
| UC3 | Search & Filter Products | Search by name; filter by type, price, rating | None | Filtered results shown |
| UC4 | View Product Details | See images, specs, price, reviews for a product | None | Product detail page rendered |
| UC5 | Manage Cart | Add, update quantity, or remove items from cart | Logged in | Cart updated |
| UC6 | Manage Wishlist | Save products for later | Logged in | Wishlist updated |
| UC7 | Apply Retailer Coupon | Enter a retailer's coupon code at checkout for a discount | Cart has items | Discount applied; coupon linked to retailer |
| UC8 | Checkout & Place Order | Provide address, review order, confirm purchase | Cart has items; logged in | Order created |
| UC9 | Make Payment | Pay via UPI / card / net banking through payment gateway | Order placed | Payment confirmed |
| UC10 | Track Order Status | View current status of placed orders | Order exists | Status displayed |
| UC11 | Write Product Review | Rate and review a purchased product | Order delivered | Review saved |

### Retailer Use Cases

| # | Use Case | Description | Pre-condition | Post-condition |
|---|---|---|---|---|
| UC12 | Register as Retailer | Submit registration request with business details | None | Request sent to admin |
| UC13 | Login | Authenticate into retailer dashboard | Approved by admin | Dashboard accessible |
| UC14 | View / Share Coupon Code | Access unique coupon code and share with customers | Logged in | Coupon displayed |
| UC15 | View Sales Dashboard | See all orders placed using retailer's coupon | Logged in | Sales data displayed |
| UC16 | View Earnings & Payouts | Track commission earned and payout history | Logged in | Earnings data displayed |
| UC17 | Update Profile / Bank Details | Modify contact info and payout details | Logged in | Profile updated |

### Admin Use Cases

| # | Use Case | Description | Pre-condition | Post-condition |
|---|---|---|---|---|
| UC18 | Login | Authenticate into admin panel | Has admin credentials | Admin panel accessible |
| UC19 | Manage Products (CRUD) | Create, read, update, delete products in catalogue | Logged in | Catalogue updated |
| UC20 | View All Orders | See complete order list with filters | Logged in | Order list displayed |
| UC21 | Update Order / Delivery Status | Change status to shipped / out-for-delivery / delivered | Order exists | Status updated; customer notified |
| UC22 | Approve Retailer Registration | Review and approve / reject retailer applications | Pending request exists | Retailer account activated or rejected |
| UC23 | View Retailer Analytics | See per-retailer sales count, revenue, and commission | Logged in | Analytics displayed |
| UC24 | View Revenue Dashboard | Overall sales, revenue trends, top products | Logged in | Dashboard rendered |
| UC25 | Manage Users | View / deactivate customer and retailer accounts | Logged in | User list managed |

---

## Include & Extend Relationships

```mermaid
graph TD
    UC8["Checkout & Place Order"] -->|"<<include>>"| UC9["Make Payment"]
    UC8 -->|"<<extend>>"| UC7["Apply Retailer Coupon"]
    UC9 -->|"<<include>>"| PG["Payment Gateway Integration"]
    UC12["Register as Retailer"] -->|"<<include>>"| UC22["Admin Approval"]
    UC21["Update Order Status"] -->|"<<extend>>"| NOTIFY["Send Notification to Customer"]
```

> **`<<include>>`** — The base use case always triggers the included use case.
> **`<<extend>>`** — The extending use case is optional and triggered only under certain conditions (e.g., coupon application is optional at checkout).
