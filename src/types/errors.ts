export interface ApiError extends Error {
    response?: {
        data?: any;
        status?: number;
        headers?: any;
    };
}

export function isApiError(error: unknown): error is ApiError {
    return (
        error instanceof Error &&
        'response' in error &&
        typeof (error as any).response === 'object'
    );
}

export function handleError(error: unknown): string {
    if (isApiError(error)) {
        return error.response?.data?.message || error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return String(error);
}