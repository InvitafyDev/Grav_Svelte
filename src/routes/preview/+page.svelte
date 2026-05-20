<script lang="ts">
  import { PhoneMockup } from "../../lib/Preview/index.js";

  let iframeUrl = "";
  let showPreview = false;

  function handleSubmit() {
    if (iframeUrl.trim()) {
      showPreview = true;
    }
  }
</script>

<div style="max-width: 800px; margin: 0 auto; padding: 2rem;">
  <h1 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem;">PhoneMockup Preview</h1>

  <div style="display: flex; gap: 0.5rem; margin-bottom: 2rem;">
    <input
      type="text"
      bind:value={iframeUrl}
      placeholder="Pega la URL de la invitación..."
      style="flex: 1; padding: 0.5rem 0.75rem; border: 1px solid #ccc; border-radius: 8px; font-size: 0.875rem;"
    />
    <button
      on:click={handleSubmit}
      style="padding: 0.5rem 1.25rem; background: #1a1a1a; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.875rem;"
    >
      Ver
    </button>
  </div>

  {#if showPreview}
    <PhoneMockup src={iframeUrl} />
  {/if}
</div>
