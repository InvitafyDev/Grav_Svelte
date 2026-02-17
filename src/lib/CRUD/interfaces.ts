export interface ButtonConfig {
    icon: string;
    color: string;
    action: (id: number, row?: any) => void;
    tooltip: string;
    /**
     * When set to false the button will not be rendered. Defaults to true.
     */
    show?: boolean;
}

export interface TableHeader {
    titulo: string;
    biSort: boolean;
    tipo: 'Text' | 'TextArea' | 'Number' | 'Buttons' | 'Bool' | 'Image' | 'Datetime' | 'Date' | 'EditableBool' | 'EditableText' | 'EditableNumber' | 'DynamicButton' | 'ImageButton' | 'DualTextButton' | 'ConditionalCell' | 'MultiTextButton' | 'Component';
    biBold: boolean;
    /**
     * Alignment for the content of the cells belonging to this header.
     * Defaults to 'left' when not provided.
     */
    align?: 'left' | 'right' | 'center';
    /**
     * Max height for TextArea cells (e.g. '150px'). Used for TextArea type.
     */
    cellMaxHeight?: string;
    campo: string;
    colorCampo?: string;
    buttonsConfig: ButtonConfig[] | null;
    /**
     * Callback function that is called when an editable cell value changes.
     * Used for EditableBool, EditableText, and EditableNumber types.
     * @param id - The ID of the row being edited
     * @param campo - The field name being edited
     * @param newValue - The new value
     */
    onUpdate?: (id: number | string, campo: string, newValue: any) => Promise<void> | void;
    /**
     * Field name that contains the dynamic button text.
     * Used for DynamicButton type.
     */
    textField?: string;
    /**
     * Field name that contains the CSS classes for the dynamic button color/style.
     * Used for DynamicButton type.
     */
    colorField?: string;
    /**
     * Field name that contains inline CSS styles for the dynamic button.
     * Used for DynamicButton type.
     * Has higher specificity than colorField classes, useful for avoiding CSS hierarchy conflicts.
     */
    styleField?: string;
    /**
     * Field name that contains the icon class (e.g., Font Awesome class).
     * Used for DynamicButton type.
     */
    iconField?: string;
    /**
     * Position of the icon relative to the text.
     * Used for DynamicButton type.
     * Defaults to 'left' when not provided.
     */
    iconPosition?: 'left' | 'right';
    /**
     * Callback function that is called when a dynamic button is clicked.
     * Used for DynamicButton type.
     * @param id - The ID of the row
     * @param row - The complete row data object
     */
    onButtonClick?: (id: number | string, row: any) => Promise<void> | void;
    /**
     * Field name that contains the image URL for circular image buttons.
     * Used for ImageButton type.
     */
    imageField?: string;
    /**
     * Size of the circular image button.
     * Used for ImageButton type.
     * Defaults to 'md' when not provided.
     */
    imageSize?: 'sm' | 'md' | 'lg';
    /**
     * Callback function that is called when an image button is clicked.
     * Used for ImageButton type.
     * @param id - The ID of the row
     */
    action?: (id: number | string) => Promise<void> | void;
    /**
     * Field name that contains the first text for dual text buttons.
     * Used for DualTextButton type.
     */
    textField1?: string;
    /**
     * Field name that contains the second text for dual text buttons.
     * Used for DualTextButton type.
     */
    textField2?: string;
    /**
     * Field name that contains the CSS classes for the first text.
     * Used for DualTextButton type.
     */
    colorField1?: string;
    /**
     * Field name that contains the CSS classes for the second text.
     * Used for DualTextButton type.
     */
    colorField2?: string;
    /**
     * Separator between the two texts in dual text buttons.
     * Used for DualTextButton type.
     * Defaults to ' / ' when not provided.
     */
    separator?: string;
    /**
     * Field name that contains the boolean condition for ConditionalCell.
     * Used for ConditionalCell type.
     */
    conditionField?: string;
    /**
     * Configuration for rendering when the condition is true.
     * Used for ConditionalCell type.
     */
    whenTrue?: {
        tipo: 'Text' | 'DualTextButton';
        textField?: string;
        colorField?: string;
        textField1?: string;
        textField2?: string;
        colorField1?: string;
        colorField2?: string;
        separator?: string;
    };
    /**
     * Configuration for rendering when the condition is false.
     * Used for ConditionalCell type.
     */
    whenFalse?: {
        tipo: 'Text' | 'DualTextButton';
        textField?: string;
        colorField?: string;
        textField1?: string;
        textField2?: string;
        colorField1?: string;
        colorField2?: string;
        separator?: string;
    };
    /**
     * Field name that contains an array of items to display.
     * Each item should be an object with: { text: string, color?: string }
     * Used for MultiTextButton type.
     */
    itemsField?: string;
    /**
     * Layout direction for multiple items.
     * Used for MultiTextButton type.
     * Defaults to 'vertical' when not provided.
     */
    multiLayout?: 'vertical' | 'horizontal';
    /**
     * Optional separator between items when layout is horizontal.
     * Used for MultiTextButton type.
     * Defaults to no separator (items are just stacked/aligned).
     */
    multiSeparator?: string;
    /**
     * Svelte component to render in the cell.
     * Used for Component type.
     * The component will receive the entire row object as a 'row' prop.
     */
    component?: any;
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
    showExcelButton?: boolean;
    showPdfButton?: boolean;
    /**
     * Field name that contains the unique ID for each row.
     * Defaults to 'id' if not specified.
     */
    idField?: string;
    /**
     * Enables expand/collapse functionality for rows with subrows.
     * Defaults to false if not specified.
     */
    expandEnabled?: boolean;
    /**
     * Field name that contains the array of subrows for each row.
     * Defaults to 'subRows' if not specified.
     */
    subRowsField?: string;
    /**
     * Custom headers for subrows when expandEnabled is true.
     * If not specified, subrows will use the same headers as parent rows (showing only Text and Number types).
     * Used when you need different column structure for subrows.
     */
    subRowHeaders?: TableHeader[];
    onFilter: (filters: FiltrosI[]) => void;
    onAdd: () => void;
    onImport?: () => void;
}