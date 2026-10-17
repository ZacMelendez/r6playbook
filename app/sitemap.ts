const baseUrl = "https://r6playbook.com";
import { sites } from "@/lib/constants";
import { formatMapName, formatSiteName } from "@/lib/string";
import { ArrayElement } from "@/lib/utils";

import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const maps = Object.keys(sites);

    const mapRoutes = maps.map((map) => {
        return {
            url: `${baseUrl}/maps/${formatMapName(map)}`,
            lastModified: new Date(),
            changeFrequency:
                "yearly" as ArrayElement<MetadataRoute.Sitemap>["changeFrequency"],
            priority: 0.7,
        };
    });

    const siteRoutes = maps.flatMap((map) => {
        return sites[map as keyof typeof sites].map((site) => {
            return {
                url: `${baseUrl}/maps/${formatMapName(
                    map
                )}/sites/${formatSiteName(site)}`,
                lastModified: new Date(),
                changeFrequency:
                    "hourly" as ArrayElement<MetadataRoute.Sitemap>["changeFrequency"],
                priority: 0.6,
            };
        });
    });

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 1,
        },
        {
            url: baseUrl + "/create",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: baseUrl + "/maps",
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        {
            url: baseUrl + "/privacy",
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        {
            url: baseUrl + "/tos",
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        {
            url: baseUrl + "/operators",
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        {
            url: baseUrl + "/explore",
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
        ...mapRoutes,
        ...siteRoutes,
    ];
}
