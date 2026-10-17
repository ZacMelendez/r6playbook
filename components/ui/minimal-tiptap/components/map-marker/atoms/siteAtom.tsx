import { atom } from "jotai";

export const siteAtom = atom<{
    map?: string;
    site?: string;
}>({
    map: undefined,
    site: undefined,
});
