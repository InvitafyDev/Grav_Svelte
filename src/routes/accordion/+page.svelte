<script lang="ts">
    import { Grav_Accordion, Exito_Alert } from "$lib/index.js";
    import type { AccordionItemI } from "$lib/index.js";

    // Example usage of Grav_Accordion:
    // Generic accordion checklist — expandable items with status badge,
    // "done" check toggle and lazy content via the default slot (let:item).
    const NOMBRES = [
        "Portada",
        "Itinerario",
        "Mesa de regalos",
        "Galería",
        "Hospedaje",
        "Dress code",
        "Padrinos",
        "Confirmación",
        "Ubicaciones",
        "Música",
        "Despedida",
        "Extras",
    ];
    let items: AccordionItemI[] = NOMBRES.map((title, i) => ({
        id: i + 1,
        title,
        subtitle: i % 2 === 0 ? "Descripción de la sección" : "",
        badgeText: i % 3 === 0 ? "Completada" : i % 3 === 1 ? "Pendiente" : "No requerida",
        badgeType: i % 3 === 0 ? "success" : i % 3 === 1 ? "warning" : "neutral",
        checked: i % 3 === 0,
        checkable: i % 3 !== 2,
    }));

    // onCheck: the consumer owns the state — toggle and reassign to update the UI.
    function handleCheck(item: AccordionItemI) {
        items = items.map((i) =>
            i.id === item.id ? { ...i, checked: !i.checked } : i,
        );
        Exito_Alert("Check actualizado");
    }

    // onExpand: fires on first expand too — ideal for lazy-loading content.
    function handleExpand(item: AccordionItemI) {
        console.log("expand", item.id);
    }
</script>

<div class="mx-auto max-w-2xl p-8">
    <h1 class="mb-6 text-2xl font-bold">Grav_Accordion</h1>
    <Grav_Accordion
        {items}
        showMinimap={true}
        minimapTitle="Secciones"
        onCheck={handleCheck}
        onExpand={handleExpand}
        let:item
    >
        <p style="min-height: 12rem;">
            Contenido de <strong>{item.title}</strong> (slot con let:item).
        </p>
    </Grav_Accordion>
</div>
