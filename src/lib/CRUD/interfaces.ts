export interface ButtonConfig {
    icon: string;
    color: string;
    action: (id: number) => void;
    tooltip: string;
}

export interface TableHeader {
    titulo: string;
    biSort: boolean;
    /**
     * Tipo de dato de la columna.
     * - `Text` Texto simple
     * - `Number` Números
     * - `Buttons` Grupo de botones de acción
     * - `Image` URL de imagen a mostrar
     */
    tipo: 'Text' | 'Number' | 'Buttons' | 'Image';
    biBold: boolean;
    campo: string;
    buttonsConfig: ButtonConfig[] | null;
}

export interface FiltrosI {
    tipo: 'number' | 'text' | 'date' | 'datetime' | 'select' | 'bool';
    label: string;
    value: any;
    options: { value: any; label: string }[];
};

export interface CrudWrapperProps {
    Filtros: FiltrosI[];
    todosLosObjetos: any[];
    tableH: TableHeader[];
    totalRows: number;
    PageSize: number;
    currentPage: number;
    selectedAscOrDesc: string;
    selectedSort: string;
    loading?: boolean;
    showAddButton?: boolean;
    showImportButton?: boolean;
    onFilter: (filters: FiltrosI[]) => void;
    onAdd: () => void;
}