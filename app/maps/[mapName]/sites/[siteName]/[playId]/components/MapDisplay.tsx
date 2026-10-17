import { NodeViewWrapper } from "@tiptap/react";
import "./Map.css";
import React, { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { markerTypes } from "@/lib/icons/gadgets";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ZPPControls } from "@/components/map-controls";

interface Marker {
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

export const DisplayMap = (props: DisplayMapProps) => {
    const { url, markers } = props;
    const [scale, setScale] = useState(1);

    return (
        <NodeViewWrapper className="r6-map-marker">
            <TooltipProvider>
                <div className="relative w-full h-[600px] border rounded-lg overflow-hidden">
                    {
                        <TransformWrapper
                            onZoom={(newScale) =>
                                setScale(newScale.state.scale)
                            }
                            onTransformed={(newScale) =>
                                setScale(newScale.state.scale)
                            }
                            onPinching={(newScale) =>
                                setScale(newScale.state.scale)
                            }
                        >
                            <ZPPControls />
                            <TransformComponent
                                wrapperClass="!w-full !h-full"
                                contentClass="!w-full !h-full cursor-move"
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
                                                            top: `${
                                                                100 * marker.y
                                                            }%`,
                                                            left: `${
                                                                100 * marker.x
                                                            }%`,
                                                            transform: `translate(-50%, -50%) scale(${
                                                                1 / scale
                                                            })`,
                                                            transformOrigin:
                                                                "center",
                                                        }}
                                                    />
                                                );
                                            })}
                                    </div>
                                </div>
                            </TransformComponent>
                        </TransformWrapper>
                    }
                </div>
            </TooltipProvider>
        </NodeViewWrapper>
    );
};
