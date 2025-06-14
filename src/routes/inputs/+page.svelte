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
        InputFormCascade,
        InputFormPassword,
    } from "$lib/Inputs/index.js";

    interface SelectValue {
        value: string;
        label: string;
    }

    let textInput = "";
    let textInputWithIcon = "";
    let numberInput: number | null = null;
    let boolInput = false;
    let colorInput = "#000000";
    let dateInput: string | null = null;
    let dateTimeInput: string | null = null;
    let imageInput: HTMLInputElement;
    let base64Preview = "";
    let selectInput: SelectValue | null = null;
    let textAreaInput = "";
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
                { value: "4", label: "Brazil" },
                { value: "5", label: "Australia" },
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
                        { value: "3", label: "Texas" },
                        { value: "4", label: "Florida" },
                        { value: "5", label: "Illinois" },
                    ];
                }
                if (countryId === "2") {
                    return [
                        { value: "1", label: "Ontario" },
                        { value: "2", label: "Quebec" },
                        { value: "3", label: "British Columbia" },
                        { value: "4", label: "Alberta" },
                    ];
                }
                if (countryId === "3") {
                    return [
                        { value: "1", label: "Mexico City" },
                        { value: "2", label: "Jalisco" },
                        { value: "3", label: "Nuevo León" },
                        { value: "4", label: "Baja California" },
                    ];
                }
                if (countryId === "4") {
                    return [
                        { value: "1", label: "São Paulo" },
                        { value: "2", label: "Rio de Janeiro" },
                        { value: "3", label: "Minas Gerais" },
                        { value: "4", label: "Bahia" },
                    ];
                }
                if (countryId === "5") {
                    return [
                        { value: "1", label: "New South Wales" },
                        { value: "2", label: "Victoria" },
                        { value: "3", label: "Queensland" },
                        { value: "4", label: "Western Australia" },
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

    // Code examples
    const codeExamples = {
        text: 'let textInput = "";\n\n<InputFormText \n    label="Text Input" \n    bind:valueVar={textInput} \n/>',
        number: 'let numberInput: number | null = null;\n\n<InputFormNumber \n    label="Number Input" \n    bind:valueVar={numberInput} \n/>',
        textWithSlide:
            'let textWithSlideInput = "";\n\n<InputFormTextWithSlide\n    label="Text with Slide"\n    bind:valueVar={textWithSlideInput}\n/>',
        textArea:
            'let textAreaInput = "";\n\n<InputFormTextArea\n    label="Text Area"\n    bind:valueVar={textAreaInput}\n    rows={4}\n/>',
        date: 'let dateInput: string | null = null;\n\n<InputFormDate \n    label="Date Input" \n    bind:valueVar={dateInput} \n/>',
        dateTime:
            'let dateTimeInput: string | null = null;\n\n<InputFormDateAndHours\n    label="Date and Time Input"\n    bind:valueVar={dateTimeInput}\n/>',
        color: 'let colorInput = "#000000";\n\n<InputFormColor \n    label="Color Input" \n    bind:valueVar={colorInput} \n/>',
        bool: 'let boolInput = false;\n\n<InputFormBool \n    label="Boolean Input" \n    bind:valueVar={boolInput} \n/>',
        select: 'interface SelectValue {\n    value: string;\n    label: string;\n}\n\nlet selectInput: SelectValue | null = null;\nconst selectOptions = [\n    { value: "1", label: "Option 1" },\n    { value: "2", label: "Option 2" },\n    { value: "3", label: "Option 3" },\n];\n\n<InputFormSelect\n    label="Select Input"\n    bind:value={selectInput}\n    res={selectOptions}\n/>',
        cascade:
            'let cascadeInput: Record<string, string | null> = {};\nconst cascadeLevels = [\n    {\n        label: "Country",\n        field: "country",\n        fetchFn: async () => [\n            { value: "1", label: "USA" },\n            { value: "2", label: "Canada" },\n        ],\n    },\n    {\n        label: "State",\n        field: "state",\n        fetchFn: async (countryId?: string) => {\n            if (countryId === "1") {\n                return [\n                    { value: "1", label: "California" },\n                    { value: "2", label: "New York" },\n                ];\n            }\n            return [];\n        },\n    },\n];\n\n<InputFormCascade\n    levels={cascadeLevels}\n    bind:selectedValues={cascadeInput}\n/>',
        image: 'let imageInput: HTMLInputElement;\nlet base64Preview = "";\n\n<InputFormImage \n    bind:inputFile={imageInput} \n    bind:base64Preview \n/>',
    };
</script>

<div class="max-w-4xl mx-auto p-8">
    <h1 class="text-3xl font-bold text-gray-800 mb-8 text-center">
        Input Components Examples
    </h1>

    <section class="mb-8 p-6 bg-white rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Text Inputs</h2>

        <div class="mb-6">
            <InputFormText label="Text Input" bind:valueVar={textInput} />
            <span class="block mt-1 text-sm text-gray-600"
                >Value: {textInput}</span
            >
            <div class="mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Code:</h4>
                <pre
                    class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm"><code
                        >{codeExamples.text}</code
                    ></pre>
            </div>
        </div>
        <div class="mb-6">
            <InputFormPassword
                label="Text Input with Icon and Password"
                icon="fas fa-user"
                bind:valueVar={textInputWithIcon}
                validation={false}
            />
            <span class="block mt-1 text-sm text-gray-600"
                >Value: {textInputWithIcon}</span
            >
            <div class="mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Code:</h4>
                <pre
                    class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm"><code
                        >{codeExamples.text}</code
                    ></pre>
            </div>
        </div>

        <div class="mb-6">
            <InputFormNumber label="Number Input" bind:valueVar={numberInput} />
            <span class="block mt-1 text-sm text-gray-600"
                >Value: {numberInput}</span
            >
            <div class="mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Code:</h4>
                <pre
                    class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm"><code
                        >{codeExamples.number}</code
                    ></pre>
            </div>
        </div>

        <div class="mb-6">
            <InputFormTextArea
                label="Text Area"
                bind:valueVar={textAreaInput}
                rows={2}
            />
            <span class="block mt-1 text-sm text-gray-600"
                >Value: {textAreaInput}</span
            >
            <div class="mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Code:</h4>
                <pre
                    class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm"><code
                        >{codeExamples.textArea}</code
                    ></pre>
            </div>
        </div>
    </section>

    <section class="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">
            Date and Time Inputs
        </h2>

        <div class="mb-6">
            <InputFormDate label="Date Input" bind:valueVar={dateInput} />
            <span class="block mt-1 text-sm text-gray-600"
                >Value: {dateInput}</span
            >
            <div class="mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Code:</h4>
                <pre
                    class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm"><code
                        >{codeExamples.date}</code
                    ></pre>
            </div>
        </div>

        <div class="mb-6">
            <InputFormDateAndHours
                label="Date and Time Input"
                bind:valueVar={dateTimeInput}
            />
            <span class="block mt-1 text-sm text-gray-600"
                >Value: {dateTimeInput}</span
            >
            <div class="mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Code:</h4>
                <pre
                    class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm"><code
                        >{codeExamples.dateTime}</code
                    ></pre>
            </div>
        </div>
    </section>

    <section class="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Special Inputs</h2>

        <div class="mb-6">
            <InputFormColor label="Color Input" bind:valueVar={colorInput} />
            <span class="block mt-1 text-sm text-gray-600"
                >Value: {colorInput}</span
            >
            <div class="mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Code:</h4>
                <pre
                    class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm"><code
                        >{codeExamples.color}</code
                    ></pre>
            </div>
        </div>

        <div class="mb-6">
            <InputFormBool label="Boolean Input" bind:valueVar={boolInput} />
            <span class="block mt-1 text-sm text-gray-600"
                >Value: {boolInput}</span
            >
            <div class="mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Code:</h4>
                <pre
                    class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm"><code
                        >{codeExamples.bool}</code
                    ></pre>
            </div>
        </div>
    </section>

    <section class="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Select Inputs</h2>

        <div class="mb-6">
            <InputFormSelect
                label="Select Input"
                bind:value={selectInput}
                res={selectOptions}
            />
            <span class="block mt-1 text-sm text-gray-600"
                >Selected: {selectInput?.label}</span
            >
            <div class="mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Code:</h4>
                <pre
                    class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm"><code
                        >{codeExamples.select}</code
                    ></pre>
            </div>
        </div>

        <div class="mb-6">
            <h3 class="text-lg font-medium text-gray-700 mb-2">
                Cascade Select
            </h3>
            <InputFormCascade
                levels={cascadeLevels}
                bind:selectedValues={cascadeInput}
            />
            <span class="block mt-1 text-sm text-gray-600"
                >Selected Values: {JSON.stringify(cascadeInput)}</span
            >
            <div class="mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Code:</h4>
                <pre
                    class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm"><code
                        >{codeExamples.cascade}</code
                    ></pre>
            </div>
        </div>
    </section>

    <section class="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Image Input</h2>

        <div class="mb-6">
            <InputFormImage bind:inputFile={imageInput} bind:base64Preview />
            <span class="block mt-1 text-sm text-gray-600">
                {#if base64Preview}
                    Image loaded successfully
                {:else}
                    No image selected
                {/if}
            </span>
            <div class="mt-4">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Code:</h4>
                <pre
                    class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm"><code
                        >{codeExamples.image}</code
                    ></pre>
            </div>
        </div>
    </section>
</div>
