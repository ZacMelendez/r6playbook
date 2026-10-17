export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    public: {
        Tables: {
            comments: {
                Row: {
                    content: string;
                    created_at: string | null;
                    id: string;
                    strategy_id: string | null;
                    user_id: string | null;
                };
                Insert: {
                    content: string;
                    created_at?: string | null;
                    id?: string;
                    strategy_id?: string | null;
                    user_id?: string | null;
                };
                Update: {
                    content?: string;
                    created_at?: string | null;
                    id?: string;
                    strategy_id?: string | null;
                    user_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "comments_strategy_id_fkey";
                        columns: ["strategy_id"];
                        isOneToOne: false;
                        referencedRelation: "strategies";
                        referencedColumns: ["id"];
                    }
                ];
            };
            favorites: {
                Row: {
                    favorited_at: string | null;
                    id: string;
                    item_id: string;
                    user_id: string;
                };
                Insert: {
                    favorited_at?: string | null;
                    id?: string;
                    item_id: string;
                    user_id: string;
                };
                Update: {
                    favorited_at?: string | null;
                    id?: string;
                    item_id?: string;
                    user_id?: string;
                };
                Relationships: [];
            };
            feedback: {
                Row: {
                    created_at: string | null;
                    id: string;
                    message: string;
                    status: string;
                    title: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    created_at?: string | null;
                    id?: string;
                    message: string;
                    status?: string;
                    title?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    created_at?: string | null;
                    id?: string;
                    message?: string;
                    status?: string;
                    title?: string | null;
                    updated_at?: string | null;
                };
                Relationships: [];
            };
            strategies: {
                Row: {
                    created_at: string | null;
                    description: string;
                    id: string;
                    is_draft: boolean | null;
                    map: string;
                    operator_roles: Json | null;
                    operators: string[];
                    rank: string | null;
                    side: string;
                    site: string;
                    sweat: number | null;
                    title: string;
                    updated_at: string | null;
                    user_id: string | null;
                    votes: number | null;
                };
                Insert: {
                    created_at?: string | null;
                    description: string;
                    id?: string;
                    is_draft?: boolean | null;
                    map: string;
                    operator_roles?: Json | null;
                    operators?: string[];
                    rank?: string | null;
                    side?: string;
                    site?: string;
                    sweat?: number | null;
                    title: string;
                    updated_at?: string | null;
                    user_id?: string | null;
                    votes?: number | null;
                };
                Update: {
                    created_at?: string | null;
                    description?: string;
                    id?: string;
                    is_draft?: boolean | null;
                    map?: string;
                    operator_roles?: Json | null;
                    operators?: string[];
                    rank?: string | null;
                    side?: string;
                    site?: string;
                    sweat?: number | null;
                    title?: string;
                    updated_at?: string | null;
                    user_id?: string | null;
                    votes?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "strategies_user_id_fkey";
                        columns: ["user_id"];
                        isOneToOne: false;
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            strategytags: {
                Row: {
                    id: string;
                    strategy_id: string | null;
                    tag_id: string | null;
                };
                Insert: {
                    id?: string;
                    strategy_id?: string | null;
                    tag_id?: string | null;
                };
                Update: {
                    id?: string;
                    strategy_id?: string | null;
                    tag_id?: string | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "strategytags_strategy_id_fkey";
                        columns: ["strategy_id"];
                        isOneToOne: false;
                        referencedRelation: "strategies";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "strategytags_tag_id_fkey";
                        columns: ["tag_id"];
                        isOneToOne: false;
                        referencedRelation: "tags";
                        referencedColumns: ["id"];
                    }
                ];
            };
            tags: {
                Row: {
                    id: string;
                    name: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                };
                Relationships: [];
            };
            users: {
                Row: {
                    avatar_url: string | null;
                    changed_username: boolean;
                    created_at: string | null;
                    deleted: boolean | null;
                    email: string;
                    favorite_operators: string[] | null;
                    id: string;
                    ubisoft_profile: string | null;
                    username: string;
                };
                Insert: {
                    avatar_url?: string | null;
                    changed_username?: boolean;
                    created_at?: string | null;
                    deleted?: boolean | null;
                    email: string;
                    favorite_operators?: string[] | null;
                    id: string;
                    ubisoft_profile?: string | null;
                    username: string;
                };
                Update: {
                    avatar_url?: string | null;
                    changed_username?: boolean;
                    created_at?: string | null;
                    deleted?: boolean | null;
                    email?: string;
                    favorite_operators?: string[] | null;
                    id?: string;
                    ubisoft_profile?: string | null;
                    username?: string;
                };
                Relationships: [];
            };
            votes: {
                Row: {
                    id: string;
                    strategy_id: string | null;
                    user_id: string | null;
                    vote_type: number | null;
                };
                Insert: {
                    id?: string;
                    strategy_id?: string | null;
                    user_id?: string | null;
                    vote_type?: number | null;
                };
                Update: {
                    id?: string;
                    strategy_id?: string | null;
                    user_id?: string | null;
                    vote_type?: number | null;
                };
                Relationships: [
                    {
                        foreignKeyName: "votes_strategy_id_fkey";
                        columns: ["strategy_id"];
                        isOneToOne: false;
                        referencedRelation: "strategies";
                        referencedColumns: ["id"];
                    }
                ];
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            addvote: {
                Args: {
                    x: number;
                    row_id: string;
                };
                Returns: undefined;
            };
            removevote: {
                Args: {
                    x: number;
                    row_id: string;
                };
                Returns: undefined;
            };
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
    PublicTableNameOrOptions extends
        | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
              Database[PublicTableNameOrOptions["schema"]]["Views"])
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
          Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
          Row: infer R;
      }
        ? R
        : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
          PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
          PublicSchema["Views"])[PublicTableNameOrOptions] extends {
          Row: infer R;
      }
        ? R
        : never
    : never;

export type TablesInsert<
    PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Insert: infer I;
      }
        ? I
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
          Insert: infer I;
      }
        ? I
        : never
    : never;

export type TablesUpdate<
    PublicTableNameOrOptions extends
        | keyof PublicSchema["Tables"]
        | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
        : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
          Update: infer U;
      }
        ? U
        : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
          Update: infer U;
      }
        ? U
        : never
    : never;

export type Enums<
    PublicEnumNameOrOptions extends
        | keyof PublicSchema["Enums"]
        | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
        ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
        : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
        | keyof PublicSchema["CompositeTypes"]
        | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database;
    }
        ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
        : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
