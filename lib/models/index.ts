export * from "./database.types";

import { Database } from "./database.types";

export type Strategy = Database["public"]["Tables"]["strategies"]["Row"];
export type Vote = Database["public"]["Tables"]["votes"]["Row"];
export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];
export type UserDetails = Database["public"]["Tables"]["users"]["Row"];
export type CreateUserDetailsInput =
    Database["public"]["Tables"]["users"]["Insert"];
export type UpdateUserDetailsInput =
    Database["public"]["Tables"]["users"]["Update"];
export type Feedback = Database["public"]["Tables"]["feedback"]["Row"];

export const multipleStrategiesSelect = `
                id,
                title,
                map,
                site,
                operators,
                votes,
                side,
                user_id,
                is_draft,
                user: users!inner(username)
                `;

export const singleStrategySelect = `
                title,
                user_id,
                description,
                id,
                map,
                operators,
                side,
                site,
                votes,
                updated_at,
                is_draft,
                user:users(username)
                `;

export enum Ranks {
    UNRANKED = "Unranked",
    COPPER = "Copper",
    BRONZE = "Bronze",
    SILVER = "Silver",
    GOLD = "Gold",
    PLATINUM = "Platinum",
    EMERALD = "Emerald",
    DIAMOND = "Diamond",
    CHAMPION = "Champion",
}
