# FINALIZED WEBSITE CHANGES — RAJ HANSH EVENTS

## IMPORTANT: NO STRUCTURAL OR FOUNDATIONAL CHANGES

These are the **finalized changes only**.

Do **NOT** redesign, restructure, rebuild, migrate, or replace the existing website architecture.

Do **NOT** make foundational changes to the existing frontend, backend, CMS, database architecture, authentication, routing, deployment setup, or existing components unless strictly required to implement the finalized changes below.

Preserve all existing functionality that is not explicitly mentioned here.

---

# 1. EVENT / PORTFOLIO GALLERY — UPGRADE EXISTING SYSTEM

The existing event/portfolio system currently supports:

- One event/portfolio card
- Title
- Story/description
- One image
- Clicking the image opens an enlarged image

### Change ONLY the click behavior and data capability

When an existing event/portfolio card is clicked, instead of showing only one enlarged image, open the **luxury multi-image gallery modal based on the approved design reference**.

The existing event card design should remain unchanged unless a small interaction/hover adjustment is required.

## Gallery Modal Design

Use the previously approved generated design as the visual reference.

The modal should have:

- Large centered premium modal
- Ivory / cream background
- Deep maroon / burgundy accents
- Muted gold accents
- Elegant serif headings
- Clean modern sans-serif body text
- Rounded corners
- Subtle shadow
- Darkened/blurred background behind the modal
- Large featured event image
- Thumbnail gallery
- Previous / next navigation
- Image counter
- Close button

### Desktop layout

Use the approved two-column concept:

**Left side**
- `OUR EVENTS`
- Event title
- Editable event story/description
- Short event/service highlights if already supported by the existing design
- `Book a Consultation` CTA if already present in the approved design

**Right side**
- Large event image
- Previous/next controls
- Image counter such as `1 / 8`
- Thumbnail images below the main image

### Interaction

- Clicking a thumbnail changes the large image.
- Previous/next buttons navigate through the event gallery.
- Counter updates dynamically.
- `Esc` closes the modal.
- Left/right keyboard arrows navigate images where appropriate.
- Close button returns to the existing page.
- Mobile layout must remain responsive and usable.

---

# 2. KEEP EXISTING EVENT DATA STRUCTURE WHERE POSSIBLE

Do NOT replace the existing event system.

Keep the existing:

- Title
- Story/description
- Image

The existing image becomes the **cover/featured image** and can also be treated as the first gallery image.

Only add the minimum additional data capability needed to associate multiple gallery images with an existing event.

Each event should support:

- At least 5–8 images
- More than 8 images when required
- No artificial hard maximum

Example:

```text
Wedding → 8 images
Birthday → 6 images
Ceremony → 10 images
Corporate → 15 images
```

The frontend must dynamically determine the image count.

---

# 3. CMS — MINIMAL EXTENSION ONLY

Extend the EXISTING CMS rather than replacing it.

Existing fields remain:

```text
Title
Story / Description
Image
```

Add only the required gallery capability:

```text
Gallery Images
```

The CMS should allow an administrator to:

- Add gallery images
- Remove gallery images
- Replace gallery images
- Reorder gallery images
- Edit the event title
- Edit the event story/description
- Keep/change the existing cover image

The existing image field remains valid and becomes the event's cover/featured image.

### Important

Changing the following in the CMS must automatically update the website:

- Event title
- Story
- Cover image
- Gallery images
- Gallery image order

No frontend code changes should be necessary.

---

# 4. NEON DATABASE — MINIMAL REQUIRED EXTENSION

Do NOT redesign or migrate the existing Neon database.

First preserve the current schema and relationships.

Only add the minimum structure required for multiple images per existing event.

Conceptually:

```text
EXISTING EVENTS
- id
- title
- story
- image
- existing fields...
```

Add/extend with a gallery-image relationship such as:

