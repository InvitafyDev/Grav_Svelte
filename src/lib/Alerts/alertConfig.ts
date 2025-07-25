import Swal from 'sweetalert2';
import './alertStyles.css';

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
            confirmButton: 'alert-error-button'
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
            confirmButton: 'alert-confirm-button',
            cancelButton: 'alert-cancel-button'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        }
    });
}