/* eslint-disable */
export default function memoize<T>(func: Function): Function {
    const cache: Map<string, T> = new Map()
    return (...args: any[]): T => {
        const key: string = JSON.stringify(args)
        const cached: T | undefined = cache.get(key)
        if (cached) {
            return cached
        }
        const result: T = func(...args)
        cache.set(key, result)

        return result
    }
}
