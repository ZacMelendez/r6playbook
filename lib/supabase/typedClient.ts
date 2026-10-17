import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../models/database.types";

export type TypedSupabaseClient = SupabaseClient<Database>;
