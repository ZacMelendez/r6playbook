"use client";

import { atom } from "jotai";
import { SingleStrategy, SiteStrategy } from "../actions/strategies";

export const resetStrategy: SingleStrategy = {
    updated_at: "",
    description: "",
    id: "",
    map: "",
    operators: [],
    site: "",
    side: "",
    title: "",
    user_id: "",
    is_draft: true,
    user: {
        username: "",
    },
    votes: 0,
};

export const strategiesAtom = atom<SiteStrategy[]>([]);

export const strategyAtom = atom<SingleStrategy>(resetStrategy);

export const userStrategiesAtom = atom<SiteStrategy[]>([]);

export const activeDraftAtom = atom<SingleStrategy | null>(null);
export const draftsAtom = atom<SingleStrategy[]>([]);
