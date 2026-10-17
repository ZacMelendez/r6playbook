import { MinusIcon, PlusIcon, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import { useControls } from "react-zoom-pan-pinch";

export const ZPPControls = () => {
    const { resetTransform, zoomIn, zoomOut } = useControls();

    return (
        <ButtonGroup className="absolute top-3 right-3 z-50">
            <Button variant={"outline"} type="button" onClick={() => zoomIn()}>
                <PlusIcon />
            </Button>
            <Button variant={"outline"} type="button" onClick={() => zoomOut()}>
                <MinusIcon />
            </Button>
            <Button
                variant={"outline"}
                type="button"
                onClick={() => resetTransform()}
            >
                <RotateCcw />
            </Button>
        </ButtonGroup>
    );
};
