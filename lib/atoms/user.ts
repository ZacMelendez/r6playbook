"use client";

import { User } from "@supabase/supabase-js";
import { atom } from "jotai";
import { Favorite, Vote, UserDetails } from "../models";

export type UserAtom = User & {
    votes?: Vote[];
    favorites?: Favorite[];
    details?: UserDetails;
};

// export const userAtom = atom<UserAtom | null | undefined>(undefined);
export const userAtom = atom<Promise<UserAtom | null | undefined>>();
export const userVotesAtom = atom<Vote[]>([]);
export const userFavoritesAtom = atom<Favorite[]>([]);
export const userDetailsAtom = atom<UserDetails | null | undefined>(undefined);
