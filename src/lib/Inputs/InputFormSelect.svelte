<script lang="ts">
  import "../typography.css";
  import Select from "svelte-select";
  import { onMount } from "svelte";

  interface SelectValue {
    value: any;
    label: string;
  }

  export let value: SelectValue | SelectValue[] | null = null;
  export let justValue: any | any[] | null = null;
  export let res: any[] = [];
  export let changeFunction: (
    e: CustomEvent<SelectValue | SelectValue[] | null>,
  ) => void = () => {};
  export let onClear: () => void = () => {};
  export let disabledVar = false;
  export let label = "";
  export let showPlusIcon = false;
  export let onPlusClick: () => void = () => {};
  export let multiple = false;
  export let placeholder: string | undefined = undefined;
  export let placeholderSingle: string = "Seleccione una opción";
  export let placeholderMultiple: string = "Seleccione opciones";

  let containerEl: HTMLDivElement;

  // justValue es entrada y salida. Antes iba con bind:justValue a svelte-select,
  // que lo recalcula desde `value`: sin `value`, al montar ponía el ID del padre
  // en null. Ahora el que cambió manda: un `value` nuevo da su justValue, y un
  // justValue que llega (o un `res` que llega después) busca su item en `res`.
  const valorDe = (v: SelectValue | SelectValue[] | null) =>
    v == null ? null : Array.isArray(v) ? v.map((i) => i.value) : v.value;

  const coincide = (v: SelectValue | SelectValue[] | null, jv: any) => {
    const actual = valorDe(v);
    if (Array.isArray(actual) || Array.isArray(jv)) {
      return (
        Array.isArray(actual) &&
        Array.isArray(jv) &&
        actual.length === jv.length &&
        actual.every((x, i) => x == jv[i])
      );
    }
    return actual == jv;
  };

  if (value != null) justValue = valorDe(value);
  let ultimoValue = value;
  let ultimoJust = justValue;

  function sincronizar(v: typeof value, jv: any, items: any[]) {
    if (v !== ultimoValue) {
      ultimoValue = v;
      justValue = ultimoJust = valorDe(v);
      return;
    }
    if (jv === ultimoJust && coincide(v, jv)) return;
    ultimoJust = jv;
    if (jv == null || (Array.isArray(jv) && jv.length === 0)) {
      value = ultimoValue = null;
      return;
    }
    const encontrado = Array.isArray(jv)
      ? jv.map((x) => items.find((i) => i.value == x)).filter(Boolean)
      : items.find((i) => i.value == jv);
    if (encontrado && (!Array.isArray(encontrado) || encontrado.length)) {
      value = ultimoValue = encontrado;
    }
  }

  $: sincronizar(value, justValue, res);

  onMount(() => {
    if (typeof window === "undefined") return;
    if ((window as any).__gravSelectCloseHookInstalled) return;
    (window as any).__gravSelectCloseHookInstalled = true;

    const cache = new WeakMap<
      HTMLElement,
      { rect: DOMRect; html: string; rafId: number }
    >();

    const trackList = (list: HTMLElement) => {
      const update = () => {
        cache.set(list, {
          rect: list.getBoundingClientRect(),
          html: list.outerHTML,
          rafId: requestAnimationFrame(update),
        });
      };
      update();
    };

    const animateOut = (list: HTMLElement) => {
      const cached = cache.get(list);
      if (!cached) return;
      cancelAnimationFrame(cached.rafId);
      const rect = cached.rect;
      if (!rect.width || !rect.height) return;

      const clone = list.cloneNode(true) as HTMLElement;
      clone.removeAttribute("class");
      clone.className = "grav-select-list-closing-clone";
      clone.style.position = "fixed";
      clone.style.left = `${rect.left}px`;
      clone.style.top = `${rect.top}px`;
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.pointerEvents = "none";
      clone.style.margin = "0";
      clone.style.zIndex = "9999";
      clone.style.transformOrigin = "top center";
      clone.style.animation =
        "grav-select-list-out 200ms cubic-bezier(0.22, 1, 0.36, 1) forwards";
      // copy svelte-select-list visual styles inline since we removed the class
      const cs = getComputedStyle(list);
      clone.style.backgroundColor = cs.backgroundColor;
      clone.style.color = cs.color;
      clone.style.borderRadius = cs.borderRadius;
      clone.style.boxShadow = cs.boxShadow;
      clone.style.overflow = cs.overflow;
      clone.style.padding = cs.padding;
      clone.style.fontFamily = cs.fontFamily;
      clone.style.fontSize = cs.fontSize;
      document.body.appendChild(clone);
      clone.addEventListener("animationend", () => clone.remove(), {
        once: true,
      });
      setTimeout(() => clone.remove(), 600);
    };

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of Array.from(m.addedNodes)) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.classList?.contains("svelte-select-list")) {
            trackList(node);
          } else {
            const inner = node.querySelector?.(".svelte-select-list") as
              | HTMLElement
              | null;
            if (inner) trackList(inner);
          }
        }
        for (const node of Array.from(m.removedNodes)) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.classList?.contains("svelte-select-list")) {
            animateOut(node);
          } else {
            const inner = node.querySelector?.(".svelte-select-list") as
              | HTMLElement
              | null;
            if (inner) animateOut(inner);
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  });
</script>

