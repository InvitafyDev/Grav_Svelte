<script lang="ts">
  export let src: string;
  export let title: string = "Vista previa";
  export let sandbox: string =
    "allow-scripts allow-same-origin allow-popups allow-forms";
  /** Alto del mockup en desktop (p. ej. `90vh`, `90dvh`) */
  export let phoneHeight: string = "90vh";
  /** Ancho del mockup en desktop (p. ej. `auto`, `50vh`, `400px`). `auto` = aspect-ratio 10/19.5 */
  export let phoneWidth: string = "50vh";
  /** Alto del mockup en mobile (p. ej. `70svh`, `500px`) */
  export let mobileHeight: string = "90svh";
  /** Ancho del mockup en mobile (p. ej. `95vw`, `100%`) */
  export let mobileWidth: string = "90vw";
</script>

<!-- Desktop: solo el iframe, proporción tipo móvil, sin marco ni scroll del contenedor -->
<div class="phone-mockup-wrapper">
  <div
    class="phone-frame"
    class:auto-width={phoneWidth === "auto"}
    class:explicit-width={phoneWidth !== "auto"}
    style:--phone-mockup-h={phoneHeight}
    style:--phone-mockup-w={phoneWidth}
  >
    <div class="phone-notch"></div>
    <div class="phone-mockup-screen">
      <div class="phone-mockup-iframe-clip">
        <iframe {src} {title} {sandbox} loading="lazy" class="phone-mockup-iframe"
        ></iframe>
      </div>
    </div>
    <div class="phone-homebar"></div>
  </div>
</div>

<!-- Mobile: centrado en viewport -->
<div class="phone-mockup-mobile-outer">
  <div
    class="phone-frame mobile-frame"
    style:--mobile-h={mobileHeight}
    style:--mobile-w={mobileWidth}
  >
    <div class="phone-notch"></div>
    <div class="phone-mockup-mobile-screen">
      <div class="phone-mockup-iframe-clip">
        <iframe
          {src}
          {title}
          {sandbox}
          loading="lazy"
          class="phone-mockup-iframe-mobile"
        ></iframe>
      </div>
    </div>
    <div class="phone-homebar"></div>
  </div>
</div>

<style>
  /* ========== Wrapper ========== */
  .phone-mockup-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 100dvh;
    max-height: 100dvh;
    overflow: hidden;
    padding: 0;
    margin: 0;
  }

  /* ========== Phone frame ========== */
  .phone-frame {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border: 3px solid #1a1a1a;
    border-radius: 32px;
    background: #1a1a1a;
    padding: 6px 4px;
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.08) inset,
      0 8px 32px rgba(0, 0, 0, 0.25);
  }

  .phone-frame.auto-width {
    aspect-ratio: 10 / 20;
    width: min(100vw, calc(var(--phone-mockup-h) * 10 / 19.5));
    height: min(var(--phone-mockup-h), calc(100vw * 19.5 / 10));
    max-width: 100vw;
    max-height: var(--phone-mockup-h);
  }

  .phone-frame.explicit-width {
    width: var(--phone-mockup-w);
    height: var(--phone-mockup-h);
    max-width: 100vw;
  }

  /* Notch / dynamic island */
  .phone-notch {
    flex-shrink: 0;
    width: 80px;
    height: 6px;
    margin: 4px auto 4px;
    border-radius: 99px;
    background: #2a2a2a;
  }

  /* Screen area */
  .phone-mockup-screen {
    position: relative;
    flex: 1;
    min-height: 0;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
  }

  /* Home bar indicator */
  .phone-homebar {
    flex-shrink: 0;
    width: 60px;
    height: 4px;
    margin: 5px auto 3px;
    border-radius: 99px;
    background: #444;
  }

  /*
   * El documento embebido es otro origen: no se puede estilizar su scrollbar desde aquí.
   * Recortamos ~20px abajo-derecha (barra clásica en Windows); en overlay puede perderse un borde fino.
   */
  .phone-mockup-iframe-clip {
    position: absolute;
    inset: 0;
    overflow: hidden;
    /* No robar toques: en algunos navegadores el clip queda encima del iframe */
    pointer-events: none;
  }

  .phone-mockup-iframe,
  .phone-mockup-iframe-mobile {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% + 20px);
    height: calc(100% + 20px);
    margin-right: -20px;
    margin-bottom: -20px;
    border: none;
    display: block;
    pointer-events: auto;
  }

  /* ========== Mobile: viewport centrado, tarjeta ~70% alto ========== */
  /* svh = viewport “pequeño” estable: dvh cambia al tocar y el flex recentra el iframe a saltos */
  .phone-mockup-mobile-outer {
    display: none;
    box-sizing: border-box;
    width: 100%;
    height: 100svh;
    padding: 0.75rem;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .phone-frame.mobile-frame {
    width: var(--mobile-w, 95vw);
    max-width: calc(100vw - 1.5rem);
    height: var(--mobile-h, 70svh);
  }

  .phone-mockup-mobile-screen {
    position: relative;
    flex: 1;
    min-height: 0;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
  }

  @media (max-width: 768px) {
    .phone-mockup-wrapper {
      display: none;
    }
    .phone-mockup-mobile-outer {
      display: flex;
    }
  }
</style>
