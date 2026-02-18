# Sequence Diagrams — Siddham Coolers E-Commerce Platform

<div align="center">

### 📊 Rendered Diagram

<img src="Assets/SequenceDiagram.png" alt="Sequence Diagram — Siddham Coolers" width="800"/>

</div>

---

## 1. Main Flow: Customer Browses, Applies Coupon & Places Order

This is the **primary end-to-end flow** of the application.

```mermaid
sequenceDiagram
    autonumber
    actor C as Customer
    participant FE as Frontend (React)
    participant BE as Backend (Express)
    participant DB as Database (MongoDB)
    participant PG as Payment Gateway

    %% ── Authentication ──
    C ->> FE: Opens website
    C ->> FE: Clicks "Register / Login"
    FE ->> BE: POST /api/auth/login {email, password}
    BE ->> DB: Find user by email
    DB -->> BE: User document
    BE ->> BE: Verify password (bcrypt)
    BE -->> FE: 200 OK + JWT token
    FE -->> C: Redirect to Home / Dashboard

    %% ── Browse & Add to Cart ──
    C ->> FE: Browses product catalogue
    FE ->> BE: GET /api/products?category=desert&sort=price
    BE ->> DB: Query products collection
    DB -->> BE: Product list
    BE -->> FE: 200 OK + products[]
    FE -->> C: Display product grid

    C ->> FE: Clicks on a product
    FE ->> BE: GET /api/products/:id
    BE ->> DB: Find product by ID
    DB -->> BE: Product details
    BE -->> FE: 200 OK + product
    FE -->> C: Show product detail page

    C ->> FE: Clicks "Add to Cart"
    FE ->> BE: POST /api/cart {productId, qty}
    BE ->> DB: Upsert cart item
    DB -->> BE: Updated cart
    BE -->> FE: 200 OK + cart
    FE -->> C: Cart badge updated

    %% ── Checkout ──
    C ->> FE: Clicks "Checkout"
    FE -->> C: Show checkout page (address, payment, coupon field)

    C ->> FE: Enters shipping address
    C ->> FE: Enters retailer coupon code (optional)
    FE ->> BE: POST /api/coupons/validate {code}
    BE ->> DB: Find coupon & linked retailer
    DB -->> BE: Coupon details (discount %, retailerId)
    BE -->> FE: 200 OK + {valid: true, discount: 10%}
    FE -->> C: "Coupon applied! You save ₹XXX"

    C ->> FE: Clicks "Place Order"
    FE ->> BE: POST /api/orders {cartItems, address, couponCode}
    BE ->> DB: Create order (status: "pending_payment")
    BE ->> DB: Link order to retailer (if coupon used)
    DB -->> BE: Order created
    BE -->> FE: 200 OK + {orderId, amount}

    %% ── Payment ──
    FE ->> PG: Initiate payment (orderId, amount)
    PG -->> C: Payment page (UPI / Card / Net Banking)
    C ->> PG: Completes payment
    PG -->> BE: Webhook: payment_success {orderId, transactionId}
    BE ->> DB: Update order status → "confirmed"
    BE ->> DB: Record transaction details
    BE ->> DB: Calculate & record retailer commission
    BE ->> DB: Clear customer's cart
    DB -->> BE: All updates saved
    BE -->> FE: 200 OK + {status: "confirmed"}
    FE -->> C: "Order placed successfully! 🎉"
```

---

## 2. Retailer Flow: View Sales & Earnings