<div class="select-container">
  <p class="select-label">{label}</p>
  <div class="select-with-button">
    <Select
      items={res}
      name={label}
      bind:value
      on:change={changeFunction}
      on:clear={onClear}
      disabled={disabledVar}
      {multiple}
      class="select-input"
      inputStyles="font-size: 16px; color: currentColor !important; background-color: transparent;"
      containerStyles="font-size: 16px; background-color: var(--grav-input-bg, transparent); border: var(--grav-crud-input-border-width) solid var(--_grav-select-border, var(--grav-input-border-color, currentColor)); border-radius: var(--grav-select-radius, var(--grav-input-radius, 0.5rem)); box-shadow: var(--_grav-select-ring, none); min-height: var(--grav-select-min-height, var(--height, 42px)); transition: var(--grav-input-transition, all 0s);"
      placeholder={placeholder ?? (multiple ? placeholderMultiple : placeholderSingle)}
      --placeholder-color="currentColor"
      --chevron-color="currentColor"
      --item-color="black"
      --item-hover-bg=" lightgray"
      --item-is-active-bg="black"
      --padding="var(--grav-select-padding, 0 0 0 16px)"
      --list-border-radius="var(--grav-select-list-radius, 4px)"
      --list-border="var(--grav-select-list-border)"
      --list-shadow="var(--grav-select-list-shadow, 0 2px 3px 0 rgba(44, 62, 80, 0.24))"
      --list-z-index="9999"
      --list-max-height="320px"
      listAutoPlacement={true}
      floatingConfig={{ strategy: 'fixed' }}
      showChevron
    />
    {#if showPlusIcon}
      <button
        type="button"
        on:click={onPlusClick}
        class="plus-button"
        disabled={disabledVar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-plus"
          ><path d="M5 12h14"></path><path d="M12 5v14"></path></svg
        >
      </button>
    {/if}
  </div>
</div>

<style>
  .select-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 0.25rem;
    color: var(--grav-crud-color-neutral);
  }

  /* El borde del select va en línea (containerStyles) y ningún :hover lo pisa:
     aquí se cambia el valor de la variable que ese estilo lee. */
  .select-container :global(.svelte-select:hover) {
    --_grav-select-border: var(--grav-input-border-color-hover);
  }

  .select-container :global(.svelte-select.focused) {
    --_grav-select-border: var(--grav-input-border-color-focus);
    --_grav-select-ring: var(--grav-input-focus-ring);
  }

  .select-container :global(.svelte-select-list) {
    padding: var(--grav-select-list-padding, 0);
  }

  .select-label {
    font-size: var(--grav-select-label-font-size, 1rem);
    font-weight: var(--grav-select-label-font-weight, inherit);
    color: var(--grav-select-label-color, var(--grav-crud-color-neutral));
    margin-bottom: 0.25rem;
  }

  .select-with-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .plus-button {
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: var(--grav-select-plus-radius, var(--grav-border-radius-md));
    border: var(--grav-crud-input-border-width) solid
      var(--grav-select-plus-border-color, currentColor);
    background-color: transparent;
    color: var(--grav-crud-color-neutral);
    font-size: 1.5rem;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .plus-button:hover:not(:disabled) {
    background-color: var(--grav-crud-color-neutral);
    color: white;
  }

  .plus-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.svelte-select-list) {
    animation: grav-select-list-in 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
    transform-origin: top center;
  }

  @keyframes -global-grav-select-list-in {
    from {
      opacity: 0;
      transform: translateY(-6px) scaleY(0.96);
      filter: blur(2px);
    }
    to {
      opacity: 1;
      transform: translateY(0) scaleY(1);
      filter: blur(0);
    }
  }

  @keyframes -global-grav-select-list-out {
    from {
      opacity: 1;
      transform: translateY(0) scaleY(1);
      filter: blur(0);
    }
    to {
      opacity: 0;
      transform: translateY(-6px) scaleY(0.96);
      filter: blur(2px);
    }
  }

</style>
