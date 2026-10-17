import { StrategyList } from "./components/StrategyList";
import { getSiteStrategies } from "@/lib/actions/strategies";
import { parseMapName, parseSiteName } from "@/lib/string";
import { NoPlaysFound } from "./components/NoPlaysFound";
import { sites } from "@/lib/constants";
import { Vote } from "@/lib/models";
import { getUserVotesForStrategies } from "@/lib/actions/votes";
import { User } from "@supabase/supabase-js";
import { getUserSession } from "@/lib/actions/user";
import { userVotesAtom } from "@/lib/atoms/user";
import { HydrationBoundary } from "jotai-ssr";
import { strategiesAtom } from "@/lib/atoms/strategies";
import { Metadata } from "next";

export const revalidate = 300;

type Props = {
    params: Promise<{ mapName: string; siteName: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const pathParams = await params;
    return {
        title: `R6S - ${parseMapName(pathParams.mapName)} - ${parseSiteName(
            pathParams.siteName
        )} Strategies`,
        description:
            "Find advanced strategies/setups for your favorite Rainbow 6 Siege maps",
        openGraph: {
            description:
                "Find advanced strategies/setups for your favorite Rainbow 6 Siege maps",
            images: [
                "https://res.cloudinary.com/drmatz1gd/image/upload/v1732851101/r6playbook/r6pb_og_w6jnxt.png",
            ],
        },
    };
}

export default async function Index({ params }: Props) {
    const pathParams = await params;
    const mapName = parseMapName(pathParams.mapName);
    const siteName = parseSiteName(pathParams.siteName);

    const map = Object.keys(sites).find(
        (key) => key.toLowerCase() === mapName?.toLowerCase()
    )!;

    const site = sites[map as keyof typeof sites].find(
        (key) => key.toLowerCase() === siteName?.toLowerCase()
    )!;

    const strategies = await getSiteStrategies({
        map,
        site,
    });

    if (!strategies || strategies.length === 0) {
        return <NoPlaysFound mapName={map} siteName={site} />;
    }

    let votes: Vote[] = [];
    let user: User | undefined | null = null;

    try {
        user = await getUserSession();
        if (user?.id) {
            votes = await getUserVotesForStrategies(
                user.id,
                strategies.map((s) => s.id)
            );
        }
    } catch (e) {
        console.error(e);
    }

    return (
        <HydrationBoundary
            hydrateAtoms={[
                [userVotesAtom, votes],
                [strategiesAtom, strategies],
            ]}
        >
            <div className="container mx-auto">
                <h1 className="text-4xl font-bold mb-6">
                    Plays for {map} on {site}
                </h1>

                <StrategyList />
            </div>
        </HydrationBoundary>
    );
}
