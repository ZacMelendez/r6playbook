"use client";

import { atom } from "jotai";

interface StrategyFilter {
    operators?: string[];
    map?: string;
    site?: string;
}

const filterAtom = atom<StrategyFilter>({
    operators: [],
    map: undefined,
    site: undefined,
});

export default filterAtom;
