---
name: Purity Circle Design System
version: 1.0.0
description: Design tokens and specifications for Purity Circle referral, restaurant tracking, and rewards management platform.
colors:
  primary: "#123C32"       # Deep Emerald
  secondary: "#1B6B50"     # Forest Green
  accent: "#D5AE62"        # Premium Gold
  background: "#F7F5EF"    # Warm Ivory
  card: "#FFFFFF"          # White
  textPrimary: "#202B27"   # Charcoal
  textSecondary: "#78847D" # Muted Grey
  success: "#21865A"       # Green
  warning: "#D99A32"       # Amber
  error: "#D9534F"         # Soft Red
  border: "#E2E9E3"        # Light Sage
typography:
  fontFamilySans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  fontFamilySerif: '"Playfair Display", Georgia, serif'
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  full: "9999px"
spacing:
  base: "4px"
---

# Purity Circle Design System Specification

## Overview
Purity Circle is an enterprise-grade referral, restaurant tracking, and rewards management platform connecting managers, restaurants, and the core Purity brand. The visual aesthetic reflects trust, premium rewards, and modern operational efficiency.

## Colors & Palette Application
- **Deep Emerald (`#123C32`)**: Used for the primary sidebar, brand headers, primary call-to-actions, and active navigation items.
- **Forest Green (`#1B6B50`)**: Secondary action buttons, interactive hover states, chart highlights, and supporting icons.
- **Premium Gold (`#D5AE62`)**: Accent highlights, financial milestones, referral bonus tags, premium reward catalogue badges, and achievement callouts.
- **Warm Ivory (`#F7F5EF`)**: The global page canvas background providing a soft, luxurious feel distinct from sterile white or cold greys.
- **Pure White (`#FFFFFF`)**: Content cards, data tables, modals, and input containers with subtle borders.
- **Charcoal (`#202B27`)**: Main readable typography with high contrast ratio.
- **Muted Grey (`#78847D`)**: Captions, timestamps, secondary metadata, and table column headers.
- **Light Sage (`#E2E9E3`)**: Borders, table row dividers, and input outlines.
- **Feedback Accents**: Success Green (`#21865A`), Warning Amber (`#D99A32`), and Error Soft Red (`#D9534F`).

## Typography
- Crisp, modern sans-serif typography (`Inter`, `system-ui`) for legibility in dense data tables and analytics dashboards.
- Clean hierarchy with tabular numerals for currency (₹) and metrics.

## Layout & Navigation
- **Sidebar**: Fixed Deep Emerald drawer on desktop, collapsible responsive drawer on mobile.
- **Header**: Top utility bar displaying role indicator, notification bell with unread badge, balance ticker, and user profile avatar.
- **Content Area**: Max-w-7xl centered container on Warm Ivory with consistent 24px/32px gutter spacing.

## Elevation & Depth
- Flat, subtle elevation with soft shadows (`0 2px 8px -2px rgba(18, 60, 50, 0.05)`) and Light Sage 1px borders rather than harsh drop shadows.

## Do's and Don'ts
- **DO** use the exact hex codes specified.
- **DO** use Premium Gold sparingly for high-value financial metrics (available rewards, ₹2,000 bonus).
- **DO** maintain identical typography and card styles between Manager and Admin views.
- **DON'T** introduce random blue, purple, cyan, or generic bootstrap colors.
- **DON'T** crowd tables without proper pagination, filtering, and responsive scrolling.
