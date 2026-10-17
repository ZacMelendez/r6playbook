alter table "public"."users" add column "changed_username" boolean not null default false;

alter table "public"."users" add column "ubisoft_profile" text;

create policy "Enable delete for users based on user_id"
on "public"."strategies"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



