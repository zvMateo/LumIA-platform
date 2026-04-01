# Design System Strategy: The Illuminated Scholar

## 1. Overview & Creative North Star
This design system is built upon the Creative North Star of **"The Illuminated Scholar."** 

In a world of generic, boxy SaaS platforms, this system rejects the "template" look in favor of high-end editorial digital experiences. It combines the clinical precision of high-performance tools like Linear with the expansive, airy layout of a premium academic journal. 

We achieve this through:
*   **Intentional Asymmetry:** Breaking the grid with overlapping elements and staggered card layouts to create a sense of forward motion.
*   **Atmospheric Depth:** Moving away from flat UI by using light-refractive surfaces and tinted shadows.
*   **High-Contrast Scale:** Pairing massive, authoritative headlines with spacious, highly legible body text to establish an immediate information hierarchy.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep Indigos and Violets, balanced by an expansive range of Slate Neutrals. 

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to define sections or containers. Modern luxury is defined by transitions in light, not structural lines. Use background color shifts (e.g., a `surface-container-low` card sitting on a `surface` background) to define boundaries.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-translucent materials. 
*   **Base Layer:** `surface` (#f9f9ff)
*   **Secondary Sectioning:** `surface-container-low` (#f0f3ff)
*   **Floating Components:** `surface-container-lowest` (#ffffff) for maximum lift.
*   **Nesting:** When placing an element inside a card, use a *lower* tier (darker/more recessed) like `surface-container-high` to create an "etched" look for input fields or code blocks.

### The Glass & Gradient Rule
To provide "soul" to the interface:
*   **Glassmorphism:** Navigation and floating panels must use a semi-transparent `surface` color with a `backdrop-blur` (20px-40px). 
*   **Signature Gradients:** Primary CTAs should not be flat. Use a subtle linear gradient from `primary` (#3525cd) to `primary-container` (#4f46e5) at a 135-degree angle.

---

## 3. Typography: Editorial Authority
The type system is a dialogue between the "Sharp" and the "Readable."

*   **Display & Headlines (Plus Jakarta Sans):** These are your "Editorial Voice." Set them to **Extrabold** with tight tracking (**-0.02em to -0.04em**). This creates a dense, authoritative "block" of text that feels premium.
*   **Body (Inter):** This is your "Functional Voice." Set with a **relaxed line-height (1.6 to 1.8)**. The goal is to maximize "breathability" during long reading sessions—essential for an EdTech context.
*   **Labels:** Use `label-md` in Inter Medium, all-caps with increased letter spacing (+0.05em) for small metadata to differentiate it from body copy.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often messy. We use **Tonal Layering** to convey importance.

*   **The Layering Principle:** Depth is achieved by stacking. A card shouldn't just have a shadow; it should be a lighter color (`surface-container-lowest`) than the section it sits on (`surface-container-low`).
*   **Ambient Shadows:** For high-floating elements (e.g., Modals), use the `shadow-xl` logic. The shadow must be extra-diffused (Blur: 40px-60px) and low opacity (4%-8%). Tint the shadow with the `primary` color (#3525cd) rather than using pure black to maintain a "luminous" feel.
*   **The Ghost Border Fallback:** If a border is required for accessibility in input fields, use the `outline-variant` token at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components

### Buttons
*   **Primary:** `rounded-full`, Primary-to-Secondary Gradient. Soft `shadow-xl` tinted with Indigo.
*   **Secondary:** `rounded-full`, `surface-container-highest` background with `on-surface` text. No border.
*   **Tertiary:** Ghost style. No background, `primary` text. Use for low-priority actions like "Cancel."

### The "Scholarly" Navbar
*   **Style:** Sticky position, `backdrop-blur-md`. 
*   **Composition:** Use a `surface` color at 80% opacity. A "Ghost Border" (10% opacity `outline-variant`) should only exist on the bottom edge.

### Cards & Content Lists
*   **Rule:** Forbid divider lines. 
*   **Separation:** Use `8` (2rem) or `10` (2.5rem) from the Spacing Scale to separate list items. Use a subtle background shift on hover (`surface-container-high`) to indicate interactivity.
*   **Shape:** Apply `2xl` (1rem - 1.5rem) rounding to all cards to maintain the "Soft Minimal" aesthetic.

### EdTech Specifics
*   **Progress Indicators:** Use the primary-to-secondary gradient for the fill. The track should be `surface-container-highest`.
*   **Lesson Accordions:** When expanded, the active item should utilize `surface-container-lowest` and a soft indigo ambient shadow to "lift" it off the list.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical padding. For example, give the top of a hero section more breathing room than the bottom to create an editorial "header" feel.
*   **Do** lean into white space. If you think there is enough space, add one more step on the Spacing Scale.
*   **Do** use `primary-fixed-dim` for subtle backgrounds in call-out boxes.

### Don't
*   **Don't** use 1px gray borders to separate content. Use tonal shifts.
*   **Don't** use pure black (#000000) for text. Always use `on-background` (#111c2d) to keep the contrast high but sophisticated.
*   **Don't** cram information. If a page feels heavy, break it into a card-based "stepper" or a layered accordion.
*   **Don't** use standard "Blue" for links. Use the `secondary` (#712ae2) for a more bespoke, EdTech-premium feel.