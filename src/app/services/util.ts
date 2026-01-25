export function isEmpty<T>(value:T): boolean {
    if (typeof value === 'string' && value.trim() === '') return true;

    if (value === null || value === undefined)return true;

    return false;
}

export function isMobile(): boolean {
    if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        return true;
    }

    return false;
}