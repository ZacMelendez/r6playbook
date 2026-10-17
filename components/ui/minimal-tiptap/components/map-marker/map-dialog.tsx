import * as React from "react";
import type { Editor } from "@tiptap/react";
import type { VariantProps } from "class-variance-authority";
import type { toggleVariants } from "@/components/ui/toggle";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Root } from "@radix-ui/react-visually-hidden";
import { ToolbarButton } from "../toolbar-button";
import { Map } from "lucide-react";
import { SiteSelect } from "./components/site-select";
import { InteractiveMap } from "./components/interactive-map";
import { Marker } from ".";

interface MapEditPopoverProps extends VariantProps<typeof toggleVariants> {
    editor: Editor;
    map?: string;
    site?: string;
    markers?: Marker[];
}

export const MapEditPopover = ({
    editor,
    size,
    variant,
    map,
    site,
    markers,
}: MapEditPopoverProps) => {
    const [open, setOpen] = React.useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <ToolbarButton
                    isActive={editor.isActive("r6-map")}
                    tooltip="Map Strategy"
                    aria-label="Insert map strategy"
                    size={size}
                    variant={variant}
                >
                    <Map className="size-5" />
                </ToolbarButton>
            </DialogTrigger>
            <DialogContent className="w-full min-w-[90vw]">
                <Root>
                    <DialogTitle>Add Interactive Map</DialogTitle>
                    <DialogDescription>
                        Dialog to add description
                    </DialogDescription>
                </Root>
                <SiteSelect />
                <InteractiveMap
                    onSave={(item) => {
                        editor
                            .chain()
                            .insertContent({
                                type: "reactComponent",
                                toJSON: () => {
                                    return {
                                        type: "map-marker",
                                        attrs: {
                                            url: item.url,
                                            markers: item.markers,
                                        },
                                    };
                                },
                                attrs: {
                                    url: item.url,
                                    markers: JSON.stringify(item.markers),
                                },
                            })
                            .run();
                        setOpen(false);
                    }}
                    map={map}
                    site={site}
                    markers={markers}
                />
            </DialogContent>
        </Dialog>
    );
};
