<script lang="ts">
    import SidebarWrapper from "$lib/Sidebar/SidebarWrapper.svelte";
    import type { SidebarSection } from "$lib/Sidebar/sidebarConfig.js";

    // Example sidebar sections
    const sections: SidebarSection[] = [
        {
            nombre: "Dashboard",
            biActivado: true,
            modules: [
                {
                    nombre: "Overview",
                    ruta: "dashboard/overview",
                    icono: "fas fa-chart-line",
                    notifiacion: null,
                },
                {
                    nombre: "Analytics",
                    ruta: "dashboard/analytics",
                    icono: "fas fa-chart-bar",
                    notifiacion: 5,
                },
            ],
        },
        {
            nombre: "Management",
            biActivado: false,
            modules: [
                {
                    nombre: "Users",
                    ruta: "management/users",
                    icono: "fas fa-users",
                    notifiacion: null,
                },
                {
                    nombre: "Settings",
                    ruta: "management/settings",
                    icono: "fas fa-cog",
                    notifiacion: 2,
                },
                {
                    nombre: "Settings",
                    ruta: "management/settings",
                    icono: "fas fa-cog",
                    notifiacion: 2,
                    permiso: false,
                },
            ],
        },
    ];

    // Store for full screen state
    let storefullScreen = false;

    type ThemeId = "default" | "dark" | "green";
    let themeId: ThemeId = "default";

    const themes: Record<
        ThemeId,
        { primary?: string; primary600?: string; bg?: string; text?: string; border?: string }
    > = {
        default: {},
        dark: {
            primary: "#818cf8",
            primary600: "#6366f1",
            bg: "#1e293b",
            text: "#e2e8f0",
            border: "#334155",
        },
        green: {
            primary: "#22c55e",
            primary600: "#16a34a",
            bg: "#f0fdf4",
            text: "#166534",
            border: "#bbf7d0",
        },
    };

    $: theme = themes[themeId];
</script>

<div class="min-h-screen">
    {#if storefullScreen == false}
        <SidebarWrapper
            {sections}
            brandName="Grav Svelte"
            brandLink="/"
            baseRoute="sidebar"
            bind:storefullScreen
            themePrimary={theme.primary}
            themePrimary600={theme.primary600}
            themeBg={theme.bg}
            themeText={theme.text}
            themeBorder={theme.border}
        />
    {:else}
        <div class="fixed left-0 bottom-4 z-[60]">
            <button
                type="button"
                aria-label="Mostrar menú"
                on:click={() => (storefullScreen = false)}
                class="h-16 w-8 rounded-r-lg flex justify-center items-center bg-blue-600 text-white shadow-lg hover:w-9 transition-all duration-200 border-0"
            >
                <i class="fas fa-chevron-right" aria-hidden="true"></i>
            </button>
        </div>
    {/if}

    <div
        class="relative {storefullScreen == false
            ? 'lg:ml-60'
            : ''} bg-slate-100 min-h-screen"
    >
        <div class="md:px-10 mx-auto w-full sm:px-5">
            <main class="flex-1 p-8 bg-slate-100">
                    <h1 class="text-2xl font-bold mb-4">Ejemplo de Sidebar</h1>
                    <div class="mb-6 flex flex-wrap items-center gap-3">
                        <span class="text-sm font-medium text-gray-700">Tema / colores:</span>
                        <button
                            type="button"
                            class="px-3 py-1.5 rounded text-sm font-medium {themeId === 'default'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
                            on:click={() => (themeId = 'default')}
                        >Default</button>
                        <button
                            type="button"
                            class="px-3 py-1.5 rounded text-sm font-medium {themeId === 'dark'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
                            on:click={() => (themeId = 'dark')}
                        >Oscuro</button>
                        <button
                            type="button"
                            class="px-3 py-1.5 rounded text-sm font-medium {themeId === 'green'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}"
                            on:click={() => (themeId = 'green')}
                        >Verde</button>
                    </div>
                    <p class="text-gray-600">
                        This is an example of how to use the Sidebar component
                        in your application. The sidebar includes collapsible
                        sections with modules and notifications.
                    </p>

                    <div class="mt-8 bg-white p-6 rounded-lg ">
                        <h2 class="text-xl font-semibold mb-4">Script</h2>
                        <pre
                            class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm"><code
                                >{`// Example sidebar sections
const sections: SidebarSection[] = [
    {
        nombre: "Dashboard",
        biActivado: true,
        modules: [
            {
                nombre: "Overview",
                ruta: "dashboard/overview",
                icono: "fas fa-chart-line",
                notifiacion: null,
            },
            {
                nombre: "Analytics",
                ruta: "dashboard/analytics",
                icono: "fas fa-chart-bar",
                notifiacion: 5,
            },
        ],
    },
    {
        nombre: "Management",
        biActivado: false,
        modules: [
            {
                nombre: "Users",
                ruta: "management/users",
                icono: "fas fa-users",
                notifiacion: null,
            },
            {
                nombre: "Settings",
                ruta: "management/settings",
                icono: "fas fa-cog",
                notifiacion: 2,
            },
            {
                nombre: "Settings",
                ruta: "management/settings",
                icono: "fas fa-cog",
                notifiacion: 2,
                permiso: false,
            },
        ],
    },
];

let storefullScreen = false;

// Optional: themes to change sidebar colors
type ThemeId = "default" | "dark" | "green";
let themeId: ThemeId = "default";
const themes: Record<ThemeId, { primary?: string; primary600?: string; bg?: string; text?: string; border?: string }> = {
    default: {},
    dark: { primary: "#818cf8", primary600: "#6366f1", bg: "#1e293b", text: "#e2e8f0", border: "#334155" },
    green: { primary: "#22c55e", primary600: "#16a34a", bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
};
$: theme = themes[themeId];`}</code
                            ></pre>
                    </div>

                    <div class="mt-8 bg-white p-6 rounded-lg ">
                        <h2 class="text-xl font-semibold mb-4">Content</h2>
                        <pre
                            class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm"><code
                                >{`<div class="min-h-screen">
    {#if storefullScreen == false}
        <SidebarWrapper
            {sections}
            brandName="Grav Svelte"
            brandLink="/"
            baseRoute="sidebar"
            bind:storefullScreen
            themePrimary={theme.primary}
            themePrimary600={theme.primary600}
            themeBg={theme.bg}
            themeText={theme.text}
            themeBorder={theme.border}
        />
    {:else}
        <div class="fixed left-0 bottom-4 z-[60]">
            <button
                type="button"
                aria-label="Mostrar menú"
                on:click={() => (storefullScreen = false)}
                class="h-16 w-8 rounded-r-lg flex justify-center items-center bg-blue-600 text-white shadow-lg hover:w-9 transition-all duration-200"
            >
                <i class="fas fa-chevron-right" />
            </button>
        </div>
    {/if}

    <div class="relative {storefullScreen == false ? 'lg:ml-60' : ''} bg-slate-100 min-h-screen">
        <div class="md:px-10 mx-auto w-full sm:px-5">
            <main class="flex-1 p-8">
                <!-- Contenido principal -->
            </main>
        </div>
    </div>
</div>`}</code
                            ></pre>
                    </div>
            </main>
        </div>
    </div>
</div>
