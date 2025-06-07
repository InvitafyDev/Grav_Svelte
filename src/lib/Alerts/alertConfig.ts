import Swal from 'sweetalert2';

export function Exito_Alert(titulo = 'Se guardo correctamente') {
    Swal.fire({
        icon: 'success',
        title: titulo,
        showConfirmButton: false,
        timer: 1500
    });
}

export function Error_Alert(titulo = 'Algo salió mal') {
    Swal.fire({
        icon: 'error',
        title: titulo,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#EF4444',
        confirmButtonText: 'OK',
        focusConfirm: false,
        focusCancel: false,
        buttonsStyling: false,
        customClass: {
            denyButton: 'hidden',
            confirmButton:
                'text-red-500 background-transparent font-bold uppercase px-6 py-2 text-base  focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
        }
    });
}

export function Confirmacion_Alert(titulo = 'Confirmación', texto = 'Desea guardar los cambios?', callback: () => void) {
    return Swal.fire({
        title: titulo,
        text: texto,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#EF4444',
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        focusConfirm: false,
        focusCancel: false,
        buttonsStyling: false,
        customClass: {
            denyButton: 'hidden',
            confirmButton:
                'bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150',
            cancelButton:
                'text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
}