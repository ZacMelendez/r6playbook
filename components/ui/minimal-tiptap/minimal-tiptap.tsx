import * as React from "react";
import "./styles/index.css";

import type { Content, Editor } from "@tiptap/react";
import type { UseMinimalTiptapEditorProps } from "./hooks/use-minimal-tiptap";
import { EditorContent } from "@tiptap/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SectionOne } from "./components/section/one";
import { SectionTwo } from "./components/section/two";
import { SectionFour } from "./components/section/four";
import { SectionFive } from "./components/section/five";
import { LinkBubbleMenu } from "./components/bubble-menu/link-bubble-menu";
import { useMinimalTiptapEditor } from "./hooks/use-minimal-tiptap";
import { MeasuredContainer } from "./components/measured-container";
import { SectionSix } from "./components/section/six";

export interface MinimalTiptapProps
    extends Omit<UseMinimalTiptapEditorProps, "onUpdate"> {
    value?: Content;
    onChange?: (value: Content) => void;
    className?: string;
    editorContentClassName?: string;
    sections?: number[];
}

const Toolbar = ({
    editor,
    sections = [1, 2, 4, 5, 6],
}: {
    editor: Editor;
    sections: MinimalTiptapProps["sections"];
}) => (
    <div className="shrink-0 overflow-x-auto border-b border-border p-2">
        <div className="flex w-max items-center gap-px">
            {sections.includes(1) && (
                <>
                    <SectionOne editor={editor} activeLevels={[3, 4, 5, 6]} />
                </>
            )}
            {sections.includes(2) && (
                <>
                    <Separator orientation="vertical" className="mx-2 h-7" />
                    <SectionTwo
                        editor={editor}
                        activeActions={[
                            "bold",
                            "italic",
                            "underline",
                            "strikethrough",
                            "clearFormatting",
                        ]}
                        mainActionCount={5}
                    />
                </>
            )}
            {sections.includes(4) && (
                <>
                    <Separator orientation="vertical" className="mx-2 h-7" />
                    <SectionFour
                        editor={editor}
                        activeActions={["orderedList", "bulletList"]}
                        mainActionCount={2}
                    />
                </>
            )}

            {sections.includes(5) && (
                <>
                    <Separator orientation="vertical" className="mx-2 h-7" />
                    <SectionFive
                        editor={editor}
                        activeActions={["blockquote", "horizontalRule"]}
                        mainActionCount={2}
                    />
                </>
            )}

            {sections.includes(6) && (
                <>
                    <Separator orientation="vertical" className="mx-2 h-7" />
                    <SectionSix editor={editor} />
                </>
            )}
        </div>
    </div>
);

export const MinimalTiptapEditor = React.forwardRef<
    HTMLDivElement,
    MinimalTiptapProps
>(
    (
        {
            value,
            onChange,
            className,
            editorContentClassName,
            sections,
            ...props
        },
        ref
    ) => {
        const editor = useMinimalTiptapEditor({
            value,
            onUpdate: onChange,
            content: value,
            ...props,
        });

        React.useEffect(() => {
            if (editor?.getHTML() !== value) {
                editor?.commands.setContent(value || "");
            }
        }, [value, editor]);

        if (!editor) {
            return (
                <MeasuredContainer
                    as="div"
                    name="editor"
                    ref={ref}
                    className={cn(
                        "flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-primary animate-pulse",
                        className
                    )}
                />
            );
        }

        return (
            <MeasuredContainer
                as="div"
                name="editor"
                ref={ref}
                className={cn(
                    "flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-primary",
                    className
                )}
            >
                <Toolbar editor={editor} sections={sections} />
                <EditorContent
                    editor={editor}
                    className={cn(
                        "minimal-tiptap-editor",
                        editorContentClassName
                    )}
                />
                <LinkBubbleMenu editor={editor} />
            </MeasuredContainer>
        );
    }
);

MinimalTiptapEditor.displayName = "MinimalTiptapEditor";

export default MinimalTiptapEditor;
