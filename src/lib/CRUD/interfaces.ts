export interface ButtonConfig {
    icon: string;
    color: string;
    action: (id: number) => void;
    tooltip: string;
    /**
     * When set to false the button will not be rendered. Defaults to true.
     */
    show?: boolean;
}

export interface TableHeader {
    titulo: string;
    biSort: boolean;
    tipo: 'Text' | 'Number' | 'Buttons' | 'Bool' | 'Image' | 'Datetime' | 'Date';
    biBold: boolean;
    /**
     * Alignment for the content of the cells belonging to this header.
     * Defaults to 'left' when not provided.
     */
    align?: 'left' | 'right' | 'center';
    campo: string;
    buttonsConfig: ButtonConfig[] | null;
}

export interface FiltrosI {
    tipo: 'number' | 'text' | 'date' | 'datetime' | 'select' | 'bool';
    label: string;
    value: any;
    options?: { value: any; label: string }[];
    service?: () => Promise<{ value: any; label: string }[]>;
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
    onImport?: () => void;
}