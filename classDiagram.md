# Class Diagram — Siddham Coolers E-Commerce Platform

<div align="center">

### 📊 Rendered Diagram

<img src="Assets/ClassDiagram.svg" alt="Class Diagram — Siddham Coolers" width="800"/>

</div>

---

## Overview

The system follows a layered architecture: **Controller → Service → Repository (Model)**. The class diagram below captures the **domain model** — the core entities and their relationships.

---

## Class Diagram

```mermaid
classDiagram
    direction TB

    %% ───────────────── USER HIERARCHY ─────────────────
    class User {
        +String _id
        +String name
        +String email
        +String passwordHash
        +String phone
        +Enum role ["customer", "retailer", "admin"]
        +String avatar
        +Date createdAt
        +Date updatedAt
        +register()
        +login()
        +updateProfile()
        +resetPassword()
    }

    class Customer {
        +Address[] addresses
        +ObjectId[] wishlist
        +addAddress()
        +removeAddress()
        +addToWishlist()
        +removeFromWishlist()
    }

    class Retailer {
        +String businessName
        +String gstin
        +String bankAccount
        +String ifscCode
        +String upiId
        +Enum status ["pending", "approved", "rejected"]
        +ObjectId couponId
        +Date approvedAt
        +getCoupon()
        +getSalesDashboard()
        +getEarnings()
    }

    class Admin {
        +Boolean isSuperAdmin
        +manageProducts()
        +manageOrders()
        +approveRetailer()
        +viewAnalytics()
    }

    User <|-- Customer : inherits
    User <|-- Retailer : inherits
    User <|-- Admin : inherits

    %% ───────────────── ADDRESS ─────────────────
    class Address {
        +String _id
        +String fullName
        +String phone
        +String line1
        +String line2
        +String city
        +String state
        +String pincode
        +Boolean isDefault
    }

    Customer "1" --> "0..*" Address : has

    %% ───────────────── PRODUCT ─────────────────
    class Product {
        +String _id
        +String name
        +String description
        +String[] images
        +Number price
        +Number mrp
        +String category
        +Object specifications
        +Number stockQty
        +Number avgRating
        +Number reviewCount
        +Boolean isActive
        +Date createdAt
        +create()
        +update()
        +delete()
        +getDetails()
        +updateStock()
    }

    class Review {
        +String _id
        +ObjectId productId
        +ObjectId customerId
        +Number rating
        +String comment
        +Date createdAt
        +create()
        +delete()
    }

    Product "1" --> "0..*" Review : has
    Customer "1" --> "0..*" Review : writes

    %% ───────────────── CART ─────────────────
    class Cart {
        +String _id
        +ObjectId customerId
        +CartItem[] items
        +Number totalAmount
        +addItem()
        +removeItem()
        +updateQuantity()
        +clear()
        +calculateTotal()
    }

    class CartItem {
        +ObjectId productId
        +Number quantity
        +Number priceAtAdd
    }

    Customer "1" --> "1" Cart : has
    Cart "1" --> "1..*" CartItem : contains
    CartItem "0..*" --> "1" Product : references

    %% ───────────────── COUPON ─────────────────
    class Coupon {
        +String _id
        +String code
        +ObjectId retailerId
        +Number discountPercent
        +Number maxDiscountAmount
        +Number minOrderValue
        +Boolean isActive
        +Number usageCount
        +Date createdAt
        +validate()
        +apply()
        +deactivate()
    }

    Retailer "1" --> "1" Coupon : owns

    %% ───────────────── ORDER ─────────────────
    class Order {
        +String _id
        +ObjectId customerId
        +OrderItem[] items
        +Address shippingAddress
        +Number subtotal
        +Number discount
        +Number totalAmount
        +ObjectId couponId
        +ObjectId retailerId
        +Enum status ["pending_payment", "confirmed", "processing", "shipped", "delivered", "cancelled"]
        +String trackingId
        +ObjectId paymentId
        +Date createdAt
        +Date updatedAt
        +place()
        +updateStatus()
        +cancel()
        +getDetails()
    }

    class OrderItem {
        +ObjectId productId
        +String productName
        +Number quantity
        +Number priceAtPurchase
    }

    Customer "1" --> "0..*" Order : places
    Order "1" --> "1..*" OrderItem : contains
    OrderItem "0..*" --> "1" Product : references
    Order "0..*" --> "0..1" Coupon : uses

    %% ───────────────── PAYMENT ─────────────────
    class Payment {
        +String _id
        +ObjectId orderId
        +Number amount
        +Enum method ["upi", "card", "netbanking", "cod"]
        +Enum status ["pending", "success", "failed", "refunded"]
        +String gatewayTransactionId
        +Date paidAt
        +initiate()
        +verify()
        +refund()
    }

    Order "1" --> "1" Payment : has

    %% ───────────────── COMMISSION ─────────────────
    class Commission {
        +String _id
        +ObjectId retailerId
        +ObjectId orderId
        +Number orderAmount
        +Number commissionPercent
        +Number commissionAmount
        +Enum status ["pending", "paid"]
        +Date paidAt
        +Date createdAt
        +calculate()
        +markPaid()
    }

    Retailer "1" --> "0..*" Commission : earns
    Order "1" --> "0..1" Commission : generates
```

---

## Class Descriptions

### Core Entities

| Class | Responsibility |
|---|---|
| **User** | Base class for all users; stores common auth & profile data |
| **Customer** | Extends User; manages addresses, wishlist, and places orders |
| **Retailer** | Extends User; owns a coupon, tracks sales & commissions |
| **Admin** | Extends User; manages the entire platform |

### Product Domain

| Class | Responsibility |
|---|---|
| **Product** | Represents an air cooler in the catalogue |
| **Review** | Customer review & rating for a product |

### Order Domain

| Class | Responsibility |
|---|---|
| **Cart** | Temporary collection of items before checkout |
| **CartItem** | Individual item within a cart |
| **Order** | Confirmed purchase with delivery status tracking |
| **OrderItem** | Snapshot of product at time of purchase |
| **Payment** | Payment transaction linked to an order |

### Affiliate Domain

| Class | Responsibility |
|---|---|
| **Coupon** | Discount code owned by a retailer |
| **Commission** | Retailer's earnings record for a coupon-linked order |
| **Address** | Reusable shipping / billing address for a customer |

---

## Key Relationships Summary

| Relationship | Type | Description |
|---|---|---|
| User → Customer / Retailer / Admin | Inheritance | Role-specific specialisation |
| Customer → Cart | 1 : 1 | Each customer has one active cart |
| Customer → Order | 1 : Many | Customer can place many orders |
| Order → OrderItem | 1 : Many | Order contains multiple items |
| Order → Coupon | Many : 0..1 | Order may use one coupon |
| Order → Payment | 1 : 1 | Each order has exactly one payment |
| Retailer → Coupon | 1 : 1 | Each retailer has one unique coupon |
| Retailer → Commission | 1 : Many | Retailer earns commission on each coupon-linked order |
| Product → Review | 1 : Many | Product can have many reviews |
