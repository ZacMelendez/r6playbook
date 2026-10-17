"use client";

import Image from "next/image";
import { maps } from "@/lib/constants/maps";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { convertToUrlParameter } from "@/lib/string";
import { useTransitionRouter } from "next-view-transitions";

export function Maps() {
    const router = useTransitionRouter();
    const handleCardClick = (mapName: string) => {
        router.push(convertToUrlParameter(mapName));
    };

    return (
        <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
            {maps
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((map, index) => (
                    <motion.div
                        key={map.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.035 }}
                    >
                        <Card
                            onClick={() => handleCardClick(map.name)}
                            aria-label="map card"
                            className="hover:bg-black/10 cursor-pointer transition-all p-4 m-0"
                        >
                            <CardHeader className="p-0 mb-3 font-bold text-lg">
                                {map.name}
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="relative w-full aspect-video">
                                    <Image
                                        src={map.imageUrl}
                                        alt={map.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="rounded-lg object-cover"
                                        loading={index < 3 ? "eager" : "lazy"}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
        </div>
    );
}
