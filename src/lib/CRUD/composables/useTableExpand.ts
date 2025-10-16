import { writable } from 'svelte/store';

export function useTableExpand() {
    const expandedRows = writable<Set<string | number>>(new Set());

    function toggleExpand(id: string | number) {
        expandedRows.update(rows => {
            const newRows = new Set(rows);
            if (newRows.has(id)) {
                newRows.delete(id);
            } else {
                newRows.add(id);
            }
            return newRows;
        });
    }

    return {
        expandedRows,
        toggleExpand
    };
}
