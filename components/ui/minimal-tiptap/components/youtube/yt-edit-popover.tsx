import * as React from "react";
import type { Editor } from "@tiptap/react";
import type { VariantProps } from "class-variance-authority";
import type { toggleVariants } from "@/components/ui/toggle";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { ToolbarButton } from "../toolbar-button";
import { YoutubeEditBlock } from "./yt-edit-block";
import { Youtube } from "@/lib/icons/Youtube";

interface LinkEditPopoverProps extends VariantProps<typeof toggleVariants> {
    editor: Editor;
}

const YoutubeEditPopover = ({
    editor,
    size,
    variant,
}: LinkEditPopoverProps) => {
    const [open, setOpen] = React.useState(false);

    const { from, to } = editor.state.selection;
    const text = editor.state.doc.textBetween(from, to, " ");

    const onSetLink = React.useCallback(
        (url: string) => {
            editor.commands.setYoutubeVideo({
                src: url,
                width: 720,
                height: 480,
            });

            editor.commands.enter();
        },
        [editor]
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <ToolbarButton
                    isActive={editor.isActive("youtube")}
                    tooltip="Youtube Video"
                    aria-label="Insert youtube video"
                    disabled={editor.isActive("codeBlock")}
                    size={size}
                    variant={variant}
                >
                    <Youtube className="size-5" />
                </ToolbarButton>
            </PopoverTrigger>
            <PopoverContent
                className="w-full min-w-80"
                align="end"
                side="bottom"
            >
                <YoutubeEditBlock onSave={onSetLink} defaultText={text} />
            </PopoverContent>
        </Popover>
    );
};

export { YoutubeEditPopover };
