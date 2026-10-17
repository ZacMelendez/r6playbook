"use client";

import { LinkButton } from "@/components/ui/button";

const links: { label: string; href: string }[] = [
    {
        href: "/privacy",
        label: "Privacy Policy",
    },
    {
        href: "/tos",
        label: "Terms of Service",
    },
    {
        href: "/feedback",
        label: "Leave Feedback",
    },
];

export const Navigation = () => {
    return (
        <nav className="hidden sm:block">
            <ul className="flex flex-row space-x-4">
                {links.map(({ label, href }) => (
                    <li key={href}>
                        <LinkButton
                            variant={"ghost"}
                            className="hover:bg-transparent hover:underline text-muted-foreground hover:text-primary-foreground transition-all"
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
