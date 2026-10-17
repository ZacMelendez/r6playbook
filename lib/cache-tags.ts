export function siteCacheTag(map: string, site: string) {
    return `site:${map}:${site}`;
}

export function strategyCacheTag(id: string) {
    return `strategy:${id}`;
}
