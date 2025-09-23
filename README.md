# Grav Svelte

A collection of reusable Svelte components for building modern web applications.

## Features

### Form Inputs
A comprehensive set of form input components with consistent styling and behavior:
- Text inputs with various types
- Date and time pickers
- Color picker
- Boolean toggle
- Cascading selects
- Image upload with preview

### Modals
Flexible modal components for various use cases:
- Confirmation dialogs
- Form modals
- Custom content modals
- Responsive design

### CRUD Operations
Components for handling data operations:
- Data tables
- Create/Edit forms
- Delete confirmations
- Pagination

### Styling
Built with modern styling features:
- Tailwind CSS integration
- Consistent design system
- Responsive layouts
- Customizable typography
- CSS custom properties support

## Installation

First, install the needed dependencies:
```bash
npm install tailwindcss svelte-select xlsx @fortawesome/fontawesome-free
```

Then install Grav Svelte:
```bash
npm install grav-svelte
```

## Usage

Import and use components in your Svelte files:

```svelte
import InputFormText from 'grav-svelte';

// In your component
<InputFormText label="Name" bind:valueVar={name} />
```

## Typography Customization

Customize fonts across all components using CSS custom properties. No need to pass props to individual components.

### Quick Setup

Add this to your `app.css` to customize typography:

```css
/* Import the typography system */
@import 'grav-svelte/typography.css';

/* Customize fonts */
:root {
  --grav-font-family: 'Roboto', sans-serif;
  --grav-font-family-heading: 'Montserrat', sans-serif;
  --grav-crud-title-font-size: 2rem;
  --grav-crud-title-font-weight: 800;

  /* Customize border radius globally */
  --grav-border-radius-md: 1rem;  /* Makes all buttons more rounded */
  --grav-crud-image-border-radius: 0.5rem;  /* Only affects images */

  /* Customize border width globally */
  --grav-border-width-normal: 2px;  /* Makes all borders thicker */
  --grav-crud-table-border-width: 1px;  /* Only table borders */

  /* Customize CRUD colors */
  --grav-crud-color-neutral: #1f2937;  /* Darker text */
  --grav-crud-color-light: #f3f4f6;    /* Lighter hover backgrounds */
  --grav-crud-color-border: #d1d5db;   /* Lighter borders */
  --grav-crud-color-selected: #dbeafe; /* Blue-tinted selection */
}
```

### Available CSS Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `--grav-font-family` | Base font family for all components | `'mundial', sans-serif` |
| `--grav-font-family-heading` | Font family for headings | `'mundial', sans-serif` |
| `--grav-crud-title-font-family` | Font family for CRUD titles | `var(--grav-font-family-heading)` |
| `--grav-crud-title-font-size` | Font size for CRUD titles | `1.5rem` |
| `--grav-crud-title-font-weight` | Font weight for CRUD titles | `700` |
| `--grav-crud-header-font-family` | Font family for table headers | `var(--grav-font-family)` |
| `--grav-crud-header-font-size` | Font size for table headers | `0.875rem` |
| `--grav-crud-header-font-weight` | Font weight for table headers | `600` |
| `--grav-crud-cell-font-family` | Font family for table cells | `var(--grav-font-family)` |
| `--grav-crud-cell-font-size` | Font size for table cells | `0.875rem` |
| `--grav-crud-cell-font-weight` | Font weight for table cells | `400` |
| `--grav-crud-button-font-family` | Font family for buttons | `var(--grav-font-family)` |
| `--grav-crud-button-font-size` | Font size for buttons | `0.875rem` |
| `--grav-crud-button-font-weight` | Font weight for buttons | `500` |

#### Border Radius Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `--grav-border-radius-xs` | Extra small border radius | `0.125rem` |
| `--grav-border-radius-sm` | Small border radius | `0.25rem` |
| `--grav-border-radius-md` | Medium border radius | `0.5rem` |
| `--grav-border-radius-lg` | Large border radius | `0.75rem` |
| `--grav-border-radius-xl` | Extra large border radius | `1rem` |
| `--grav-crud-button-border-radius` | Border radius for CRUD buttons | `var(--grav-border-radius-md)` |
| `--grav-crud-image-border-radius` | Border radius for CRUD images | `var(--grav-border-radius-sm)` |
| `--grav-crud-filter-border-radius` | Border radius for filters | `var(--grav-border-radius-md)` |
| `--grav-crud-tooltip-border-radius` | Border radius for tooltips | `var(--grav-border-radius-sm)` |

