import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

type ModalConfig = {
    id: string;
    component: any;
    props?: Record<string, any>;
};

// Create the default store
const defaultStore: Writable<ModalConfig[]> = writable([]);

// Configured utility functions that use the default store
export function openModal(id: string, component: any, props: Record<string, any> = {}) {
    defaultStore.update((currentModals) => [...currentModals, { id, component, props }]);
}

export function closeModal(id: string) {
    defaultStore.update((currentModals) => currentModals.filter((modal) => modal.id !== id));
}

export function closeAllModals() {
    defaultStore.set([]);
}

// Export the store for use in ModalContainer
export const modals = defaultStore;

// Export types
export type { ModalConfig }; 