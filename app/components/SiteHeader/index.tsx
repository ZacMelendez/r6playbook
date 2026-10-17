"use server";

import * as React from "react";
import { SiteLogo } from "./components/SiteLogo";
import { UserActions } from "./components/UserActions";
import { Navigation } from "./components/Navigation";
import { MobileMenuButton } from "../MobileMenu";
import { MobileMenuServer } from "../MobileMenu/MobileMenuServer";

export async function SiteHeader() {
    return (
        <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
            <div className="flex h-14 items-center px-4 md:px-16 relative">
                <SiteLogo />
                <Navigation />
                <UserActions />
                <MobileMenuServer />
                <MobileMenuButton />
            </div>
        </header>
    );
}
