import { getOperatorColor, type OperatorSide } from "@/lib/constants/operators-meta";
import { Badge } from "./ui/badge";

export const OperatorBadge = ({
    operator,
    index,
    side,
}: {
    operator: string;
    index: number;
    side: OperatorSide;
}) => {
    const color = getOperatorColor(side, operator);

    return (
        <Badge
            className="rounded-full bg-transparent hover:bg-white/20 border "
            key={`${operator}-${index}`}
            style={{
                borderColor: color || "white",
            }}
        >
            {operator}
        </Badge>
    );
};
