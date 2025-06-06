export interface SidebarModule {
    nombre: string;
    ruta: string;
    icono: string;
    notifiacion?: number | null;
    permiso?: boolean;
}

export interface SidebarSection {
    nombre: string;
    biActivado: boolean;
    modules: SidebarModule[];
}