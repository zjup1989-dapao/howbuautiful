import type { SupabaseClient, User } from "@supabase/supabase-js";

export async function ensureProfileForUser(client: SupabaseClient, user: Pick<User, "id" | "email">) {
  const displayName = user.email?.split("@")[0] || "New user";

  return client.from("profiles").upsert(
    {
      id: user.id,
      display_name: displayName,
    },
    { onConflict: "id" },
  );
}
