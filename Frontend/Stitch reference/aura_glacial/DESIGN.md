# Design System Specification: Editorial Luxury & Thermal Precision

## 1. Overview & Creative North Star

### Creative North Star: "Atmospheric Precision"
This design system is built to move beyond functional utility into the realm of high-end digital curation. Inspired by the meticulous layouts of luxury skincare and the technical elegance of premium climate control, our "Atmospheric Precision" philosophy treats the interface not as a series of containers, but as a composition of light, air, and depth.

We achieve a "signature" look by breaking the traditional boxy grid. We use intentional asymmetry—allowing product photography to bleed across grid lines—and high-contrast typography scales that feel more like a fashion editorial than a dashboard. The goal is a digital experience that feels as cooling and premium as the products themselves.

---

## 2. Colors & Tonal Architecture

Our palette is rooted in the purity of ice and the clarity of high-end industrial design. 

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Traditional lines create visual clutter that breaks the premium "airflow" feel. 
- Boundaries must be defined strictly through background color shifts.
- Use `surface-container-low` (#f3f3f3) sections against a `background` (#f9f9f9) to denote a change in context.

### Surface Hierarchy & Nesting
Think of the UI as physical layers of frosted glass. We use "Tonal Nesting" to create depth:
- **Base Level:** `surface` (#f9f9f9) – The canvas.
- **Mid Level:** `surface-container` (#eeeeee) – For secondary content areas.
- **Top Level:** `surface-container-lowest` (#ffffff) – Reserved for the most important interactive cards to create a natural, "lit from within" lift.

### Signature Textures: The Gradient & The Glass
To represent airflow and thermal technology:
- **CTAs:** Use a subtle vertical gradient from `primary` (#0058bd) to `primary-container` (#1470e8). This provides a "liquid" depth that flat buttons lack.
- **Overlays:** Utilize **Glassmorphism** for navigation bars and floating modals. Use `surface` colors at 70% opacity with a `20px` backdrop-blur. This ensures the UI feels integrated with the product imagery behind it.

---

## 3. Typography: Editorial Authority

We use **Inter** as our typographic backbone, leaning heavily on extreme scale contrasts to establish an editorial hierarchy.

| Role | Token | Size / Weight | Intent |
| :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | 3.5rem / Bold | Product hero names; should feel architectural. |
| **Headline** | `headline-lg` | 2.0rem / Semi-Bold | Section headers; used with generous top padding. |
| **Title** | `title-md` | 1.125rem / Medium | Card titles and primary navigation. |
| **Body** | `body-md` | 0.875rem / Light | Technical specs and descriptions. |
| **Label** | `label-sm` | 0.6875rem / Bold | Uppercase "Eyebrow" text for categorization. |

**Styling Note:** Body text should always use `on-surface-variant` (#414754) to reduce harshness, while Headlines must use `on-background` (#1a1c1c) for maximum authority.

---

## 4. Elevation & Depth: Tonal Layering

Shadows in this system are never grey; they are "ambient."

### The Layering Principle
Do not rely on shadows for hierarchy. Instead, stack your surface tokens. A `surface-container-lowest` (#ffffff) card placed on a `surface-container-high` (#e8e8e8) section creates an immediate sense of elevation through contrast alone.

### Ambient Shadows
When a floating effect is required (e.g., a primary product modal):
- **Blur:** 40px to 60px.
- **Opacity:** 4% - 6%.
- **Color:** Use a tinted version of `on-surface`.
- **Instruction:** Shadows should feel like a soft glow rather than a dark drop.

### The "Ghost Border" Fallback
If a border is required for accessibility in input fields, use the `outline-variant` (#c2c6d6) at **15% opacity**. This creates a "Ghost Border" that guides the eye without interrupting the visual flow.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary-container`), white text, `xl` (0.75rem) corner radius. 
- **Secondary:** `surface-container-highest` background with `on-surface` text. No border.
- **Tertiary:** Text-only with a `primary` color highlight on hover.

### Cards & Lists
- **The Rule:** No dividers. Separate list items using `16px` of vertical white space or alternating subtle background shifts between `surface` and `surface-container-low`.
- **Product Cards:** Use `surface-container-lowest` (#ffffff) with a 4% ambient shadow and `xl` roundedness.

### Inputs
- **State:** Default state should be a `surface-container` fill with no border. On focus, transition to a `surface-container-lowest` fill with a `primary` Ghost Border (20% opacity).

### Specialized: The "Airflow" Chip
- Used for technical features (e.g., "Silent Mode", "Eco-Cool").
- **Style:** Semi-transparent `primary-fixed` (#d8e2ff) background with `on-primary-fixed` (#001a41) text. Use `full` roundedness for a pill shape.

---

## 6. Do’s and Don’ts

### Do:
- **Do** use "Negative Space" as a functional element. Give headlines room to breathe—often 80px to 120px of top margin.
- **Do** use "Bleed Layouts." Let high-quality cooler imagery break out of the container to create an immersive, high-end feel.
- **Do** use `on-surface-variant` for long-form body text to ensure a "soft" reading experience.

### Don’t:
- **Don’t** use pure black (#000000) for text. Use our `on-background` (#1a1c1c) to maintain a premium, ink-like feel.
- **Don’t** use traditional dividers or lines. If you feel the need for a line, increase your whitespace instead.
- **Don’t** use "Pop" animations. All transitions should be `cubic-bezier(0.2, 0, 0, 1)` (the "Apple" ease-out) to mimic the smooth start-up of a high-end machine.
- **Don’t** crowd the interface. If a screen feels busy, remove a component rather than shrinking it.