

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."addvote"("x" integer, "row_id" "uuid") RETURNS "void"
    LANGUAGE "sql"
    AS $$
  update strategies 
  set votes = votes + x
  where id = row_id
$$;


ALTER FUNCTION "public"."addvote"("x" integer, "row_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."removevote"("x" integer, "row_id" "uuid") RETURNS "void"
    LANGUAGE "sql"
    AS $$
  update strategies 
  set votes = votes - x
  where id = row_id
$$;


ALTER FUNCTION "public"."removevote"("x" integer, "row_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "strategy_id" "uuid",
    "user_id" "uuid",
    "content" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."favorites" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "item_id" "uuid" NOT NULL,
    "favorited_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."favorites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."strategies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "map" "text" NOT NULL,
    "operator_roles" "jsonb",
    "user_id" "uuid",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "site" "text" DEFAULT ''::"text" NOT NULL,
    "votes" integer DEFAULT 0,
    "operators" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "side" "text" DEFAULT 'defense'::"text" NOT NULL,
    "rank" "text",
    "sweat" integer,
    CONSTRAINT "side_constraint" CHECK (("side" = ANY (ARRAY['defense'::"text", 'attack'::"text"]))),
    CONSTRAINT "strategies_rank_check" CHECK (("rank" = ANY (ARRAY['copper'::"text", 'bronze'::"text", 'silver'::"text", 'gold'::"text", 'platinum'::"text", 'emerald'::"text", 'diamond'::"text", 'champion'::"text"]))),
    CONSTRAINT "strategies_site_check" CHECK (("site" <> ''::"text")),
    CONSTRAINT "strategies_sweat_check" CHECK ((("sweat" >= 1) AND ("sweat" <= 10)))
);


ALTER TABLE "public"."strategies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."strategytags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "strategy_id" "uuid",
    "tag_id" "uuid"
);


ALTER TABLE "public"."strategytags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "username" "text" NOT NULL,
    "email" "text" NOT NULL,
    "avatar_url" "text",
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."votes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "strategy_id" "uuid",
    "user_id" "uuid",
    "vote_type" integer,
    CONSTRAINT "votes_vote_type_check" CHECK (("vote_type" = ANY (ARRAY[1, 0, '-1'::integer])))
);


ALTER TABLE "public"."votes" OWNER TO "postgres";


ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_user_id_item_id_key" UNIQUE ("user_id", "item_id");



ALTER TABLE ONLY "public"."strategies"
    ADD CONSTRAINT "strategies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."strategytags"
    ADD CONSTRAINT "strategytags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."tags"
    ADD CONSTRAINT "tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."votes"
    ADD CONSTRAINT "votes_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_comments_strategy_id" ON "public"."comments" USING "btree" ("strategy_id");



CREATE INDEX "idx_strategies_user_id" ON "public"."strategies" USING "btree" ("user_id");



CREATE INDEX "idx_strategy_tags_strategy_id" ON "public"."strategytags" USING "btree" ("strategy_id");



CREATE INDEX "idx_strategy_tags_tag_id" ON "public"."strategytags" USING "btree" ("tag_id");



CREATE INDEX "idx_votes_strategy_id" ON "public"."votes" USING "btree" ("strategy_id");



CREATE INDEX "idx_votes_user_id" ON "public"."votes" USING "btree" ("user_id");



CREATE OR REPLACE TRIGGER "Favorites Invalidation" AFTER INSERT OR DELETE OR UPDATE ON "public"."favorites" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://r6playbook.vercel.app/api/revalidate/', 'POST', '{"Content-type":"application/json","Authorization":"pqUrYWnGszdIdvp2il1hM1yryhYQQFILLy8KRGyUyqnhTZrNOfjsS17GcfSE1rQUINyiPHgqSwTXo5pRsh4bltk5LSO5GAHFiqOnYBzXiJljm8JQzjy8FnXS411CdzAb"}', '{"table":"favorites"}', '5000');



CREATE OR REPLACE TRIGGER "Strategy Invalidation" AFTER INSERT OR DELETE OR UPDATE ON "public"."strategies" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://r6playbook.vercel.app/api/revalidate/', 'POST', '{"Content-type":"application/json","Authorization":"pqUrYWnGszdIdvp2il1hM1yryhYQQFILLy8KRGyUyqnhTZrNOfjsS17GcfSE1rQUINyiPHgqSwTXo5pRsh4bltk5LSO5GAHFiqOnYBzXiJljm8JQzjy8FnXS411CdzAb"}', '{"table":"strategies"}', '5000');



CREATE OR REPLACE TRIGGER "Votes Invalidation" AFTER INSERT OR DELETE OR UPDATE ON "public"."votes" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://r6playbook.vercel.app/api/revalidate/', 'POST', '{"Content-type":"application/json","Authorization":"pqUrYWnGszdIdvp2il1hM1yryhYQQFILLy8KRGyUyqnhTZrNOfjsS17GcfSE1rQUINyiPHgqSwTXo5pRsh4bltk5LSO5GAHFiqOnYBzXiJljm8JQzjy8FnXS411CdzAb"}', '{"table":"votes"}', '5000');



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "public"."strategies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."strategies"
    ADD CONSTRAINT "strategies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."strategytags"
    ADD CONSTRAINT "strategytags_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "public"."strategies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."strategytags"
    ADD CONSTRAINT "strategytags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."votes"
    ADD CONSTRAINT "votes_strategy_id_fkey" FOREIGN KEY ("strategy_id") REFERENCES "public"."strategies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."votes"
    ADD CONSTRAINT "votes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


























































































































































































GRANT ALL ON FUNCTION "public"."addvote"("x" integer, "row_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."addvote"("x" integer, "row_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."addvote"("x" integer, "row_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."removevote"("x" integer, "row_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."removevote"("x" integer, "row_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."removevote"("x" integer, "row_id" "uuid") TO "service_role";


















GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";



GRANT ALL ON TABLE "public"."favorites" TO "anon";
GRANT ALL ON TABLE "public"."favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."favorites" TO "service_role";



GRANT ALL ON TABLE "public"."strategies" TO "anon";
GRANT ALL ON TABLE "public"."strategies" TO "authenticated";
GRANT ALL ON TABLE "public"."strategies" TO "service_role";



GRANT ALL ON TABLE "public"."strategytags" TO "anon";
GRANT ALL ON TABLE "public"."strategytags" TO "authenticated";
GRANT ALL ON TABLE "public"."strategytags" TO "service_role";



GRANT ALL ON TABLE "public"."tags" TO "anon";
GRANT ALL ON TABLE "public"."tags" TO "authenticated";
GRANT ALL ON TABLE "public"."tags" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."votes" TO "anon";
GRANT ALL ON TABLE "public"."votes" TO "authenticated";
GRANT ALL ON TABLE "public"."votes" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
