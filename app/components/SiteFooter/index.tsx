import * as React from "react";
import { Navigation } from "./components/Navigation";

export async function SiteFooter() {
    return (
        <header className="w-full">
            <div className="flex flex-row h-14 items-center justify-center">
                <Navigation />
            </div>
        </header>
    );
}
