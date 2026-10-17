import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import { Toaster } from "@/components/ui/sonner";
import { Provider } from "jotai";
import { ViewTransitions } from "next-view-transitions";
import { AuthListener } from "@/lib/supabase/listeners";
import { Analytics } from "@vercel/analytics/react";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const viewport: Viewport = {
    themeColor: "#16181d",
};

export const metadata: Metadata = {
    title: "Rainbow 6 Playbook",
    description:
        "Your ultimate resource for advanced Rainbow 6 Siege strategies.",

    openGraph: {
        description:
            "Your ultimate resource for advanced Rainbow 6 Siege strategies.",
        images: [
            "https://res.cloudinary.com/drmatz1gd/image/upload/v1732851101/r6playbook/r6pb_og_w6jnxt.png",
        ],
    },
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ViewTransitions>
            <Provider>
                <html lang="en" className="h-screen w-screen max-w-full">
                    <body
                        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full flex flex-col`}
                    >
                        <SiteHeader />
                        <main className="flex-1 box-border mt-14">
                            {children}
                            <SiteFooter />
                        </main>
                        <Toaster
                            closeButton
                            toastOptions={{
                                classNames: {
                                    closeButton: "text-primary",
                                },
                            }}
                        />
                        <Analytics />
                        <SpeedInsights />
                    </body>
                </html>
                <AuthListener />
            </Provider>
        </ViewTransitions>
    );
}
