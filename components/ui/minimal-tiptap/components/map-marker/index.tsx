import { Node, NodeViewRendererProps, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import React, { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { markerTypes } from "@/lib/icons/gadgets";
import { ZPPControls } from "@/components/map-controls";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface Marker {
    id: number;
    x: number;
    y: number;
    type: string;
}

function MapMarker({
    marker,
    className,
    ...props
}: { marker: Marker } & React.HTMLAttributes<HTMLDivElement>) {
    const Icon = markerTypes.find((i) => i.name === marker.type)?.icon;

    if (!Icon) return null;

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
                <div
                    className={cn(
                        "w-full h-full flex items-center justify-center rounded-sm bg-opponents p-1 group relative",
                        className
                    )}
                    {...props}
                >
                    <Icon className="text-white h-full w-full" />
                </div>
            </TooltipTrigger>
            <TooltipContent>{marker.type}</TooltipContent>
        </Tooltip>
    );
}

interface DisplayMapProps {
    url: string;
    markers: Marker[];
}

export const DisplayMap = (props: NodeViewRendererProps) => {
    const {
        node: { attrs },
    } = props;
    const url =
        (attrs as DisplayMapProps)?.url ||
        "https://res.cloudinary.com/drmatz1gd/image/upload/v1733443125/r6playbook/bank/tellers_archives_fy7mso.png";

    const markers = JSON.parse(
        attrs?.markers || "[]"
    ) as DisplayMapProps["markers"];

    const [scale, setScale] = useState(1);
    // const setSite = useSetAtom(siteAtom);

    return (
        <NodeViewWrapper className="r6-map-marker">
            <div className="relative w-full h-[600px] border rounded-lg overflow-hidden">
                <TransformWrapper
                    onZoom={(newScale) => setScale(newScale.state.scale)}
                    onTransformed={(newScale) => setScale(newScale.state.scale)}
                >
                    {/* <Button
                        type="button"
                        className="absolute left-3 top-3 z-50"
                        size={"icon"}
                        variant={"outline"}
                        onClick={() => {
                            setSite((site) => ({ ...site }));
                        }}
                    >
                        <Pencil />
                    </Button> */}
                    <ZPPControls />
                    <TransformComponent
                        wrapperClass="!w-full !h-full"
                        contentClass="!w-full !h-full"
                    >
                        <div className="h-full w-full relative flex items-center justify-center">
                            <div className="w-3/4 h-auto relative">
                                <img
                                    src={url}
                                    width="100%"
                                    height="auto"
                                    alt="test"
                                />
                                {markers
                                    .sort((a, b) =>
                                        a.type.localeCompare(b.type)
                                    )
                                    .map((marker) => {
                                        return (
                                            <MapMarker
                                                key={marker.id}
                                                marker={marker}
                                                className="absolute size-8"
                                                style={{
                                                    top: `${100 * marker.y}%`,
                                                    left: `${100 * marker.x}%`,
                                                    transform: `translate(-50%, -50%) scale(${
                                                        1 / scale
                                                    })`,
                                                    transformOrigin: "center",
                                                }}
                                            />
                                        );
                                    })}
                            </div>
                        </div>
                    </TransformComponent>
                </TransformWrapper>
            </div>
        </NodeViewWrapper>
    );
};

export const DisplayMapNode = Node.create({
    name: "reactComponent",
    group: "block",
    atom: true,
    addAttributes() {
        return {
            url: {
                default: "",
            },
            markers: {
                default: "[]",
            },
        };
    },
    parseHTML() {
        return [
            {
                tag: "react-component",
            },
        ];
    },
    renderHTML({ HTMLAttributes }) {
        return ["react-component", mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(DisplayMap);
    },
});
