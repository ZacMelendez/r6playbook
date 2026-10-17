import * as React from "react";
import type { Editor } from "@tiptap/react";
import type { toggleVariants } from "@/components/ui/toggle";
import type { VariantProps } from "class-variance-authority";
import { MapEditPopover } from "../map-marker/map-dialog";

interface SectionSix extends VariantProps<typeof toggleVariants> {
    editor: Editor;
}

export const SectionSix: React.FC<SectionSix> = ({ editor }) => {
    return (
        <>
            <MapEditPopover editor={editor} />
        </>
    );
};

SectionSix.displayName = "SectionSix";

export default SectionSix;
