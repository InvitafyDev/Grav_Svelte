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
- Customizable themes

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
