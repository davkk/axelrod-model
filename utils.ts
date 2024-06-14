export function randInt(max: number) {
    return Math.floor(Math.random() * max);
}

export function mod(a: number, b: number) {
    return ((a % b) + b) % b;
}

export function debounce<T extends Function>(cb: T, wait = 20) {
    let h: Timer = 0;
    let callable = (...args: any) => {
        clearTimeout(h);
        h = setTimeout(() => cb(...args), wait);
    };
    return <T>(<any>callable);
}
