import { supabase } from "./supabase";

export async function createTrip(trip) {
  const { data, error } = await supabase
    .from("trips")
    .insert([
      {
        title: trip.title || "Nouveau voyage",
        data: trip,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function loadTrip(shareSlug) {
  const { data, error } = await supabase
    .from("trips")
    .select("data")
    .eq("share_slug", shareSlug)
    .single();

  if (error) throw error;
  return data.data;
}

export async function saveTrip(shareSlug, editToken, trip) {
  const { error } = await supabase
    .from("trips")
    .update({
      data: trip,
      updated_at: new Date().toISOString(),
    })
    .eq("share_slug", shareSlug)
    .eq("edit_token", editToken);

  if (error) throw error;
}

export async function listTrips() {
  const { data, error } = await supabase
    .from("trips")
    .select("share_slug, edit_token, title, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteTrip(shareSlug, editToken) {
  const { error } = await supabase
    .from("trips")
    .delete()
    .eq("share_slug", shareSlug)
    .eq("edit_token", editToken);

  if (error) throw error;
}