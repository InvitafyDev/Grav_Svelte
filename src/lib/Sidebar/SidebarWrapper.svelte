<script lang="ts">
  import type { SidebarSection } from "./sidebarConfig.js";
  import SidebarItem from "./SidebarItem.svelte";
  import "./SidebarWrapper.css";
  import { Confirmacion_Alert } from "$lib/index.js";
  import { onMount } from "svelte";
  import { fly, slide } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  // Props
  export let sections: SidebarSection[];
  export let brandName: string;
  export let brandLink: string;
  export let baseRoute: string;
  export let showLogout: boolean = true;
  export let logoutLink: string = "/";
  export let customClass: string = "";
  export let storefullScreen: boolean;
  /** Callback opcional para logout. Si se pasa, se ejecuta en vez de navegar a logoutLink. */
  export let onLogout: (() => void) | undefined = undefined;

  /** Colores opcionales: si se pasan, sobrescriben las variables CSS del sidebar */
  export let themePrimary: string | undefined = undefined;
  export let themePrimary600: string | undefined = undefined;
  export let themeBg: string | undefined = undefined;
  export let themeText: string | undefined = undefined;
  export let themeBorder: string | undefined = undefined;
  /** Color del scrollbar (barra) y de la pista (fondo) */
  export let themeScrollbarThumb: string | undefined = undefined;
  export let themeScrollbarTrack: string | undefined = undefined;

  $: themeStyle = [
    themePrimary != null ? `--grav-sidebar-primary: ${themePrimary}` : "",
    themePrimary600 != null
      ? `--grav-sidebar-primary-600: ${themePrimary600}`
      : "",
    themeBg != null ? `--grav-sidebar-bg: ${themeBg}` : "",
    themeText != null ? `--grav-sidebar-text: ${themeText}` : "",
    themeBorder != null ? `--grav-sidebar-border: ${themeBorder}` : "",
    themeScrollbarThumb != null
      ? `--grav-sidebar-scrollbar-thumb: ${themeScrollbarThumb}`
      : "",
    themeScrollbarTrack != null
      ? `--grav-sidebar-scrollbar-track: ${themeScrollbarTrack}`
      : "",
  ]
    .filter(Boolean)
    .join("; ");

  // State: same pattern as Invitafy - string class for collapse (hidden vs overlay)
  let collapseShow = "hidden";

  onMount(() => {
    if (window.innerWidth >= 1024) collapseShow = "";
    const onResize = () => {
      if (window.innerWidth >= 1024) collapseShow = "";
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  function toggleCollapseShow(classes: string) {
    collapseShow = classes;
  }

  function handleLogout(event: MouseEvent) {
    event.preventDefault();
    Confirmacion_Alert(
      "Confirmar cierre de sesión",
      "¿Desea cerrar sesión?",
      () => {
        if (onLogout) {
          onLogout();
        } else {
          window.location.href = logoutLink;
        }
      },
    );
  }
</script>

{#if storefullScreen}
  <div
    class="sidebar-reopen-wrap"
    style={themeStyle || ""}
    in:fly={{ x: 30, duration: 300, delay: 200, easing: cubicOut }}
    out:fly={{ x: 30, duration: 200, easing: cubicOut }}
  >
    <button
      type="button"
      class="sidebar-reopen-btn"
      aria-label="Mostrar menú"
      on:click={() => (storefullScreen = false)}
    >
      <i
        class="fas fa-chevron-right"
        aria-hidden="true"
        data-fa-processed="true"
        data-fa-i2svg-processed="true"
      ></i>
    </button>
  </div>
{:else}
  <div class="sidebar-outer" style={themeStyle || ""}>
    <nav
      class="sidebar grav-sidebar-entrance {customClass}"
      style={themeStyle || ""}
      out:fly={{ x: -30, duration: 300, easing: cubicOut }}
    >
      <div class="sidebar-fullscreen-wrap">
        <button
          type="button"
          aria-label="Ocultar sidebar"
          class="sidebar-fullscreen-btn"
          on:click={() => (storefullScreen = true)}
        >
          <i
            class="fas fa-chevron-left"
            aria-hidden="true"
            data-fa-processed="true"
            data-fa-i2svg-processed="true"
          ></i>
        </button>
      </div>
      <div class="sidebar-inner">
        <button
          type="button"
          aria-label="Abrir menú"
          class="sidebar-toggler"
          on:click={() => toggleCollapseShow("sidebar-collapse-visible")}
        >
          <i
            class="fas fa-bars"
            aria-hidden="true"
            data-fa-processed="true"
            data-fa-i2svg-processed="true"
          ></i>
        </button>

        <a class="sidebar-brand" href={brandLink}>
          {brandName}
        </a>

        {#if collapseShow === "sidebar-collapse-visible"}
          <div
            class="sidebar-backdrop"
            role="button"
            tabindex="0"
            aria-label="Cerrar menú"
            on:click={() => toggleCollapseShow("hidden")}
            on:keydown={(e) => (e.key === "Enter" || e.key === " ") && toggleCollapseShow("hidden")}
          ></div>
        {/if}

        <div class="sidebar-menu {collapseShow}">
          <div class="sidebar-collapse-header">
            <a class="sidebar-collapse-brand" href={brandLink}>
              {brandName}
            </a>
            <button
              type="button"
              aria-label="Cerrar menú"
              class="sidebar-close-btn"
              on:click={() => toggleCollapseShow("hidden")}
            >
              <i
                class="fas fa-times"
                aria-hidden="true"
                data-fa-processed="true"
                data-fa-i2svg-processed="true"
              ></i>
            </button>
          </div>

          <ul class="sidebar-list">
            {#each sections as section}
              <li class="sidebar-section-item">
                {#if section.biActivado}
                  <button
                    type="button"
                    class="sidebar-section-btn"
                    on:click={() => (section.biActivado = !section.biActivado)}
                  >
                    <i
                      class="fas fa-caret-down sidebar-section-icon"
                      aria-hidden="true"
                      data-fa-processed="true"
                      data-fa-i2svg-processed="true"
                    ></i>
                    {section.nombre}
                  </button>
                {:else}
                  <button
                    type="button"
                    class="sidebar-section-btn"
                    on:click={() => (section.biActivado = !section.biActivado)}
                  >
                    <i
                      class="fas fa-caret-right sidebar-section-icon"
                      aria-hidden="true"
                      data-fa-processed="true"
                      data-fa-i2svg-processed="true"
                    ></i>
                    {section.nombre}
                  </button>
                {/if}
                {#if section.biActivado}
                  <ul
                    class="sidebar-sublist"
                    transition:slide={{ duration: 250, easing: cubicOut }}
                  >
                    {#each section.modules as _module}
                      <li class="sidebar-menu-item">
                        <SidebarItem
                          nombreModulo={_module.nombre}
                          nombreRuta={_module.ruta}
                          nombreIcono={_module.icono}
                          notifiacion={_module.notifiacion ?? null}
                          permiso={_module.permiso ?? true}
                          {baseRoute}
                          onLinkClick={() => toggleCollapseShow("hidden")}
                        />
                      </li>
                    {/each}
                  </ul>
                {/if}
              </li>
            {/each}

            {#if showLogout}
              <li class="sidebar-menu-item sidebar-logout-item">
                <a
                  class="sidebar-logout-link"
                  href={logoutLink}
                  on:click|preventDefault={handleLogout}
                >
                  Salir
                  <i
                    class="fas fa-sign-out-alt sidebar-logout-icon"
                    aria-hidden="true"
                    data-fa-processed="true"
                    data-fa-i2svg-processed="true"
                  ></i>
                </a>
              </li>
            {/if}
          </ul>
        </div>
      </div>
    </nav>
  </div>
{/if}
