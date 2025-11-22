export function isEmpty<T>(value:T): boolean {
    if (typeof value === 'string' && value.trim() === '') return true;

    if (value === null || value === undefined)return true;

    return false;
}