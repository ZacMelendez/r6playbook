"use client";

import { LinkButton } from "@/components/ui/button";
import { siteAtom } from "@/lib/atoms/site";
import { sites } from "@/lib/constants";
import { useSetAtom } from "jotai";
import { motion } from "motion/react";
import React from "react";

export const NoPlaysFound = ({
    siteName,
    mapName,
}: {
    siteName: string;
    mapName: string;
}) => {
    const setSiteAtom = useSetAtom(siteAtom);
    const [redirectUrl, setRedirectUrl] = React.useState("");

    React.useEffect(() => {
        if (typeof window === undefined || !window?.location?.pathname) return;
        setRedirectUrl(window?.location?.pathname);
    }, []);

    return (
        <div className="container mx-auto items-center justify-center w-full flex-1 flex flex-col text-center">
            <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="text-4xl font-bold mb-6"
            >
                No plays for {siteName} on {mapName}
            </motion.h1>
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <LinkButton
                    href={`/create?xurl=${encodeURIComponent(redirectUrl)}`}
                    onClick={() => {
                        const map = Object.keys(sites).find(
                            (key) =>
                                key.toLowerCase() === mapName?.toLowerCase()
                        )!;

                        const site = sites[map as keyof typeof sites].find(
                            (key) =>
                                key.toLowerCase() === siteName?.toLowerCase()
                        )!;

                        setSiteAtom({
                            map,
                            site,
                        });
                    }}
                >
                    Create a Play
                </LinkButton>
            </motion.div>
        </div>
    );
};
