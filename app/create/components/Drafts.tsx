"use client";

import { PlayFormSchema } from "@/app/create/components/PlayForm";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deleteStrategy, SingleStrategy } from "@/lib/actions/strategies";
import { activeDraftAtom, draftsAtom } from "@/lib/atoms/strategies";
import { userAtom } from "@/lib/atoms/user";
import { cn } from "@/lib/utils";
import { useAtom, useAtomValue } from "jotai";
import { SquarePen, Trash } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export const Drafts = () => {
    const [drafts, setDrafts] = useAtom(draftsAtom);
    const [open, setOpen] = useState(false);
    const [activeDraft, setActiveDraft] = useAtom(activeDraftAtom);
    const methods = useFormContext<PlayFormSchema>();
    const user = useAtomValue(userAtom);

    const removeDraft = async (strategy: SingleStrategy) => {
        if (!user) return;
        deleteStrategy(strategy, user).then(() => {
            setDrafts((drafts) => drafts.filter((i) => i.id !== strategy.id));
        });
    };

    if (drafts.length === 0) {
        return null;
    }

    return (
        <Dialog onOpenChange={setOpen} open={open}>
            <DialogTrigger asChild>
                <Button type="button" className=" absolute top-4 right-4">
                    <div className="hidden sm:block">Select Draft</div>
                    <SquarePen className="sm:hidden block" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Drafts</DialogTitle>
                    <DialogDescription>
                        Choose a draft to resume working on
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="w-full h-[300px]">
                    <ul className="divide-y divide-gray-200/10">
                        {drafts.map((draft) => (
                            <li
                                key={draft.id}
                                className={cn(
                                    "hover:bg-white/10 cursor-pointer px-4 py-2 transition-colors flex flex-row justify-between items-center",
                                    activeDraft?.id === draft.id &&
                                        "opacity-25 pointer-events-none"
                                )}
                                onClick={() => {
                                    methods.reset({
                                        description: draft.description,
                                        id: draft.id,
                                        map: draft.map,
                                        title: draft.title,
                                        is_draft: draft.is_draft!,
                                        operators: draft.operators,
                                        side: draft.side as any,
                                        site: draft.site,
                                    });
                                    setActiveDraft(draft);
                                    setOpen(false);
                                }}
                            >
                                <div className="flex flex-col gap-1">
                                    <p className="font-bold overflow-ellipsis">
                                        {draft.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Last updated:{" "}
                                        {moment(draft.updated_at || "").format(
                                            "MMM D, YYYY"
                                        )}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    className="hover:bg-destructive group"
                                    variant={"outline"}
                                    size="icon"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeDraft(draft);
                                    }}
                                >
                                    <Trash className="text-destructive group-hover:text-white" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"outline"} type="button">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
