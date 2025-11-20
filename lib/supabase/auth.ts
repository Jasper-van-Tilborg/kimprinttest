import { createServer } from "./server";
import { redirect } from "next/navigation";

/**
 * Require authentication for a page
 * Redirects to /account if user is not authenticated
 */
export async function requireAuth() {
  const supabase = await createServer();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/account");
  }

  return user;
}

/**
 * Get the current user (nullable)
 */
export async function getUser() {
  const supabase = await createServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const supabase = await createServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
}

/**
 * Require admin role
 * Redirects to /account if user is not admin
 */
export async function requireAdmin() {
  const user = await requireAuth();
  const supabase = await createServer();

  // Check if user is admin
  const { data: userData, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || !userData || userData.role !== "admin") {
    redirect("/account");
  }

  return user;
}

