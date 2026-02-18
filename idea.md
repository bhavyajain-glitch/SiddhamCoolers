# Siddham Coolers — E-Commerce Platform

## 1. Project Overview

**Siddham Coolers** is a manufacturer of air coolers that currently sells exclusively through a B2B (retailer) channel. This project aims to build a **full-stack e-commerce web application** that enables the company to sell directly to end customers (D2C) while simultaneously retaining and incentivising the existing retailer network through a **coupon-based affiliate system**.

The platform supports **three distinct user roles** — Customer, Retailer, and Admin — each with its own dashboard and set of capabilities.

---

## 2. Problem Statement

| Current State | Desired State |
|---|---|
| Sales only through physical retailers | Direct online sales to end customers |
| No visibility into retailer-driven demand | Full analytics on retailer performance |
| No online presence for the brand | Professional e-commerce storefront |
| Manual order & delivery tracking | Centralised order management dashboard |

---

## 3. Scope — Milestone 1

### 3.1 Customer Module
- **Browse & Search** — View product catalogue with filters (type, price, rating).
- **Product Detail** — Full product page with images, specifications, reviews.
- **Cart & Wishlist** — Add/remove products, persist across sessions.
- **Checkout** — Address entry, payment method selection.
- **Retailer Coupon (Optional)** — Apply a retailer's coupon code at checkout to receive a discount; the corresponding retailer earns a commission.
- **Order Tracking** — View order status and delivery updates.
- **Authentication** — Register / Login / Password reset.

### 3.2 Retailer Module
- **Retailer Registration & Login** — Separate registration flow (admin-approved).
- **Unique Coupon Code** — Each retailer gets a unique, shareable coupon code.
- **Sales Dashboard** — View all orders placed using the retailer's coupon.
- **Earnings Report** — Track total commission earned, pending payouts, and payout history.
- **Profile Management** — Update contact and bank/UPI details for payouts.

### 3.3 Admin Module
- **Order Management** — View all orders; filter by status (Pending / Shipped / Delivered / Cancelled).
- **Delivery Management** — Update shipment status and tracking info.
- **Retailer Analytics** — View each retailer's total sales, coupon usage count, and commission due.
- **Product Management** — CRUD operations on the product catalogue.
- **User Management** — Approve retailer registrations; manage customer/retailer accounts.
- **Dashboard & Reports** — Revenue, top-selling products, sales trends.

---

## 4. Key Features Summary

| # | Feature | Roles Involved |
|---|---|---|
| 1 | Product catalogue with search & filters | Customer |
| 2 | Shopping cart & wishlist | Customer |
| 3 | Checkout with optional retailer coupon | Customer, Retailer |
| 4 | Order placement & payment | Customer |
| 5 | Order tracking | Customer, Admin |
| 6 | Retailer coupon generation | Retailer, Admin |
| 7 | Retailer sales & earnings dashboard | Retailer |
| 8 | Admin order & delivery management | Admin |
| 9 | Admin retailer analytics | Admin |
| 10 | Role-based authentication & authorisation | All |

---

## 5. Proposed Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React.js (Vite) |
| Styling | Tailwind CSS / Vanilla CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcrypt |
| Payments | Razorpay / Stripe (integration-ready) |
| Hosting | Vercel (frontend) + Render / Railway (backend) |

> **Note:** The tech stack is a recommendation and can be finalised before development begins.

---

## 6. Target Users

1. **End Customers** — Individuals looking to purchase air coolers online.
2. **Retailers** — Existing distribution partners who want to earn commission by referring online sales.
3. **Business Admin** — Internal team managing orders, deliveries, and retailer relationships.

---

## 7. Expected Outcomes

- A live, production-ready e-commerce website for Siddham Coolers.
- A working retailer affiliate/coupon system that bridges online and offline sales channels.
- An admin dashboard providing real-time visibility into sales and retailer performance.
- Comprehensive documentation suitable for **end-semester project evaluation**.
