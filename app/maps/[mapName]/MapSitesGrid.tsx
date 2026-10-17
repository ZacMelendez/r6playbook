"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertToUrlParameter } from "@/lib/string";
import { motion } from "motion/react";

type MapSitesGridProps = {
    mapName: string;
    mapImageUrl?: string;
    sites: readonly string[];
    siteImages: Record<string, string | null>;
};

export function MapSitesGrid({
    mapName,
    mapImageUrl,
    sites,
    siteImages,
}: MapSitesGridProps) {
    const mapSlug = mapName.toLowerCase().replace(/\s+/g, "-");

    return (
        <div className="container mx-auto">
            <div className="flex flex-col items-center gap-2 mb-6">
                <motion.h1
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold "
                >
                    {mapName}
                </motion.h1>
                {mapImageUrl && (
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative w-full max-w-2xl aspect-video"
                    >
                        <Image
                            src={mapImageUrl}
                            alt={mapName}
                            fill
                            sizes="(max-width: 768px) 100vw, 640px"
                            className="rounded-lg object-cover"
                            priority
                        />
                    </motion.div>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sites.map((site, index) => {
                    const siteImage = siteImages[site];
                    return (
                        <motion.div
                            key={site}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{
                                duration: 0.25,
                                delay: 0.2 + index * 0.035,
                            }}
                        >
                            <Link
                                href={convertToUrlParameter(mapSlug, site)}
                            >
                                <Card className="hover:bg-slate-800 transition-all">
                                    <CardHeader>
                                        <CardTitle>{site}</CardTitle>
                                    </CardHeader>
                                    {siteImage && (
                                        <CardContent>
                                            <div className="relative w-full aspect-video">
                                                <Image
                                                    src={siteImage}
                                                    alt={`${mapName}-${site}`}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    className="rounded-lg object-cover"
                                                />
                                            </div>
                                        </CardContent>
                                    )}
                                </Card>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
