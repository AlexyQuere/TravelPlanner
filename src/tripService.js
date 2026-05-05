import { supabase } from "./supabase";

export async function createTrip(trip) {
  const { data, error } = await supabase
    .from("trips")
    .insert({
      title: trip.title,
      data: trip,
    })
    .select("share_slug, edit_token")
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