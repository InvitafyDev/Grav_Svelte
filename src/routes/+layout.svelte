<script lang="ts">
    import { page } from '$app/stores';
    import "../app.css";
</script>

<div class="layout-container">
    <!-- Navigation -->
    <nav class="navbar">
        <div class="navbar-inner">
            <div class="navbar-main">
                <div class="brand-wrapper">
                    <a href="/" class="navbar-brand">
                            Grav Svelte
                        </a>
                </div>
                <div class="links-desktop">
                    <a
                        href="/inputs"
                        class="nav-link" class:active={$page.url.pathname === '/inputs'}
                    >
                        Inputs
                    </a>
                    <a
                        href="/modales"
                        class="nav-link" class:active={$page.url.pathname === '/modales'}
                    >
                        Modals
                    </a>
                    <a
                        href="/crud"
                        class="nav-link" class:active={$page.url.pathname === '/crud'}
                    >
                        CRUD
                    </a>
                </div>
            </div>
        </div>

        <!-- Mobile menu -->
        <div class="mobile-menu">
            <div>
                <a
                    href="/inputs"
                    class="mobile-link" class:active={$page.url.pathname === '/inputs'}
                >
                    Inputs
                </a>
                <a
                    href="/modales"
                    class="mobile-link" class:active={$page.url.pathname === '/modales'}
                >
                    Modals
                </a>
                <a
                    href="/crud"
                    class="mobile-link" class:active={$page.url.pathname === '/crud'}
                >
                    CRUD
                </a>
            </div>
        </div>
    </nav>

    <!-- Page content -->
    <main>
        <slot />
    </main>
</div> 