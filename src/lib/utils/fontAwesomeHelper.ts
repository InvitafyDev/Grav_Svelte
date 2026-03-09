/**
 * Utilidad para prevenir que Font Awesome procese iconos múltiples veces
 * y cause duplicación de iconos en la aplicación
 */

let isInitialized = false;
let globalObserver: MutationObserver | null = null;

/**
 * Inicializa el sistema global de prevención de duplicación de iconos
 */
export function initFontAwesomeProtection() {
    if (isInitialized) return;
    isInitialized = true;

    // Esperar a que Font Awesome esté cargado
    const checkFontAwesome = () => {
        if (typeof window !== 'undefined' && (window as any).FontAwesome) {
            setupGlobalProtection();
        } else {
            // Reintentar después de un breve delay
            setTimeout(checkFontAwesome, 100);
        }
    };

    if (typeof window !== 'undefined') {
        // Si Font Awesome ya está cargado
        if ((window as any).FontAwesome) {
            setupGlobalProtection();
        } else {
            // Esperar a que se cargue
            window.addEventListener('load', checkFontAwesome);
            checkFontAwesome();
        }
    }
}

/**
 * Configura la protección global contra duplicación de iconos
 */
function setupGlobalProtection() {
    if (globalObserver) return;

    // Función para limpiar iconos duplicados en un elemento
    const cleanDuplicates = (element: Element) => {
        // Buscar todos los iconos
        const allIcons = element.querySelectorAll('i[class*="fa-"]');
        const iconMap = new Map<string, Element>();

        allIcons.forEach((icon) => {
            const iconClass = icon.getAttribute('class') || '';
            const faClasses = iconClass.split(' ').filter(c => c.startsWith('fa-'));
            const faKey = faClasses.join(' ');

            if (faKey) {
                const parent = icon.parentElement;
                const button = icon.closest('button');
                const buttonGroup = button?.closest('.button-group');
                const isActionButton = button?.classList.contains('action-buttons-group') || !!buttonGroup;
                const dedupeKey = isActionButton && button && buttonGroup
                    ? `${faKey}::btn::${Array.from(buttonGroup.querySelectorAll('button')).indexOf(button)}`
                    : (button && element.contains(button))
                        ? `${faKey}::btn::${Array.from(element.querySelectorAll('button')).indexOf(button)}`
                        : faKey;

                if (parent) {
                    const iconName = faClasses[faClasses.length - 1];
                    const existingSvg = parent.querySelector(`svg[data-icon="${iconName}"]`) ||
                        parent.querySelector(`svg[data-icon="${iconName.replace(/^fa-/, '')}"]`);
                    if (existingSvg) {
                        icon.remove();
                        return;
                    }
                }

                if (iconMap.has(dedupeKey)) {
                    if (!icon.classList.contains('sidebar-section-icon')) {
                        icon.remove();
                    }
                } else {
                    iconMap.set(dedupeKey, icon);
                    icon.setAttribute('data-fa-processed', 'true');
                    icon.setAttribute('data-fa-i2svg-processed', 'true');
                }
            }
        });

        // Limpiar SVGs duplicados
        const allSvgs = element.querySelectorAll('svg[data-icon]');
        const svgMap = new Map<string, Element>();

        allSvgs.forEach((svg) => {
            const dataIcon = svg.getAttribute('data-icon');
            if (dataIcon) {
                const isSectionCaret = svg.closest('.sidebar-section-btn');
                const button = svg.closest('button');
                const buttonGroup = button?.closest('.button-group');
                const isActionButton = button?.classList.contains('action-buttons-group') || !!buttonGroup;
                const svgKey = isActionButton && button && buttonGroup
                    ? `${dataIcon}::btn::${Array.from(buttonGroup.querySelectorAll('button')).indexOf(button)}`
                    : (button && element.contains(button))
                        ? `${dataIcon}::btn::${Array.from(element.querySelectorAll('button')).indexOf(button)}`
                        : dataIcon;

                if (svgMap.has(svgKey) && !isSectionCaret) {
                    svg.remove();
                } else if (!svgMap.has(svgKey) || isSectionCaret) {
                    if (!svgMap.has(svgKey)) svgMap.set(svgKey, svg);
                }
            }
        });
    };

    // Observar cambios en el DOM para limpiar duplicados
    globalObserver = new MutationObserver((mutations) => {
        const elementsToClean = new Set<Element>();

        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const element = node as Element;
                        // Si es un icono o contiene iconos
                        if (element.tagName === 'I' && element.classList.contains('fa-')) {
                            const parent = element.parentElement;
                            if (parent) elementsToClean.add(parent);
                        } else if (element.querySelector('i[class*="fa-"]')) {
                            elementsToClean.add(element);
                        }
                        // Si es un SVG de Font Awesome
                        if (element.tagName === 'SVG' && element.hasAttribute('data-icon')) {
                            const parent = element.parentElement;
                            if (parent) elementsToClean.add(parent);
                        }
                    }
                });
            }
        });

        // Limpiar duplicados después de un breve delay para evitar procesar múltiples veces
        if (elementsToClean.size > 0) {
            setTimeout(() => {
                elementsToClean.forEach((element) => {
                    cleanDuplicates(element);
                });
            }, 10);
        }
    });

    // Observar todo el documento
    if (typeof document !== 'undefined') {
        globalObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

/**
 * Limpia iconos duplicados en un elemento específico
 */
export function cleanIconDuplicates(element: HTMLElement | Element) {
    if (!element) return;

    // Limpiar iconos <i> duplicados
    const allIcons = element.querySelectorAll('i[class*="fa-"]');
    const iconMap = new Map<string, Element>();

    allIcons.forEach((icon) => {
        const iconClass = icon.getAttribute('class') || '';
        const faClasses = iconClass.split(' ').filter(c => c.startsWith('fa-'));
        const faKey = faClasses.join(' ');

        if (faKey) {
            const parent = icon.parentElement;
            const button = icon.closest('button');
            const buttonGroup = button?.closest('.button-group');
            const isActionButton = button?.classList.contains('action-buttons-group') || !!buttonGroup;
            const dedupeKey = isActionButton && button && buttonGroup
                ? `${faKey}::btn::${Array.from(buttonGroup.querySelectorAll('button')).indexOf(button)}`
                : (button && element.contains(button))
                    ? `${faKey}::btn::${Array.from(element.querySelectorAll('button')).indexOf(button)}`
                    : faKey;

            if (parent) {
                const iconName = faClasses[faClasses.length - 1];
                const existingSvg = parent.querySelector(`svg[data-icon="${iconName}"]`) ||
                    parent.querySelector(`svg[data-icon="${iconName.replace(/^fa-/, '')}"]`);
                if (existingSvg) {
                    icon.remove();
                    return;
                }
            }

            if (iconMap.has(dedupeKey)) {
                if (!icon.classList.contains('sidebar-section-icon')) {
                    icon.remove();
                }
            } else {
                iconMap.set(dedupeKey, icon);
                icon.setAttribute('data-fa-processed', 'true');
                icon.setAttribute('data-fa-i2svg-processed', 'true');
            }
        }
    });

    // Limpiar SVGs duplicados
    const allSvgs = element.querySelectorAll('svg[data-icon]');
    const svgMap = new Map<string, Element>();

    allSvgs.forEach((svg) => {
        const dataIcon = svg.getAttribute('data-icon');
        if (dataIcon) {
            const isSectionCaret = svg.closest('.sidebar-section-btn');
            const button = svg.closest('button');
            const buttonGroup = button?.closest('.button-group');
            const isActionButton = button?.classList.contains('action-buttons-group') || !!buttonGroup;
            const svgKey = isActionButton && button && buttonGroup
                ? `${dataIcon}::btn::${Array.from(buttonGroup.querySelectorAll('button')).indexOf(button)}`
                : (button && element.contains(button))
                    ? `${dataIcon}::btn::${Array.from(element.querySelectorAll('button')).indexOf(button)}`
                    : dataIcon;

            if (svgMap.has(svgKey) && !isSectionCaret) {
                svg.remove();
            } else if (!svgMap.has(svgKey) || isSectionCaret) {
                if (!svgMap.has(svgKey)) svgMap.set(svgKey, svg);
            }
        }
    });
}

/**
 * Desconecta el observer global
 */
export function disconnectFontAwesomeProtection() {
    if (globalObserver) {
        globalObserver.disconnect();
        globalObserver = null;
    }
    isInitialized = false;
}
