import { writable } from 'svelte/store';

export function useTableSort(onSort: (field: string, direction: 'asc' | 'desc') => void) {
    const selectedAscOrDesc = writable<'asc' | 'desc'>('asc');
    const selectedSort = writable<string>('');

    function dispatchSort(selection: string, currentDirection: 'asc' | 'desc') {
        // Otra columna empieza ascendente; solo la misma alterna. Antes siempre
        // alternaba, y al pasar de una columna en "asc" a otra, la nueva
        // arrancaba al revés.
        let actual = '';
        selectedSort.subscribe((v) => (actual = v))();
        const newDirection =
            selection !== actual ? 'asc' : currentDirection === 'asc' ? 'desc' : 'asc';
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
