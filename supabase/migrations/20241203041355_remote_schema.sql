drop trigger if exists "Favorites Invalidation" on "public"."favorites";

drop trigger if exists "Strategy Invalidation" on "public"."strategies";

drop trigger if exists "Votes Invalidation" on "public"."votes";

alter table "public"."comments" drop constraint "comments_user_id_fkey";

alter table "public"."users" drop constraint "users_email_key";

alter table "public"."users" drop constraint "users_username_key";

alter table "public"."strategies" drop constraint "strategies_user_id_fkey";

drop index if exists "public"."users_email_key";

drop index if exists "public"."users_username_key";

create table "public"."feedback" (
    "id" uuid not null default gen_random_uuid(),
    "message" text not null,
    "created_at" timestamp without time zone default now(),
    "updated_at" timestamp without time zone default now(),
    "status" text not null default 'pending'::text,
    "title" text
);


alter table "public"."comments" enable row level security;

alter table "public"."favorites" enable row level security;

alter table "public"."strategies" add column "is_draft" boolean default false;

alter table "public"."strategies" add column "updated_at" timestamp with time zone default now();

alter table "public"."strategies" enable row level security;

alter table "public"."strategytags" enable row level security;

alter table "public"."tags" enable row level security;

alter table "public"."users" add column "deleted" boolean default false;

alter table "public"."users" add column "favorite_operators" text[];

alter table "public"."users" alter column "id" drop default;

alter table "public"."users" enable row level security;

alter table "public"."votes" enable row level security;

CREATE UNIQUE INDEX feedback_pkey ON public.feedback USING btree (id);

CREATE UNIQUE INDEX unique_username ON public.users USING btree (username);

alter table "public"."feedback" add constraint "feedback_pkey" PRIMARY KEY using index "feedback_pkey";

alter table "public"."feedback" add constraint "feedback_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'reviewed'::text, 'resolved'::text]))) not valid;

alter table "public"."feedback" validate constraint "feedback_status_check";

alter table "public"."users" add constraint "unique_username" UNIQUE using index "unique_username";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."strategies" add constraint "strategies_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."strategies" validate constraint "strategies_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.sync_auth_to_public()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Insert or update rows in public.users to sync with auth.users
    INSERT INTO public.users (id, username, email, created_at, deleted, avatar_url)
    VALUES (
        NEW.id, 
        substring(md5(random()::text) FROM 1 FOR 12), -- Generates a random string of 12 characters
        NEW.email, 
        NEW.created_at,
        FALSE,
        NEW.raw_user_meta_data ->> 'picture' -- Extracts the 'picture' key from the JSON structure
    )
    ON CONFLICT (id) DO UPDATE
    SET 
        email = EXCLUDED.email,
        created_at = EXCLUDED.created_at,
        deleted = FALSE, -- Reactivate user if marked as deleted
        avatar_url = EXCLUDED.avatar_url;
    RETURN NULL;
END;
$function$
;

grant delete on table "public"."feedback" to "anon";

grant insert on table "public"."feedback" to "anon";

grant references on table "public"."feedback" to "anon";

grant select on table "public"."feedback" to "anon";

grant trigger on table "public"."feedback" to "anon";

grant truncate on table "public"."feedback" to "anon";

grant update on table "public"."feedback" to "anon";

grant delete on table "public"."feedback" to "authenticated";

grant insert on table "public"."feedback" to "authenticated";

grant references on table "public"."feedback" to "authenticated";

grant select on table "public"."feedback" to "authenticated";

grant trigger on table "public"."feedback" to "authenticated";

grant truncate on table "public"."feedback" to "authenticated";

grant update on table "public"."feedback" to "authenticated";

grant delete on table "public"."feedback" to "service_role";

grant insert on table "public"."feedback" to "service_role";

grant references on table "public"."feedback" to "service_role";

grant select on table "public"."feedback" to "service_role";

grant trigger on table "public"."feedback" to "service_role";

grant truncate on table "public"."feedback" to "service_role";

grant update on table "public"."feedback" to "service_role";

create policy "Enable delete for users based on user_id"
on "public"."favorites"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for users based on user_id"
on "public"."favorites"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."favorites"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert access for all users"
on "public"."feedback"
as permissive
for insert
to anon, authenticated
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."strategies"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."strategies"
as permissive
for select
to public
using (true);


create policy "Enable update for users based on email"
on "public"."strategies"
as permissive
for update
to authenticated
using (true);


create policy "Enable read access for all users"
on "public"."users"
as permissive
for select
to anon, authenticated
using (true);


create policy "Enable read access for everyone"
on "public"."users"
as permissive
for select
to public
using (true);


create policy "Enable users to update their own account"
on "public"."users"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));


create policy "Enable insert for authenticated users only"
on "public"."votes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable users to update their own data only"
on "public"."votes"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable users to view their own data only"
on "public"."votes"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



