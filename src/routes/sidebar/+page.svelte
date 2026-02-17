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
</script>

<div class="min-h-screen">
    {#if storefullScreen == false}
        <SidebarWrapper
            {sections}
            brandName="Grav Svelte"
            brandLink="/"
            baseRoute="sidebar"
            bind:storefullScreen
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

// Store for full screen state
let storefullScreen = false;`}</code
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

    <div
        class="relative {storefullScreen == false ? 'lg:ml-60' : ''} bg-slate-100 min-h-screen"
    >
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
