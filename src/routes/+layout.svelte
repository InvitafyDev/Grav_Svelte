<script lang="ts">
    import { page } from "$app/stores";
    import { ModalContainer } from "$lib/index.js";
    import { slide } from "svelte/transition";
    import "../app.css";

    let mobileMenuOpen = false;

    function toggleMobileMenu() {
        mobileMenuOpen = !mobileMenuOpen;
    }
</script>

<div class="min-h-screen bg-gray-100">
    <!-- Navigation -->
    <nav class="bg-white sm:relative absolute top-0 left-0 right-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <div class="flex-shrink-0 flex items-center">
                        <a
                            href="/"
                            class="text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
                        >
                            Grav Svelte
                        </a>
                    </div>
                    <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                        <a
                            href="/inputs"
                            class="{$page.url.pathname === '/inputs'
                                ? 'border-blue-500 text-gray-900'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        >
                            Inputs
                        </a>
                        <a
                            href="/forms"
                            class="{$page.url.pathname === '/forms'
                                ? 'border-blue-500 text-gray-900'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        >
                            Forms
                        </a>
                        <a
                            href="/modales"
                            class="{$page.url.pathname === '/modales'
                                ? 'border-blue-500 text-gray-900'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        >
                            Modals
                        </a>
                        <a
                            href="/crud"
                            class="{$page.url.pathname === '/crud'
                                ? 'border-blue-500 text-gray-900'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        >
                            CRUD
                        </a>
                        <a
                            href="/sidebar"
                            class="{$page.url.pathname === '/sidebar'
                                ? 'border-blue-500 text-gray-900'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        >
                            Sidebar
                        </a>
                        <a
                            href="/alertas"
                            class="{$page.url.pathname === '/alertas'
                                ? 'border-blue-500 text-gray-900'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                        >
                            Alerts
                        </a>
                    </div>
                </div>
                <!-- Mobile menu button -->
                <div class="sm:hidden flex items-center">
                    <button
                        on:click={toggleMobileMenu}
                        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        aria-expanded={mobileMenuOpen}
                    >
                        <span class="sr-only">Abrir menú principal</span>
                        {#if !mobileMenuOpen}
                            <!-- Hamburger icon -->
                            <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        {:else}
                            <!-- Close icon -->
                            <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        {/if}
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile menu -->
        {#if mobileMenuOpen}
            <div class="sm:hidden" transition:slide={{ duration: 300 }}>
                <div class="pt-2 pb-3 space-y-1">
                <a
                    href="/inputs"
                    class="{$page.url.pathname === '/inputs'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                >
                    Inputs
                </a>
                <a
                    href="/forms"
                    class="{$page.url.pathname === '/forms'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                >
                    Forms
                </a>
                <a
                    href="/modales"
                    class="{$page.url.pathname === '/modales'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                >
                    Modals
                </a>
                <a
                    href="/crud"
                    class="{$page.url.pathname === '/crud'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                >
                    CRUD
                </a>
                <a
                    href="/sidebar"
                    class="{$page.url.pathname === '/sidebar'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                >
                    Sidebar
                </a>
                <a
                    href="/alertas"
                    class="{$page.url.pathname === '/alertas'
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'} block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                >
                    Alerts
                </a>
                </div>
            </div>
        {/if}
    </nav>

    <!-- Page content -->
    <main class="sm:pt-0 pt-16">
        <ModalContainer />
        <slot />
    </main>
</div>