```text
EVENT_IMAGES
- id
- event_id
- storage_path
- image_url
- caption (if supported/needed)
- alt_text (if supported/needed)
- display_order
- created_at
```

The exact implementation must follow the existing Neon schema and naming conventions.

Do NOT rename or delete existing columns unnecessarily.

Do NOT break existing event records.

Existing events with only one image must continue working.

---

# 5. DATA STORAGE / BUCKETS — MINIMAL REQUIRED EXTENSION

Update the existing storage bucket setup only as necessary to support multiple images per event.

Do NOT replace the existing storage system.

The storage structure should support multiple images associated with an event.

Conceptually:

```text
events/
  wedding/
    cover.webp
    01.webp
    02.webp
    03.webp
    04.webp
    05.webp
    06.webp
    07.webp
    08.webp
```

The exact bucket/path structure must follow the existing storage configuration.

The database should reference the stored images.

Do NOT hardcode image filenames or image counts into the frontend.

---

# 6. NO HARDCODED EVENT GALLERY DATA

Do NOT implement galleries like:

```text
Wedding = [
  "wedding1.jpg",
  "wedding2.jpg"
]
```

Do NOT create event-specific frontend conditionals.

The existing CMS/database must remain the source of truth.

The frontend should dynamically receive:

```text
event
├── title
├── story
├── cover image
└── gallery images[]
```

---

# 7. BACKWARD COMPATIBILITY

Existing event data must continue to work.

If an existing event has:

```text
Title
Story
One Image
```

it should still render correctly.

The single existing image should become the cover/first gallery image.

Additional images can then be added through the CMS.

Do NOT require existing event records to be manually recreated.

---

# 8. WHATSAPP NUMBER

Update the WhatsApp contact number everywhere the existing website currently uses the old WhatsApp number.

### New WhatsApp number

```text
9905002293
```

Update:

- WhatsApp buttons
- Contact CTAs
- Floating WhatsApp button
- Event/contact sections
- Any CMS-managed WhatsApp contact value

Use the new number consistently.

Do not create duplicate contact values.

---

# 9. FOOTER REMOVALS

Remove the following footer items completely:

```text
VIP Event Inspiration
```

and

```text
Email → Join
```

Remove their:

- Visible text
- Links
- Buttons
- Click handlers
- Associated unused UI where applicable

Do not remove unrelated footer content.

---

# 10. LOCATION UPDATE

Update the website's existing location information to:

**Maa Aamdmai Nagar, Kathitand, Ratu, Ranchi, Jharkhand 835222**

Coordinates:

```text
23.415005906250528, 85.22761731833728
```

Use these exact coordinates wherever the existing map/location functionality requires coordinates.

Update the existing location data rather than creating duplicate location records.

---

# 11. DO NOT CHANGE

Unless required specifically by the finalized requirements above, do NOT change:

- Overall website structure
- Existing page structure
- Existing routing
- Existing navigation
- Existing authentication
- Existing CMS architecture
- Existing database architecture
- Existing storage provider
- Existing deployment configuration
- Existing event card design
- Existing unrelated components
- Existing styling system
- Existing APIs
- Existing data unrelated to these changes

Do not perform a broad refactor.

Do not introduce a new framework.

Do not replace the existing CMS.

Do not replace Neon.

Do not replace the existing storage provider/bucket system.

---

# 12. FINAL IMPLEMENTATION PRINCIPLE

This is an **incremental upgrade**, not a rebuild.

The intended change is:

```text
BEFORE

Event Card
    ↓
One Image
    ↓
Enlarged Image
```

becomes:

```text
AFTER

Event Card
    ↓
Luxury Gallery Modal
    ↓
Title + Story
    ↓
Large Image
    ↓
5–8+ Gallery Images
    ↓
Thumbnails + Navigation + Counter
```

while keeping the existing website foundation intact.

The final visual result for the gallery modal should follow the **previously approved generated design reference**.

All event/gallery content must remain CMS/database driven.

All other existing functionality should remain untouched.