```mermaid
sequenceDiagram
    autonumber
    actor R as Retailer
    participant FE as Frontend (React)
    participant BE as Backend (Express)
    participant DB as Database (MongoDB)

    %% ── Login ──
    R ->> FE: Opens retailer login page
    R ->> FE: Enters credentials
    FE ->> BE: POST /api/auth/login {email, password, role: "retailer"}
    BE ->> DB: Verify retailer credentials
    DB -->> BE: Retailer document
    BE -->> FE: 200 OK + JWT (role: retailer)
    FE -->> R: Redirect to Retailer Dashboard

    %% ── View Coupon ──
    R ->> FE: Views "My Coupon" section
    FE ->> BE: GET /api/retailers/me/coupon
    BE ->> DB: Fetch retailer's coupon
    DB -->> BE: Coupon {code: "RETAIL-AMIT-10", discount: 10%}
    BE -->> FE: 200 OK + coupon details
    FE -->> R: Display coupon code + share button

    %% ── View Sales Dashboard ──
    R ->> FE: Clicks "My Sales"
    FE ->> BE: GET /api/retailers/me/sales?month=2026-02
    BE ->> DB: Aggregate orders where couponRetailerId = retailerId
    DB -->> BE: Sales data (orders[], total revenue, commission)
    BE -->> FE: 200 OK + salesData
    FE -->> R: Display sales table + analytics charts

    %% ── View Earnings ──
    R ->> FE: Clicks "Earnings"
    FE ->> BE: GET /api/retailers/me/earnings
    BE ->> DB: Aggregate commissions (paid, pending)
    DB -->> BE: Earnings summary
    BE -->> FE: 200 OK + {totalEarned, pending, paid, history[]}
    FE -->> R: Display earnings breakdown + payout history
```

---

## 3. Admin Flow: Manage Orders & View Retailer Analytics

```mermaid
sequenceDiagram
    autonumber
    actor A as Admin
    participant FE as Frontend (React)
    participant BE as Backend (Express)
    participant DB as Database (MongoDB)

    %% ── Login ──
    A ->> FE: Opens admin login
    FE ->> BE: POST /api/auth/login {email, password, role: "admin"}
    BE ->> DB: Verify admin credentials
    DB -->> BE: Admin document
    BE -->> FE: 200 OK + JWT (role: admin)
    FE -->> A: Redirect to Admin Dashboard

    %% ── View Orders ──
    A ->> FE: Clicks "Orders"
    FE ->> BE: GET /api/admin/orders?status=confirmed&page=1
    BE ->> DB: Query orders with pagination & filters
    DB -->> BE: Orders list
    BE -->> FE: 200 OK + {orders[], totalPages}
    FE -->> A: Display order management table

    %% ── Update Delivery Status ──
    A ->> FE: Selects order → "Mark as Shipped"
    FE ->> BE: PATCH /api/admin/orders/:id {status: "shipped", trackingId: "XYZ123"}
    BE ->> DB: Update order status + tracking
    DB -->> BE: Order updated
    BE -->> FE: 200 OK
    FE -->> A: Order status updated in table

    %% ── View Retailer Analytics ──
    A ->> FE: Clicks "Retailer Analytics"
    FE ->> BE: GET /api/admin/retailers/analytics
    BE ->> DB: Aggregate per-retailer sales, coupon usage, commissions
    DB -->> BE: Analytics data[]
    BE -->> FE: 200 OK + retailerAnalytics[]
    FE -->> A: Display retailer performance table + charts

    %% ── Approve Retailer ──
    A ->> FE: Clicks "Pending Approvals"
    FE ->> BE: GET /api/admin/retailers?status=pending
    BE ->> DB: Query unapproved retailers
    DB -->> BE: Pending retailers[]
    BE -->> FE: 200 OK + retailers[]
    FE -->> A: Show approval list

    A ->> FE: Clicks "Approve" on a retailer
    FE ->> BE: PATCH /api/admin/retailers/:id {status: "approved"}
    BE ->> DB: Update retailer status
    BE ->> DB: Generate unique coupon for retailer
    DB -->> BE: Done
    BE -->> FE: 200 OK + {couponCode: "RETAIL-AMIT-10"}
    FE -->> A: Retailer approved ✓
```

---

## 4. Flow Summary

```mermaid
graph LR
    A["Customer registers<br/>& browses"] --> B["Adds to cart"]
    B --> C["Checkout +<br/>optional coupon"]
    C --> D["Payment via<br/>gateway"]
    D --> E["Order confirmed"]
    E --> F["Admin manages<br/>delivery"]
    E --> G["Retailer sees<br/>sale + commission"]
    F --> H["Customer tracks<br/>order"]
```
