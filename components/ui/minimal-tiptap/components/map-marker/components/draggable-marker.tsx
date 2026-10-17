import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface DraggableMarkerProps {
    type: string;
    icon: ({
        fill,
        ...props
    }: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
    className?: string;
}

export function DraggableMarker({
    type,
    icon: Icon,
    className,
}: DraggableMarkerProps) {
    const dragRef = useRef<HTMLDivElement>(null);
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "marker",
        item: { type },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    drag(dragRef);

    return (
        <Tooltip delayDuration={0}>
            <TooltipTrigger>
                <div
                    ref={dragRef}
                    className={cn(
                        className,
                        "bg-transparent cursor-move flex items-center p-1 size-6",
                        isDragging && "cursor-grab"
                    )}
                >
                    <Icon fill={"white"} className="h-full w-full" />
                </div>
            </TooltipTrigger>
            {!isDragging && <TooltipContent>{type}</TooltipContent>}
        </Tooltip>
    );
}
