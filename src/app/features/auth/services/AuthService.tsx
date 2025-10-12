import supabase from "../utils/supabase";
import type { Session } from "@supabase/supabase-js";
export type UserMetadata = {
  language: string;
  room_skin: string;
};

export async function getSession() {
  return supabase.auth.getSession();
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
}

export async function signUp(
  email: string,
  password: string,
  username: string,
  metadata?: UserMetadata
) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: username, ...metadata },
      emailRedirectTo: "http://localhost:5173/",
    },
  });
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/home`,
    },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}
