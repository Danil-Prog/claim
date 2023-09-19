import {toast} from "wc-toast";

function ErrorToast(message = 'Произошла ошибка') {
    return toast(message, {
        icon: { type: 'error' },
        theme: {
            type: 'custom',
            style: {
                background: 'var(--primary-color-light)',
                color: 'var(--text-color)'
            }
        }
    });
}

export default ErrorToast;
