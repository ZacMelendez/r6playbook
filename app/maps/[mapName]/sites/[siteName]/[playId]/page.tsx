import { User } from "@supabase/supabase-js";
import { getStrategy } from "@/lib/actions/strategies";
import { PlayContainer } from "./container/PlayContainer";
import { Favorite, Vote } from "@/lib/models";
import { getUserVotesForStrategies } from "@/lib/actions/votes";
import { getUserFavoritesForStrategies } from "@/lib/actions/favorites";
import { getUserSession } from "@/lib/actions/user";
import { HydrationBoundary } from "jotai-ssr";
import { userFavoritesAtom, userVotesAtom } from "@/lib/atoms/user";
import { strategyAtom } from "@/lib/atoms/strategies";
import { Metadata } from "next";
import { parseMapName, parseSiteName } from "@/lib/string";
import { notFound } from "next/navigation";

export const revalidate = 300;

type Props = {
    params: Promise<{
        mapName: string;
        siteName: string;
        playId: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const pathParams = await params;
    const strategy = await getStrategy(pathParams.playId);
    const mapLabel = parseMapName(pathParams.mapName);
    const siteLabel = parseSiteName(pathParams.siteName);
    const title = strategy?.title
        ? `R6S - ${strategy.title} (${mapLabel} / ${siteLabel})`
        : `R6S - ${mapLabel} - ${siteLabel} Strategy`;
    const description =
        strategy?.description?.slice(0, 160) ||
        "Find advanced strategies/setups for your favorite Rainbow 6 Siege maps";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                "https://res.cloudinary.com/drmatz1gd/image/upload/v1732851101/r6playbook/r6pb_og_w6jnxt.png",
            ],
        },
    };
}

export default async function Index({ params }: Props) {
    const pathParams = await params;
    const strategy = await getStrategy(pathParams.playId);

    if (!strategy) {
        return notFound();
    }

    let votes: Vote[] = [];
    let favorites: Favorite[] = [];
    let user: User | undefined | null = null;

    try {
        user = await getUserSession();
        if (user?.id) {
            votes = await getUserVotesForStrategies(user.id, [
                pathParams.playId,
            ]);
            favorites = await getUserFavoritesForStrategies(user.id, [
                pathParams.playId,
            ]);
        }
    } catch (e) {
        console.error(e);
    }

    return (
        <HydrationBoundary
            hydrateAtoms={[
                [userVotesAtom, votes],
                [userFavoritesAtom, favorites],
                [strategyAtom, strategy],
            ]}
        >
            <PlayContainer />
        </HydrationBoundary>
    );
}
