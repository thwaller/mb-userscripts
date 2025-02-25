export function urlBasename(url: string | URL, defaultBasename = ''): string {
    if (typeof url !== 'string') url = url.pathname;
    // We don't need nullish coalescing here, since the array will always have
    // at least one element, but the last element may be the empty string.
    return url.split('/').pop()! || defaultBasename;
}

export function urlJoin(base: string | URL, ...subPaths: string[]): URL {
    let newUrl = new URL(base);
    for (const subPath of subPaths) {
        newUrl = new URL(subPath, newUrl);
    }
    return newUrl;
}
