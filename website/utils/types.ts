export function returnIfCorrectType<T>(value: T, type: string) {
    if (typeof value !== type || (typeof value === 'string' && value.length <= 0)) {
        return undefined;
    } else {
        return value;
    }
}
