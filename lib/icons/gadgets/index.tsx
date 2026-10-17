import { BulletproofCamera } from "./BulletproofCamera";
import { CastleBarricade } from "./CastleBarricade";
import { BarbedWire } from "./BarbedWire";
import { Mira } from "./Mira";
import { NitroCell } from "./NitroCell";
import { ProximityAlarm } from "./ProximityAlarm";
import { Reinforcement } from "./Reinforcement";
import { Electroclaw } from "./Electroclaw";
import { ShockWire } from "./ShockWire";
import { ValkyrieCamera } from "./ValkyrieCamera";
import { Barricade } from "./Barricade";
import { Rotate } from "./Rotate";
import { HeadHoles } from "./HeadHoles";
import { FootHoles } from "./FootHoles";

export const markerTypes: {
    name: string;
    icon: ({
        fill,
        ...props
    }: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
}[] = [
    {
        name: "Barricade",
        icon: Barricade,
    },
    {
        name: "Bulletproof Camera",
        icon: BulletproofCamera,
    },
    {
        name: "Castle Barricade",
        icon: CastleBarricade,
    },
    { name: "Mira Window", icon: Mira },
    {
        name: "Barbed Wire",
        icon: BarbedWire,
    },
    {
        name: "Proximity Alarm",
        icon: ProximityAlarm,
    },
    {
        name: "Nitro Cell",
        icon: NitroCell,
    },
    {
        name: "Reinforcement",
        icon: Reinforcement,
    },
    {
        name: "Electroclaw",
        icon: Electroclaw,
    },
    {
        name: "Rotate Hole",
        icon: Rotate,
    },
    {
        name: "Head Hole",
        icon: HeadHoles,
    },
    {
        name: "Foot Hole",
        icon: FootHoles,
    },
    {
        name: "Shock Wire",
        icon: ShockWire,
    },
    {
        name: "Valkyrie Camera",
        icon: ValkyrieCamera,
    },
];
