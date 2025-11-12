# TechScout Design Guidelines

## Design Approach

**Hybrid System**: Combining Linear's clean, modern tool aesthetic with Material Design's robust data presentation patterns, while drawing UX inspiration from PCPartPicker's proven PC building workflows.

**Rationale**: TechScout is information-dense and utility-focused, requiring clear data hierarchy and efficient workflows. The tech-savvy audience expects modern, professional interfaces that prioritize function without sacrificing visual appeal.

**Key Design Principles**:
- Data clarity above visual flourish
- Scannable information architecture
- Clear affordances for complex interactions
- Consistent component behavior across all tools

---

## Typography

**Font Stack**: 
- Primary: Inter (via Google Fonts) - Clean, readable, excellent at small sizes
- Monospace: JetBrains Mono - For specs, prices, technical data

**Hierarchy**:
- Page Headers: text-4xl to text-5xl, font-semibold
- Section Headers: text-2xl to text-3xl, font-semibold
- Card Titles/Product Names: text-lg, font-medium
- Body Text: text-base, font-normal
- Labels/Meta: text-sm, font-medium
- Technical Specs: text-sm, font-mono
- Small Print: text-xs

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Tight spacing (gaps, inline elements): 2, 4
- Component padding: 4, 6, 8
- Section spacing: 12, 16, 24
- Page margins: 8, 12, 16

**Grid Patterns**:
- Product grids: 1/2/3/4 columns (responsive)
- Comparison tables: Fixed 3-column max
- PC Builder: 2-column (component selector + build summary)
- Dashboard: Flexible grid with sidebar

**Container Strategy**:
- Marketing pages: max-w-7xl
- Tool interfaces: max-w-screen-2xl (wider for data)
- Content pages: max-w-4xl

---

## Component Library

### Navigation
- **Header**: Sticky top navigation with logo, main nav links, search bar, user profile icon
- **Breadcrumbs**: For deep navigation in Product Finder and Build Guide
- **Tabs**: For switching between views in PC Builder steps

### Data Display Components
- **Product Cards**: Image top, title, price, key specs (3-4 bullet points), rating stars, "Add to Compare" and "Add to Build" CTAs
- **Spec Tables**: Striped rows, clear labels on left, values on right, monospace for numbers
- **Comparison Matrix**: Fixed header, side-by-side columns, highlight differences with subtle background
- **Build Summary Panel**: Sticky sidebar showing selected components, running total, compatibility status, power estimate

### Interactive Components
- **Step Indicator**: Horizontal progress bar for PC Builder (CPU → GPU → RAM → etc.)
- **Filters Panel**: Collapsible sections with checkboxes, range sliders, search inputs
- **Compatibility Alerts**: Inline warning banners with icon, description, and suggestion
- **Price Calculator**: Real-time updating total with breakdown on hover

### Forms & Inputs
- **Search Bars**: Generous padding (py-3 px-4), clear icon placement, dropdown suggestions
- **Filter Controls**: Checkboxes with labels, range sliders with value display, dropdown selects
- **Text Inputs**: Standard forms with clear labels above inputs, helper text below

### Buttons & CTAs
- **Primary**: Solid fills for main actions (Add to Build, Save Build, Compare)
- **Secondary**: Outlined for alternative actions
- **Sizes**: Small (px-3 py-1.5), Medium (px-4 py-2), Large (px-6 py-3)

---

## Page-Specific Layouts

### Home Page
- **Hero Section**: Full-width with background image showing a premium PC build setup, centered headline "Build Your Perfect PC" with subheadline, primary CTA "Start Building" and secondary "Explore Products"
- **Featured Builds**: 3-column grid showcasing popular configurations with images, specs summary, price
- **Category Quick Links**: 4-column grid with icons for PC Builder, Product Finder, Comparison, Pre-Built PCs
- **Popular Products**: Horizontal scrolling carousel of product cards
- **Build Guide Teaser**: 2-column layout with image and description linking to tutorials
- **Footer**: Multi-column with Quick Links, Product Categories, Support, Newsletter signup, Social links

### Custom PC Builder
- **Layout**: Left panel (60%) for component selection, right panel (40%) sticky build summary
- **Component Selection**: Large category buttons with icons, expandable product list with filters
- **Product List View**: Compact cards in vertical list, key specs visible, radio button selection
- **Build Summary**: Component slots (empty states show "Select [Component]"), running compatibility check, price total, export/save options

### Product Finder
- **Layout**: Left sidebar (25%) filters, main content (75%) product grid
- **Filters**: Collapsible categories, clear all button, active filter tags above grid
- **Product Grid**: 3-4 columns responsive, consistent card heights, "Best Pick" badge for top rated
- **Sort Controls**: Dropdown above grid (Price, Rating, Newest, Popularity)

### Product Comparison
- **Layout**: Full-width table with fixed header, 3 columns for products
- **Product Headers**: Large image, name, price, rating, remove button
- **Comparison Rows**: Category sections (Performance, Connectivity, Physical Specs), highlight differences with subtle background
- **Add Product**: Empty column state with large "+" button to add product

### Pre-Built PCs
- **Layout**: Grid view with larger cards (2-3 columns)
- **Cards**: Hero image of complete build, configuration summary (CPU/GPU/RAM), use case badge (Gaming, Workstation, Budget), price, "View Details" CTA
- **Filters**: Top bar with use case pills, price range slider, brand checkboxes

---

## Images

**Hero Image**: Yes - Full-width hero on Home page showing a clean, modern PC build with RGB lighting in a premium setup. Professional photography style, tech aesthetic.

**Product Images**: All product cards include component photos on clean white/light backgrounds. Minimum 800x800px resolution.

**Build Showcase Images**: Featured builds section uses actual PC build photography, showing complete systems.

**Build Guide**: Step-by-step tutorial images showing installation processes, close-up component shots.

**Category Icons**: Use Heroicons for navigation and category representations (CPU, GPU, etc.).

---

## Special Considerations

**Compatibility System**: Green checkmark icons for compatible components, yellow warning triangles for cautions, red X for incompatible. Display inline with component selections.

**Mobile Optimization**: PC Builder switches to vertical stack on mobile, build summary becomes expandable bottom sheet. Product grids collapse to single column. Comparison table becomes horizontally scrollable cards.

**Data Density**: Embrace technical information - users expect detailed specs. Use tables, not cards, for specification heavy content. Monospace fonts for numbers improve scannability.

**Performance**: Lazy load product images, virtualize long product lists, cache build configurations in localStorage.

This design balances professional tool functionality with modern web aesthetics, prioritizing user efficiency in technical decision-making while maintaining visual appeal for broader audiences.