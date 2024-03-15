import { toast } from 'svoast';

export const toastInfo = (message: string, ms = 4000) => toast.info(message, { duration: ms });

export const toastSuccess = (message: string, ms = 4000) =>
	toast.success(message, { duration: ms });

export const toastError = (message: string, ms = 4000) => toast.error(message, { duration: ms });

export const toastAttention = (message: string, ms = 4000) =>
	toast.attention(message, { duration: ms });

export const toastWarning = (message: string, ms = 4000) =>
	toast.warning(message, { duration: ms });
