<script lang="ts">
    import {
        InputFormText,
        InputFormNumber,
        InputFormBool,
        InputFormColor,
        InputFormDate,
        InputFormDateAndHours,
        InputFormImage,
        InputFormSelect,
        InputFormTextArea,
        InputFormTextWithSlide,
        InputFormCascade,
    } from "$lib/Inputs/index.js";

    interface SelectValue {
        value: string;
        label: string;
    }

    let textInput = "";
    let numberInput: number | null = null;
    let boolInput = false;
    let colorInput = "#000000";
    let dateInput: string | null = null;
    let dateTimeInput: string | null = null;
    let imageInput: HTMLInputElement;
    let base64Preview = "";
    let selectInput: SelectValue | null = null;
    let textAreaInput = "";
    let textWithSlideInput = "";
    let cascadeInput: Record<string, string | null> = {};

    // Example data for cascade select
    const cascadeLevels = [
        {
            label: "Country",
            field: "country",
            fetchFn: async () => [
                { value: "1", label: "USA" },
                { value: "2", label: "Canada" },
                { value: "3", label: "Mexico" },
            ],
        },
        {
            label: "State",
            field: "state",
            fetchFn: async (countryId?: string) => {
                if (countryId === "1") {
                    return [
                        { value: "1", label: "California" },
                        { value: "2", label: "New York" },
                    ];
                }
                return [];
            },
        },
    ];

    // Example data for select
    const selectOptions = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
        { value: "3", label: "Option 3" },
    ];
</script>

<div class="max-w-4xl mx-auto p-8">
    <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">
        Grav Svelte
    </h1>
    <p class="text-xl text-gray-600 mb-12 text-center">
        A collection of reusable Svelte components for building modern web
        applications
    </p>

    <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <h3 class="text-lg font-medium text-gray-800 mb-2">
                    Form Inputs
                </h3>
                <p class="text-gray-600 mb-4">
                    A comprehensive set of form input components with consistent
                    styling and behavior:
                </p>
                <ul class="list-disc list-inside text-gray-600 space-y-2">
                    <li>Text inputs with various types</li>
                    <li>Date and time pickers</li>
                    <li>Color picker</li>
                    <li>Boolean toggle</li>
                    <li>Cascading selects</li>
                    <li>Image upload with preview</li>
                </ul>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm">
                <h3 class="text-lg font-medium text-gray-800 mb-2">Modals</h3>
                <p class="text-gray-600 mb-4">
                    Flexible modal components for various use cases:
                </p>
                <ul class="list-disc list-inside text-gray-600 space-y-2">
                    <li>Confirmation dialogs</li>
                    <li>Form modals</li>
                    <li>Custom content modals</li>
                    <li>Responsive design</li>
                </ul>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm">
                <h3 class="text-lg font-medium text-gray-800 mb-2">
                    CRUD Operations
                </h3>
                <p class="text-gray-600 mb-4">
                    Components for handling data operations:
                </p>
                <ul class="list-disc list-inside text-gray-600 space-y-2">
                    <li>Data tables</li>
                    <li>Create/Edit forms</li>
                    <li>Delete confirmations</li>
                    <li>Pagination</li>
                </ul>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm">
                <h3 class="text-lg font-medium text-gray-800 mb-2">Styling</h3>
                <p class="text-gray-600 mb-4">
                    Built with modern styling features:
                </p>
                <ul class="list-disc list-inside text-gray-600 space-y-2">
                    <li>Tailwind CSS integration</li>
                    <li>Consistent design system</li>
                    <li>Responsive layouts</li>
                    <li>Customizable themes</li>
                </ul>
            </div>
        </div>
    </section>

    <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">
            Getting Started
        </h2>
        <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-medium text-gray-800 mb-2">Installation</h3>
            <p class="text-gray-600 mb-4">
                First, install the needed dependencies:
            </p>
            <ul class="list-disc list-inside text-gray-600 space-y-1">
                <li>tailwindcss</li>
                <li>svelte-select</li>
                <li>xlsx</li>
                <li>Font Awesome</li>
            </ul>
            <p class="text-gray-600 my-4">Then install Grav Svelte:</p>
            <pre class="bg-gray-50 p-4 rounded-md overflow-x-auto mb-6">
npm install grav-svelte@0.0.12</pre>

            <h3 class="text-lg font-medium text-gray-800 mb-2">Usage</h3>
            <p class="text-gray-600 mb-4">
                Import and use components in your Svelte files:
            </p>
            <pre class="bg-gray-50 p-4 rounded-md overflow-x-auto mb-4">
import InputFormText from 'grav-svelte';

// In your component
&lt;InputFormText label="Name" bind:valueVar={name} /&gt;</pre>

            <h3 class="text-lg font-medium text-gray-800 mb-2">
                Component Documentation
            </h3>
            <div class="space-y-6">
                <div>
                    <h4 class="font-medium text-gray-800 mb-2">
                        Input Components
                    </h4>
                    <p class="text-gray-600 mb-2">Available input types:</p>
                    <ul class="list-disc list-inside text-gray-600 space-y-1">
                        <li>InputFormText - Text input with validation</li>
                        <li>InputFormNumber - Number input with min/max</li>
                        <li>InputFormBool - Toggle switch</li>
                        <li>InputFormColor - Color picker</li>
                        <li>InputFormDate - Date picker</li>
                        <li>InputFormDateAndHours - DateTime picker</li>
                        <li>InputFormImage - Image upload with preview</li>
                        <li>InputFormSelect - Dropdown select</li>
                        <li>InputFormTextArea - Multi-line text input</li>
                        <li>InputFormTextWithSlide - Text with slider</li>
                        <li>InputFormCascade - Cascading dropdowns</li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-medium text-gray-800 mb-2">
                        Modal Components
                    </h4>
                    <p class="text-gray-600 mb-2">Features:</p>
                    <ul class="list-disc list-inside text-gray-600 space-y-1">
                        <li>Customizable header and footer</li>
                        <li>Backdrop click to close</li>
                        <li>Keyboard navigation (Esc to close)</li>
                        <li>Responsive design</li>
                        <li>Animation support</li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-medium text-gray-800 mb-2">
                        CRUD Components
                    </h4>
                    <p class="text-gray-600 mb-2">Available components:</p>
                    <ul class="list-disc list-inside text-gray-600 space-y-1">
                        <li>DataTable - Sortable and filterable tables</li>
                        <li>FormBuilder - Dynamic form generation</li>
                        <li>Pagination - Page navigation</li>
                        <li>SearchInput - Search with debounce</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <section class="mb-12">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Documentation</h2>
        <div class="bg-white p-6 rounded-lg shadow-sm">
            <p class="text-gray-600 mb-4">
                Explore our components and their usage in the following
                sections:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                    href="/inputs"
                    class="block p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                    <h3 class="font-medium text-gray-800 mb-2">
                        Input Components
                    </h3>
                    <p class="text-sm text-gray-600">
                        View all available input components and their usage
                    </p>
                </a>
                <a
                    href="/modals"
                    class="block p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                    <h3 class="font-medium text-gray-800 mb-2">
                        Modal Components
                    </h3>
                    <p class="text-sm text-gray-600">
                        Explore different types of modal components
                    </p>
                </a>
                <a
                    href="/crud"
                    class="block p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                    <h3 class="font-medium text-gray-800 mb-2">
                        CRUD Components
                    </h3>
                    <p class="text-sm text-gray-600">
                        Learn about data management components
                    </p>
                </a>
            </div>
        </div>
    </section>
</div>
