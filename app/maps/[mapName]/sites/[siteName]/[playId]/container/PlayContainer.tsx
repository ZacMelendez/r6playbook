"use client";

import { userAtom, userFavoritesAtom, userVotesAtom } from "@/lib/atoms/user";
import { useAtomValue } from "jotai";
import dynamic from "next/dynamic";
import { Dispatch, memo, SetStateAction, useEffect, useState } from "react";
import { addVote } from "@/lib/actions/votes";
import { strategyAtom } from "@/lib/atoms/strategies";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Ellipsis, Share, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import sanitizeHtml from "sanitize-html";
import { addFavorite, removeFavorite } from "@/lib/actions/favorites";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { Favorite, Vote } from "@/lib/models";
import { Operators } from "../components/Operators";
import DescriptionContainer from "./DescriptionContainer";
import { motion } from "motion/react";
import { SignInDialog } from "./SignInDialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

const EditPlayDialog = dynamic(
    () =>
        import("../components/EditPlayDialog").then((mod) => ({
            default: mod.EditPlayDialog,
        })),
    { ssr: false }
);

const DeletePlayDialog = dynamic(
    () =>
        import("../components/DeletePlayDialog").then((mod) => ({
            default: mod.DeletePlayDialog,
        })),
    { ssr: false }
);
import { toast } from "sonner";
import moment from "moment";

enum Dialogs {
    edit = "edit",
    delete = "delete",
}

export const MemoizedDescription = memo(DescriptionContainer);

