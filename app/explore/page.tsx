import { ResponsiveFilter } from "@/components/strategy-filter";
import InfiniteScrollList from "./components/InfiniteScroll";
import { getInfiniteSrategies, SiteStrategy } from "@/lib/actions/strategies";
import { HydrationBoundary } from "jotai-ssr";
import { strategiesAtom } from "@/lib/atoms/strategies";
import { Metadata } from "next";
import filterAtom from "@/lib/atoms/filter";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Rainbow 6 Playbook - Explore",
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

export default async function Index() {
    let strategies: SiteStrategy[] = [];

    try {
        const result = await getInfiniteSrategies(0);
        strategies = result || [];
    } catch {
        strategies = [];
    }

    return (
        <div className="container mx-auto px-8 pb-8">
            <ResponsiveFilter />
            <HydrationBoundary
                hydrateAtoms={[
                    [strategiesAtom, strategies],
                    [
                        filterAtom,
                        {
                            operators: [],
                            map: undefined,
                            site: undefined,
                        },
                    ],
                ]}
            >
                <InfiniteScrollList />
            </HydrationBoundary>
        </div>
    );
}
