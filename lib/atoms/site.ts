"use client";

import { atom } from "jotai";

export const siteAtom = atom<{ site: string; map: string }>({
    site: "",
    map: "",
});
