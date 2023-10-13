import { toast } from 'wc-toast';

function SuccessToast(message: string = 'Успешно'): string {
	return toast(message, {
		icon: { type: 'success' },
		theme: {
			type: 'custom',
			style: {
				background: 'var(--primary-color-light)',
				color: 'var(--text-color)'
			}
		}
	});
}

export default SuccessToast;
