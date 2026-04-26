import * as svelte from 'svelte';
import AppleAlert from './AppleAlert.svelte';
import AppleToast from './AppleToast.svelte';

interface MountOptions {
    target: HTMLElement;
    props: Record<string, unknown>;
    intro?: boolean;
}

const svelteAny = svelte as unknown as {
    mount?: (component: unknown, opts: MountOptions) => unknown;
    unmount?: (instance: unknown) => void;
};

const isSvelte5 = typeof svelteAny.mount === 'function';

function mountComponent(
    Component: unknown,
    props: Record<string, unknown>
): void {
    if (typeof document === 'undefined') return;

    const target = document.createElement('div');
    document.body.appendChild(target);

    let instance: unknown;
    let destroyed = false;

    const cleanup = () => {
        if (destroyed) return;
        destroyed = true;
        try {
            if (isSvelte5 && svelteAny.unmount) {
                svelteAny.unmount(instance);
            } else if (instance && typeof (instance as { $destroy?: () => void }).$destroy === 'function') {
                (instance as { $destroy: () => void }).$destroy();
            }
        } catch (err) {
            console.error('Error destroying alert component:', err);
        }
        if (target.parentNode) target.parentNode.removeChild(target);
    };

    const finalProps = { ...props, onDestroy: cleanup };

    if (isSvelte5 && svelteAny.mount) {
        instance = svelteAny.mount(Component, { target, props: finalProps, intro: true });
    } else {
        const Ctor = Component as new (args: MountOptions) => unknown;
        instance = new Ctor({ target, props: finalProps, intro: true });
    }
}

export function Exito_Alert(titulo = 'Se guardó correctamente', mensaje = '') {
    mountComponent(AppleToast, {
        title: titulo,
        message: mensaje,
        icon: 'success',
        duration: 3500,
    });
}

export function Error_Alert(titulo = 'Algo salió mal') {
    mountComponent(AppleAlert, {
        title: titulo,
        icon: 'error',
        confirmText: 'OK',
        cancelText: null,
    });
}

export function Confirmacion_Alert(
    titulo = 'Confirmación',
    texto = '¿Desea guardar los cambios?',
    callback: () => void
) {
    mountComponent(AppleAlert, {
        title: titulo,
        message: texto,
        icon: 'warning',
        confirmText: 'Sí',
        cancelText: 'No',
        onConfirm: callback,
    });
}
