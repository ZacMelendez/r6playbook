import { maps, siteImages, sites } from "@/lib/constants";
import { toTitleCaseEachWord } from "@/lib/string";
import { MapSitesGrid } from "./MapSitesGrid";

type Props = {
    params: Promise<{ mapName: string }>;
};

export function generateStaticParams() {
    return maps.map((map) => ({
        mapName: map.name.toLowerCase().replace(/\s+/g, "-"),
    }));
}

export default async function Index({ params }: Props) {
    const pathParams = await params;
    const mapName = toTitleCaseEachWord(pathParams.mapName.replace("-", " "));
    const map = maps.find((i) => i.name === mapName);
    const mapSites = sites[mapName as keyof typeof sites] ?? [];

    return (
        <MapSitesGrid
            mapName={mapName}
            mapImageUrl={map?.imageUrl}
            sites={mapSites}
            siteImages={
                siteImages[mapName as keyof typeof siteImages] ?? {}
            }
        />
    );
}
