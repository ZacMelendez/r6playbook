"use client";

import { LinkButton } from "@/components/ui/button";

const links: { label: string; href: string }[] = [
    {
        href: "/maps",
        label: "Maps",
    },
    {
        href: "/operators",
        label: "Operators",
    },
    {
        href: "/explore",
        label: "Explore",
    },
];

export const Navigation = () => {
    return (
        <nav className="hidden md:block mx-auto">
            <ul className="flex flex-row space-x-4">
                {links.map(({ label, href }) => (
                    <li key={href}>
                        <LinkButton
                            variant={"ghost"}
                            className="hover:bg-white/10 hover:text-primary-foreground"
                            href={href}
                        >
                            {label}
                        </LinkButton>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
