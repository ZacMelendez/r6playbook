/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect, HTMLAttributes } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { RotateCcw, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DraggableMarker } from "./draggable-marker";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { markerTypes } from "@/lib/icons/gadgets";
import { useAtomValue } from "jotai";
import { siteAtom } from "../atoms/siteAtom";
import { siteImages } from "@/lib/constants";
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

interface MoveableMarkerProps extends HTMLAttributes<HTMLDivElement> {
    marker: Marker;
    className?: string;
    style?: HTMLAttributes<HTMLDivElement>["style"];
    removeMarker: (id: number) => void;
}

function MoveableMarker({
    marker,
    removeMarker,
    className,
    ...props
}: MoveableMarkerProps) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "marker",
        item: { type: marker.type, id: marker.id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const Icon = markerTypes.find((i) => i.name === marker.type)!.icon;

    return isDragging ? null : (
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
                <div
                    className={cn(
                        "w-full h-full flex items-center justify-center rounded-sm bg-opponents p-1 group relative",
                        className
                    )}
                    ref={drag as any}
                    {...props}
                >
                    <Icon className="text-white h-full w-full" />
                    <Button
                        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 size-5 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                        variant={"destructive"}
                        size={"icon"}
                        type="button"
                        onClick={() => removeMarker(marker.id)}
                    >
                        <X />
                    </Button>
                </div>
            </TooltipTrigger>
            <TooltipContent>{marker.type}</TooltipContent>
        </Tooltip>
    );
}

function MapMarker({
    onSave,
    // map: defaultMap,
    // site: defaultSite,
    markers: defaultMarkers,
}: {
    onSave?: (item: {
        site: {
            map?: string;
            site?: string;
        };
        url: string | null;
        markers: Marker[];
    }) => void;
    map?: string;
    site?: string;
    markers?: Marker[];
}) {
    const site = useAtomValue(siteAtom);

    const [url, setUrl] = useState<string | null>(null);

    const [markers, setMarkers] = useState<Marker[]>(defaultMarkers || []);
    const [nextId, setNextId] = useState(1);
    const dropRef = useRef<HTMLImageElement>(null);
    const [scale, setScale] = useState(1);

    const [, drop] = useDrop(
        () => ({
            accept: "marker",
            drop: (
                item: { type: string; id?: number; x?: number; y?: number },
                monitor
            ) => {
                const imgElement = dropRef.current;

                if (imgElement) {
                    const bounds = imgElement.getBoundingClientRect();
                    const { x, y } = monitor.getClientOffset() || {
                        x: 0,
                        y: 0,
                    };
                    const markerX = (x - bounds.left) / bounds.width;
                    const markerY = (y - bounds.top) / bounds.height;

                    if (item.id) {
                        setMarkers((prevMarkers) =>
                            prevMarkers.map((m) =>
                                m.id === item.id
                                    ? { ...m, x: markerX, y: markerY }
                                    : m
                            )
                        );
                    } else {
                        setMarkers((prevMarkers) => [
                            ...prevMarkers,
                            {
                                id: nextId,
                                x: markerX,
                                y: markerY,
                                type: item.type,
                            },
                        ]);
                        setNextId((prevId) => prevId + 1);
                    }
                }
            },
        }),
        [nextId, dropRef]
    );

    const removeMarker = (id: number) =>
        setMarkers(markers.filter((m) => m.id !== id));

    const saveMap = () => {
        const info = { site, url, markers };
        if (onSave) onSave(info);
    };

    const resetMarkers = () => {
        setMarkers([]);
        setNextId(1);
    };

    useEffect(() => {
        resetMarkers();
        if (!site?.map || !site?.site) return setUrl(null);
        setUrl(siteImages[site?.map][site?.site]);
    }, [site]);

    drop(dropRef);

    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center justify-between border p-2 rounded-t-lg">
                <div className="flex flex-row gap-2">
                    <TooltipProvider>
                        {markerTypes
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map(({ name, icon }) => (
                                <DraggableMarker
                                    key={name}
                                    type={name}
                                    icon={icon}
                                />
                            ))}
                    </TooltipProvider>
                </div>
                <div className="flex flex-row gap-1">
                    <Button
                        className="ml-auto hover:bg-white/20 hover:text-white"
                        variant={"ghost"}
                        size={"icon"}
                        onClick={resetMarkers}
                    >
                        <RotateCcw />
                    </Button>
                    <Button
                        className="hover:bg-white/20 hover:text-white"
                        size={"icon"}
                        variant={"ghost"}
                        onClick={saveMap}
                    >
                        <Save />
                    </Button>
                </div>
            </div>
            <div className="relative w-full h-[600px] border border-t-0 rounded-b-lg overflow-hidden">
                {url ? (
                    <TransformWrapper
                        onZoom={({ state: { scale } }) => setScale(scale)}
                        onPinching={({ state: { scale } }) => setScale(scale)}
                        onTransformed={({ state: { scale } }) =>
                            setScale(scale)
                        }
                    >
                        <ZPPControls />
                        <TransformComponent
                            wrapperClass="!w-full !h-full"
                            contentClass="!w-full !h-full cursor-move"
                        >
                            <div className="h-full w-full flex items-center justify-center">
                                <div
                                    className="w-3/4 h-auto relative"
                                    ref={dropRef}
                                >
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
                                                <MoveableMarker
                                                    key={marker.id}
                                                    marker={marker}
                                                    removeMarker={removeMarker}
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
                                                    onMouseDown={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                />
                                            );
                                        })}
                                </div>
                            </div>
                        </TransformComponent>
                    </TransformWrapper>
                ) : (
                    <div className="flex items-center justify-center w-full h-full">
                        No site selected
                    </div>
                )}
            </div>
        </div>
    );
}

export function InteractiveMap({
    onSave,
    map,
    site,
    markers,
}: {
    onSave?: (item: {
        site: {
            map?: string;
            site?: string;
        };
        url: string | null;
        markers: Marker[];
    }) => void;
    map?: string;
    site?: string;
    markers?: Marker[];
}) {
    return (
        <DndProvider backend={HTML5Backend}>
            <MapMarker
                map={map}
                site={site}
                markers={markers}
                onSave={onSave}
            />
        </DndProvider>
    );
}
