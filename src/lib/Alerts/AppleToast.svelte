<script lang="ts">
  import { onMount } from "svelte";
  import { fly, fade } from "svelte/transition";
  import { expoOut, cubicOut } from "svelte/easing";

  export let title: string = "";
  export let message: string = "";
  export let icon: "success" | "error" | "info" | "warning" = "success";
  export let duration: number = 3500;
  export let onDestroy: () => void = () => {};

  let visible = false;
  let hovered = false;
  let timer: ReturnType<typeof setTimeout> | null = null;

  function close() {
    visible = false;
    setTimeout(() => onDestroy(), 250);
  }

  function startTimer() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      if (!hovered) close();
    }, duration);
  }

  onMount(() => {
    requestAnimationFrame(() => {
      visible = true;
    });
    startTimer();
    return () => {
      if (timer) clearTimeout(timer);
    };
  });

  function handleMouseEnter() {
    hovered = true;
    if (timer) clearTimeout(timer);
  }

  function handleMouseLeave() {
    hovered = false;
    startTimer();
  }
</script>

{#if visible}
  <div class="modern-toast-root">
    <div
      class="modern-toast-card"
      role="status"
      aria-live="polite"
      in:fly={{ y: 20, x: 0, duration: 350, easing: expoOut }}
      out:fade={{ duration: 200, easing: cubicOut }}
      on:mouseenter={handleMouseEnter}
      on:mouseleave={handleMouseLeave}
    >
      <div class="modern-toast-icon modern-toast-icon-{icon}">
        {#if icon === "success"}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M5 12.5l5 5 9-11"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        {:else if icon === "error"}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </svg>
        {:else if icon === "warning"}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              d="M12 8v5M12 16.5v.5"
              stroke-width="2.5"
              stroke-linecap="round"
            />
            <path
              d="M10.3 3.86l-8.07 14a2 2 0 001.73 3h16.14a2 2 0 001.73-3l-8.07-14a2 2 0 00-3.46 0z"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>
        {:else}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="9" stroke-width="2" />
            <path
              d="M12 11v5M12 7.5v.5"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </svg>
        {/if}
      </div>

      <div class="modern-toast-text">
        <div class="modern-toast-title">{title || message}</div>
        {#if title && message}
          <div class="modern-toast-description">{message}</div>
        {/if}
      </div>

      <button
        type="button"
        class="modern-toast-close"
        aria-label="Cerrar"
        on:click={close}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M6 6l12 12M18 6L6 18"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
  </div>
{/if}

<style>
  .modern-toast-root {
    position: fixed;
    bottom: 1.25rem;
    right: 1.25rem;
    z-index: 10000;
    display: flex;
    justify-content: flex-end;
    pointer-events: none;
    max-width: calc(100vw - 2.5rem);
    font-family:
      "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
      "Helvetica Neue", sans-serif;
  }

  .modern-toast-card {
    pointer-events: auto;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.875rem 0.875rem 0.875rem 1rem;
    background: #ffffff;
    border-radius: 12px;
    box-shadow:
      0 10px 25px -5px rgba(0, 0, 0, 0.12),
      0 4px 10px -3px rgba(0, 0, 0, 0.06),
      0 0 0 1px rgba(0, 0, 0, 0.05);
    min-width: 320px;
    max-width: 400px;
    will-change: transform, opacity;
  }

  .modern-toast-icon {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .modern-toast-icon svg {
    width: 100%;
    height: 100%;
  }

  .modern-toast-icon-success {
    color: #16a34a;
  }
  .modern-toast-icon-error {
    color: #dc2626;
  }
  .modern-toast-icon-warning {
    color: #d97706;
  }
  .modern-toast-icon-info {
    color: #2563eb;
  }

  .modern-toast-text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .modern-toast-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
    line-height: 1.4;
    letter-spacing: -0.005em;
  }

  .modern-toast-description {
    font-size: 0.8125rem;
    color: #64748b;
    line-height: 1.45;
  }

  .modern-toast-close {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 2px;
    color: #94a3b8;
    border-radius: 6px;
    transition: all 0.15s ease;
    flex-shrink: 0;
    margin-top: -2px;
    margin-right: -4px;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modern-toast-close svg {
    width: 14px;
    height: 14px;
  }

  .modern-toast-close:hover {
    color: #475569;
    background: #f1f5f9;
  }

  @media (max-width: 640px) {
    .modern-toast-root {
      left: 1rem;
      right: 1rem;
      bottom: 1rem;
      justify-content: stretch;
    }
    .modern-toast-card {
      min-width: 0;
      max-width: 100%;
      width: 100%;
    }
  }

  @media (prefers-color-scheme: dark) {
    .modern-toast-card {
      background: #18181b;
      box-shadow:
        0 10px 25px -5px rgba(0, 0, 0, 0.5),
        0 4px 10px -3px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.06);
    }
    .modern-toast-title {
      color: #fafafa;
    }
    .modern-toast-description {
      color: #a1a1aa;
    }
    .modern-toast-close {
      color: #71717a;
    }
    .modern-toast-close:hover {
      color: #d4d4d8;
      background: #27272a;
    }
    .modern-toast-icon-success {
      color: #4ade80;
    }
    .modern-toast-icon-error {
      color: #f87171;
    }
    .modern-toast-icon-warning {
      color: #fbbf24;
    }
    .modern-toast-icon-info {
      color: #60a5fa;
    }
  }
</style>
