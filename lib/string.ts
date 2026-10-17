export function toTitleCase(str: string): string {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function toTitleCaseEachWord(str: string): string {
    return str
        .split(" ")
        .map((word) => toTitleCase(word))
        .join(" ");
}

export const formatSiteName = (siteName: string) => {
    return siteName.replace(/\s+/g, "_").replace(/\//g, "-").toLowerCase();
};

export const parseSiteName = (siteName: string) => {
    return toTitleCaseEachWord(siteName.replace(/_/g, " ").replace(/-/g, "/"));
};

export const formatMapName = (mapName: string) => {
    return mapName.replace(/\s+/g, "-").toLowerCase();
};

export const parseMapName = (mapName: string) => {
    return toTitleCaseEachWord(mapName.replace(/-/g, " "));
};

export function convertToUrlParameter(
    mapName: string,
    siteName?: string,
    strategyId?: string
): string {
    if (mapName && !siteName) {
        const formattedMapName = formatMapName(mapName);
        return `/maps/${formattedMapName}/`.toLowerCase();
    } else if (mapName && siteName && !strategyId) {
        const formattedMapName = formatMapName(mapName);
        const formattedSiteNames = formatSiteName(siteName || "");

        return `/maps/${formattedMapName}/sites/${formattedSiteNames}/`.toLowerCase();
    } else if (mapName && siteName && strategyId) {
        const formattedSiteNames = formatSiteName(siteName || "").toLowerCase();
        const formattedMapName = formatMapName(mapName).toLowerCase();
        return `/maps/${formattedMapName}/sites/${formattedSiteNames}/${strategyId}/`;
    }
    return "";
}

export function parseUrlParameter(
    url: string
): { mapName: string; siteName: string } | null {
    let siteName = "";
    const regex = url.includes("site")
        ? /\/maps\/([^/]+)\/sites\/([^/]+)/
        : /\/maps\/([^/]+)/;
    const match = url.match(regex);
    if (!match) {
        return null;
    }
    const mapName = parseMapName(match[1]);
    siteName = url.includes("site") ? parseSiteName(match[2]) : "";
    return { mapName, siteName };
}
