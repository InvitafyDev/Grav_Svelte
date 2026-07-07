<script lang="ts">
    import { Grav_Accordion, Exito_Alert } from "$lib/index.js";
    import type { AccordionItemI } from "$lib/index.js";

    // Example usage of Grav_Accordion:
    // Generic accordion checklist — expandable items with status badge,
    // "done" check toggle and lazy content via the default slot (let:item).
    let items: AccordionItemI[] = [
        {
            id: 1,
            title: "Portada",
            subtitle: "Foto principal y nombres",
            badgeText: "Completada",
            badgeType: "success",
            checked: true,
        },
        {
            id: 2,
            title: "Itinerario",
            subtitle: "Horarios del evento",
            badgeText: "Pendiente",
            badgeType: "warning",
            checked: false,
        },
        {
            id: 3,
            title: "Mesa de regalos",
            badgeText: "No requerida",
            badgeType: "neutral",
            checked: false,
            checkable: false,
        },
    ];

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
        onCheck={handleCheck}
        onExpand={handleExpand}
        let:item
    >
        <p>Contenido de <strong>{item.title}</strong> (slot con let:item).</p>
    </Grav_Accordion>
</div>
