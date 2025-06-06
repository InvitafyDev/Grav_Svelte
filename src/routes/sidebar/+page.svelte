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

<div class="h-screen">
    {#if storefullScreen == false}
        <SidebarWrapper
            {sections}
            brandName="My App"
            brandLink="/"
            bind:storefullScreen
            customClass="bg-black text-white"
        />
    {:else}
        <button
            aria-label="Toggle full screen"
            on:click={() => (storefullScreen = false)}
            class="text-xl border-2 h-8 w-8 rounded-full absolute top-3 left-3 z-[70] flex justify-center items-center border-black"
        >
            <i class="fas fa-caret-right"></i>
        </button>
    {/if}

    <div
        class="relative {storefullScreen == false
            ? 'md:ml-64'
            : ''}  bg-blueGray-100"
    >
        <div class=" md:px-10 mx-auto w-full sm:px-5">
            <main>
                <main class="flex-1 p-8 bg-gray-100">
                    <h1 class="text-2xl font-bold mb-4">Sidebar Example</h1>
                    <p class="text-gray-600">
                        This is an example of how to use the Sidebar component
                        in your application. The sidebar includes collapsible
                        sections with modules and notifications.
                    </p>

                    <div class="mt-8 bg-white p-6 rounded-lg shadow-sm">
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

                    <div class="mt-8 bg-white p-6 rounded-lg shadow-sm">
                        <h2 class="text-xl font-semibold mb-4">Content</h2>
                        <pre
                            class="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm"><code
                                >{`<div class="h-screen">
    {#if storefullScreen == false}
        <SidebarWrapper
            {sections}
            brandName="My App"
            brandLink="/"
            bind:storefullScreen
            customClass="bg-black text-white"
        />
    {:else}
        <button
            on:click={() => (storefullScreen = false)}
            class="text-xl border-2 h-8 w-8 rounded-full absolute top-3 left-3 z-[70] flex justify-center items-center border-black"
        >
            <i class="fas fa-caret-right" />
        </button>
    {/if}

    <div
        class="relative {storefullScreen == false
            ? 'md:ml-64'
            : ''}  bg-blueGray-100"
    >
        <div class=" md:px-10 mx-auto w-full sm:px-5">
            <main>
            </main>
        </div>
    </div>
</div>`}</code
                            ></pre>
                    </div>
                </main>
            </main>
        </div>
    </div>
</div>
