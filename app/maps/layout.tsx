import React from "react";
import { MapBreadcrumbs } from "./components/Breadcrumbs";

export default async function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="container mx-auto px-4 flex flex-col min-h-full">
            <MapBreadcrumbs />
            <div className="flex-1 mb-12 flex flex-col">{children}</div>
        </div>
    );
}
