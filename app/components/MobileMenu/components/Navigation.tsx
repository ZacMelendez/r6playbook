"use client";

import { LinkButton } from "@/components/ui/button";
import { useSetAtom } from "jotai";
import { menuOpenAtom } from "..";

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
    const setIsMenuOpen = useSetAtom(menuOpenAtom);
    return (
        <nav>
            <ul className="flex flex-col space-y-4 items-center justify-center">
                {links.map(({ label, href }) => (
                    <li
                        key={href}
                        onClick={() => {
                            setTimeout(() => {
                                setIsMenuOpen(false);
                            }, 500);
                        }}
                    >
                        <LinkButton
                            variant={"ghost"}
                            className="hover:bg-white/10 hover:text-primary-foreground text-lg font-bold px-4 py-2 box-border h-fit"
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