#### Border Width Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `--grav-border-width-thin` | Thin border width | `1px` |
| `--grav-border-width-normal` | Normal border width | `1.5px` |
| `--grav-border-width-thick` | Thick border width | `2px` |
| `--grav-border-width-extra` | Extra thick border width | `3px` |
| `--grav-crud-button-border-width` | Border width for CRUD buttons | `var(--grav-border-width-normal)` |
| `--grav-crud-table-border-width` | Border width for table elements | `var(--grav-border-width-normal)` |
| `--grav-crud-filter-border-width` | Border width for filters | `var(--grav-border-width-normal)` |
| `--grav-crud-cell-border-width` | Border width for table cells | `var(--grav-border-width-normal)` |

#### CRUD Color Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `--grav-crud-color-neutral` | Text color for headers and cells | `#4a4a4a` |
| `--grav-crud-color-light` | Background color for hover states | `#f5f5f5` |
| `--grav-crud-color-border` | Border color for table elements | `#e0e0e0` |
| `--grav-crud-color-selected` | Background color for selected rows | `#e8e8e8` |
| `--grav-crud-color-drag` | Background color for drag states | `#f9fafb` |
| `--grav-crud-color-icon` | Color for icons and secondary elements | `#9ca3af` |
| `--grav-crud-color-icon-hover` | Color for icons on hover | `#6b7280` |
| `--grav-crud-color-icon-active` | Color for icons in active state | `#4b5563` |

### Common Font Examples

#### Google Fonts
```css
/* In your HTML head */
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;600;700;800&display=swap" rel="stylesheet">

/* In your CSS */
:root {
  --grav-font-family: 'Inter', sans-serif;
  --grav-font-family-heading: 'Poppins', sans-serif;
}
```

#### Adobe Fonts (Typekit)
```css
/* In your HTML head */
<link rel="stylesheet" href="https://use.typekit.net/gjf4hoq.css">

/* In your CSS */
:root {
  --grav-font-family: 'mundial', sans-serif;
  --grav-font-family-heading: 'highest-praise', sans-serif;
}
```

#### System Fonts
```css
:root {
  --grav-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --grav-font-family-heading: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

## Component Documentation

### Input Components
Available input types:
- `InputFormText` - Text input with validation
- `InputFormNumber` - Number input with min/max
- `InputFormBool` - Toggle switch
- `InputFormColor` - Color picker
- `InputFormDate` - Date picker
- `InputFormDateAndHours` - DateTime picker
- `InputFormImage` - Image upload with preview
- `InputFormSelect` - Dropdown select
- `InputFormTextArea` - Multi-line text input
- `InputFormTextWithSlide` - Text with slider
- `InputFormCascade` - Cascading dropdowns

### Modal Components
Features:
- Customizable header and footer
- Backdrop click to close
- Keyboard navigation (Esc to close)
- Responsive design
- Animation support

### CRUD Components
Available components:
- `DataTable` - Sortable and filterable tables
- `FormBuilder` - Dynamic form generation
- `Pagination` - Page navigation
- `SearchInput` - Search with debounce
- Image columns with URL support in data tables

## Documentation

Explore our components and their usage in the following sections:
- [Input Components](/inputs) - View all available input components and their usage
- [Modal Components](/modals) - Explore different types of modal components
- [CRUD Components](/crud) - Learn about data management components

## Components

### Button

A versatile button component with multiple variants and sizes. The button toggles between primary (blue) and danger (red) variants when clicked.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'outline' \| 'danger' | 'primary' | The visual style of the button |
| size | 'small' \| 'medium' \| 'large' | 'medium' | The size of the button |
| disabled | boolean | false | Whether the button is disabled |
| type | 'button' \| 'submit' \| 'reset' | 'button' | The HTML button type |
| class_name | string | '' | Additional CSS classes |

#### Examples

```svelte
<!-- Primary button (toggles to danger on click) -->
<Button variant="primary">Primary Button</Button>

<!-- Secondary button -->
<Button variant="secondary">Secondary Button</Button>

<!-- Outline button -->
<Button variant="outline">Outline Button</Button>

<!-- Different sizes -->
<Button size="small">Small Button</Button>
<Button size="medium">Medium Button</Button>
<Button size="large">Large Button</Button>

<!-- Disabled state -->
<Button disabled>Disabled Button</Button>

<!-- With custom click handler -->
<Button on:click={() => alert('Clicked!')}>Click me</Button>
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build the package
npm run build

# Run type checking
npm run check
```

## License

MIT
