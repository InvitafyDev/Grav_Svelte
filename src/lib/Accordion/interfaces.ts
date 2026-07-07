export type AccordionBadgeType = 'success' | 'warning' | 'danger' | 'neutral';

export interface AccordionItemI {
    /** Identificador único del item (se usa para expandir/colapsar). */
    id: string | number;
    title: string;
    subtitle?: string;
    /** Texto del badge de estado (ej. "Completada", "Pendiente"). Si se omite no se muestra badge. */
    badgeText?: string;
    badgeType?: AccordionBadgeType;
    /** Estado del check de realizado. */
    checked?: boolean;
    /** Permite ocultar el check en items puntuales aunque showCheck sea true. */
    checkable?: boolean;
    /** Datos extra del consumidor (se devuelven íntegros en los callbacks). */
    [key: string]: unknown;
}
