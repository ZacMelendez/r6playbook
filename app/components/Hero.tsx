"use client";

import { SiteSelect } from "./SiteSelect";
import { LinkButton } from "@/components/ui/button";

export const Hero = () => {
    return (
        <>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-foreground mb-4">
                Rainbow 6 Playbook
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Your ultimate resource for advanced Rainbow 6 Siege strategies,
                tactics, and team compositions. Elevate your game to the next
                level.
            </p>
            <div className="w-full">
                <SiteSelect />
            </div>
            <div className="w-full md:w-fit mt-8 max-w-3xl mx-auto flex flex-col gap-4">
                <LinkButton
                    aria-label="view all maps button"
                    variant={"outline"}
                    className="w-full block sm:hidden"
                    href="/maps"
                >
                    View All Maps
                </LinkButton>
                <LinkButton
                    aria-label="view all strategies button"
                    className="w-full"
                    href="/explore"
                >
                    Explore Strategies
                </LinkButton>
            </div>
        </>
    );
};
