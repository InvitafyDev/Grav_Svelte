import { writable } from 'svelte/store';

export function useTableSort(onSort: (field: string, direction: 'asc' | 'desc') => void) {
    const selectedAscOrDesc = writable<'asc' | 'desc'>('asc');
    const selectedSort = writable<string>('');

    function dispatchSort(selection: string, currentDirection: 'asc' | 'desc') {
        const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        selectedAscOrDesc.set(newDirection);
        selectedSort.set(selection);
        onSort(selection, newDirection);
    }

    return {
        selectedAscOrDesc,
        selectedSort,
        dispatchSort
    };
}
