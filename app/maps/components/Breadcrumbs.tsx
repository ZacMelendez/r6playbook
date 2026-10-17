"use client";
import { useParams } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    formatMapName,
    formatSiteName,
    parseMapName,
    parseSiteName,
} from "@/lib/string";
import { sites } from "@/lib/constants";
import { useAtomValue } from "jotai";
import { strategyAtom } from "@/lib/atoms/strategies";

export const MapBreadcrumbs = () => {
    const params = useParams<{
        mapName?: string;
        siteName?: string;
        playId?: string;
    }>();

    const strategy = useAtomValue(strategyAtom);

    const mapName = params?.mapName ? parseMapName(params.mapName) : undefined;
    const siteName = params?.siteName
        ? parseSiteName(params.siteName)
        : undefined;
    const strategyId = params?.playId;

    const map =
        mapName &&
        Object.keys(sites).find(
            (key) => key.toLowerCase() === mapName?.toLowerCase()
        );
    const site =
        map &&
        sites[map as keyof typeof sites].find(
            (key) => key.toLowerCase() === siteName?.toLowerCase()
        );

    const renderBreadcrumbItem = (label: string, href?: string) => (
        <BreadcrumbItem>
            {href ? (
                <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
            ) : (
                <BreadcrumbPage>{label}</BreadcrumbPage>
            )}
        </BreadcrumbItem>
    );

    const renderBreadcrumbSeparator = () => <BreadcrumbSeparator />;

    return (
        <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Breadcrumb className="min-h-12 py-2 flex items-center">
                <BreadcrumbList>
                    {renderBreadcrumbItem("Home", "/")}
                    {renderBreadcrumbSeparator()}
                    {renderBreadcrumbItem("Maps", "/maps")}

                    {map && (
                        <>
                            {renderBreadcrumbSeparator()}
                            {renderBreadcrumbItem(
                                map,
                                site
                                    ? `/maps/${formatMapName(mapName!)}`
                                    : undefined
                            )}
                        </>
                    )}

                    {site && (
                        <>
                            {renderBreadcrumbSeparator()}
                            {renderBreadcrumbItem(
                                site,
                                strategy.title
                                    ? `/maps/${formatMapName(
                                          mapName!
                                      )}/sites/${formatSiteName(siteName!)}`
                                    : undefined
                            )}
                        </>
                    )}

                    {strategyId && (
                        <>
                            {renderBreadcrumbSeparator()}
                            {renderBreadcrumbItem(strategy.title)}
                        </>
                    )}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
};