const LikeButtonGroup = ({
    setSignInDialogOpen,
}: {
    setSignInDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const user = useAtomValue(userAtom);
    const userVotes = useAtomValue(userVotesAtom);
    const strategy = useAtomValue(strategyAtom);
    const [userVote, setUserVote] = useState<Vote | null | undefined>(
        userVotes?.find((i) => i.strategy_id === strategy.id)
    );
    const [votes, setVotes] = useState<number>(strategy.votes!);
    const [likeLoading, setLikeLoading] = useState(false);
    const [dislikeLoading, setDislikeLoading] = useState(false);

    const handleVote = async (increment: boolean | null) => {
        if (!user) return;
        if (increment === true) {
            setLikeLoading(true);
        } else if (increment === false) {
            setDislikeLoading(true);
        } else if (increment === null) {
            setLikeLoading(true);
            setDislikeLoading(true);
        }

        try {
            const vote = await addVote(strategy.id, user, userVote, increment);

            if (!vote) return;

            if (vote === "Rate limit exceeded") {
                return toast(
                    "Slow down there bud... wait a bit before trying again"
                );
            }

            let voteChange = 0;
            if (increment === true) {
                voteChange = userVote?.vote_type === -1 ? 2 : 1;
            } else if (increment === false) {
                voteChange = userVote?.vote_type === 1 ? -2 : -1;
            } else {
                voteChange = userVote?.vote_type === 1 ? -1 : 1;
            }

            setVotes((votes) => votes + voteChange);
            setUserVote(vote);
        } catch (err) {
            console.error(err);
        } finally {
            setLikeLoading(false);
            setDislikeLoading(false);
        }
    };

    return (
        <ButtonGroup>
            <Button
                loading={likeLoading}
                disabled={dislikeLoading || likeLoading}
                variant={userVote?.vote_type === 1 ? "default" : "outline"}
                onClick={() => {
                    if (!user) return setSignInDialogOpen(true);
                    handleVote(userVote?.vote_type === 1 ? null : true);
                }}
            >
                <ThumbsUp />
            </Button>
            <Button className="pointer-events-none" variant="outline">
                {votes}
            </Button>
            <Button
                loading={dislikeLoading}
                disabled={dislikeLoading || likeLoading}
                type="button"
                variant={userVote?.vote_type === -1 ? "default" : "outline"}
                onClick={() => {
                    if (!user) return setSignInDialogOpen(true);
                    handleVote(userVote?.vote_type === -1 ? null : false);
                }}
            >
                <ThumbsDown />
            </Button>
        </ButtonGroup>
    );
};

const FavoriteButtonGroup = ({
    setSignInDialogOpen,
}: {
    setSignInDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    const strategy = useAtomValue(strategyAtom);
    const [url, setUrl] = useState<string>("");
    useEffect(() => {
        setUrl(window.location.href);
    }, []);
    const user = useAtomValue(userAtom);
    const userFavorites = useAtomValue(userFavoritesAtom);
    const [userFavorite, setUserFavorite] = useState<
        Favorite | null | undefined
    >(userFavorites?.find((i) => i.item_id === strategy.id));
    const [faveLoading, setFaveLoading] = useState(false);

    const handleFavorite = async () => {
        if (!user) return;
        setFaveLoading(true);
        try {
            if (userFavorite) {
                const result = await removeFavorite(strategy.id, user);
                if (!result) return;
                setUserFavorite(null);
            } else {
                const favorite = await addFavorite(strategy.id, user);
                if (!favorite) return;

                if (favorite === "Rate limit exceeded")
                    return toast(
                        "Slow down there bud... wait a bit before trying again"
                    );
                setUserFavorite(favorite);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setFaveLoading(false);
        }
    };

    return (
        <ButtonGroup>
            <Button
                loading={faveLoading}
                disabled={faveLoading}
                variant={"outline"}
                data-active={userFavorite ? "true" : "false"}
                onClick={() => {
                    if (!user) return setSignInDialogOpen(true);
                    handleFavorite();
                }}
            >
                {userFavorite ? <StarFilledIcon /> : <Star />}
            </Button>
            <Button
                variant={"outline"}
                onClick={async () => {
                    try {
                        await navigator.clipboard.writeText(url);
                        toast("Saved URL to clipboard");
                    } catch {
                        toast("Error", {
                            description: "Failed to save URL to clipboard",
                        });
                    }
                }}
            >
                <Share />
                Share
            </Button>
        </ButtonGroup>
    );
};

export const PlayContainer = () => {
    const user = useAtomValue(userAtom);
    const strategy = useAtomValue(strategyAtom);
    const [signInDialogOpen, setSignInDialogOpen] = useState(false);
    const [dialog, setDialog] = useState<string | undefined>();
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="container mx-auto">
            <SignInDialog
                open={signInDialogOpen}
                setOpen={setSignInDialogOpen}
            />
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
            >
                <div className="w-full flex flex-row items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-4xl font-bold">{strategy.title}</h1>
                        <a
                            className="text-lg font-semibold text-muted-foreground hover:text-white transition-colors"
                            href={`/profile/${encodeURIComponent(
                                strategy.user?.username || ""
                            )}`}
                        >
                            {strategy.user?.username}
                        </a>
                        <p className="text-muted-foreground">
                            Last updated:{" "}
                            {moment(strategy.updated_at).format(
                                "MM/DD/YYYY HH:mm:ss z"
                            )}
                        </p>
                    </div>
                    {strategy.user_id === user?.id && (
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size={"icon"} variant={"ghost"}>
                                        <Ellipsis />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DialogTrigger
                                        asChild
                                        onClick={() => setDialog(Dialogs.edit)}
                                    >
                                        <DropdownMenuItem>
                                            Edit
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DialogTrigger
                                        asChild
                                        onClick={() =>
                                            setDialog(Dialogs.delete)
                                        }
                                    >
                                        <DropdownMenuItem>
                                            Delete
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {strategy.user_id === user?.id &&
                                (dialog === Dialogs.edit ? (
                                    <EditPlayDialog
                                        onOpenChange={setDialogOpen}
                                        data={{
                                            id: strategy.id,
                                            title: strategy.title,
                                            description: strategy.description,
                                            map: strategy.map,
                                            operators: strategy.operators,
                                            side: strategy.side as any,
                                            site: strategy.site,
                                        }}
                                    />
                                ) : (
                                    <DeletePlayDialog
                                        onOpenChange={setDialogOpen}
                                    />
                                ))}
                        </Dialog>
                    )}
                </div>
                <div className="flex flex-row gap-4">
                    <LikeButtonGroup
                        setSignInDialogOpen={setSignInDialogOpen}
                    />
                    <FavoriteButtonGroup
                        setSignInDialogOpen={setSignInDialogOpen}
                    />
                </div>
                <Operators />
            </motion.div>
            <MemoizedDescription
                htmlContent={sanitizeHtml(strategy.description, {
                    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                        "img",
                        "iframe",
                        "react-component",
                    ]),
                    allowedAttributes: {
                        iframe: ["src", "width", "height", "allowfullscreen"],
                        "react-component": ["url", "markers"],
                    },
                    allowedIframeHostnames: [
                        "www.youtube.com",
                        "www.youtube-nocookie.com",
                    ],
                })}
            />
        </div>
    );
};
