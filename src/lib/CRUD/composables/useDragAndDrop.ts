import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export interface DragAndDropState {
    draggedIndex: number | null;
    dragOverIndex: number | null;
    isDragging: boolean;
    reorderedItems: any[];
}

export function useDragAndDrop(
    todosLosRegistros: Writable<any[]>,
    orderField: string,
    dragEnabled: boolean,
    loading: boolean,
    onReorderChange: (changes: any[]) => void
) {
    const draggedIndex = writable<number | null>(null);
    const dragOverIndex = writable<number | null>(null);
    const isDragging = writable<boolean>(false);
    const reorderedItems = writable<any[]>([]);

    function handleDragStart(event: DragEvent, index: number, items: any[]) {
        if (!dragEnabled || !items || items.length === 0 || loading) {
            event.preventDefault();
            return;
        }

        draggedIndex.set(index);
        isDragging.set(true);

        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/html', '');
        }
    }

    function handleDragOver(event: DragEvent, index: number, currentDraggedIndex: number | null) {
        if (!dragEnabled || currentDraggedIndex === null) return;

        event.preventDefault();
        dragOverIndex.set(index);

        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
        }
    }

    function handleDragLeave() {
        dragOverIndex.set(null);
    }

    function handleDrop(
        event: DragEvent,
        dropIndex: number,
        currentDraggedIndex: number | null,
        items: any[]
    ) {
        if (!dragEnabled || currentDraggedIndex === null || currentDraggedIndex === dropIndex) {
            resetDragState();
            return;
        }

        if (!items || items.length === 0 || loading) {
            resetDragState();
            return;
        }

        event.preventDefault();

        const newItems = [...items];
        const draggedItem = newItems[currentDraggedIndex];

        newItems.splice(currentDraggedIndex, 1);
        newItems.splice(dropIndex, 0, draggedItem);

        const changes: any[] = [];

        newItems.forEach((item, index) => {
            const newOrder = index + 1;
            const originalOrder = item[orderField];

            if (originalOrder !== newOrder) {
                changes.push({
                    ...item,
                    [orderField]: newOrder,
                });
            }

            item[orderField] = newOrder;
        });

        todosLosRegistros.set(newItems);
        reorderedItems.set(changes);

        onReorderChange(changes);

        resetDragState();
    }

    function handleDragEnd() {
        resetDragState();
    }

    function resetDragState() {
        draggedIndex.set(null);
        dragOverIndex.set(null);
        isDragging.set(false);
    }

    return {
        draggedIndex,
        dragOverIndex,
        isDragging,
        reorderedItems,
        handleDragStart,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleDragEnd,
        resetDragState
    };
}
