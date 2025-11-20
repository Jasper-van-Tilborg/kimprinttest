"use server";

import { createServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function login(formData: FormData) {
  const supabase = await createServer();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login error:", error);
    
    // Check of het een email confirmation error is
    if (error.message?.includes("Email not confirmed") || error.message?.includes("email_not_confirmed")) {
      return { 
        error: "Je e-mailadres is nog niet bevestigd. Check je inbox voor de bevestigingslink.",
        requiresEmailConfirmation: true 
      };
    }
    
    return { error: "Ongeldig e-mailadres of wachtwoord. Probeer het opnieuw." };
  }

  // Check of email bevestigd is (extra beveiliging)
  if (authData?.user && !authData.user.email_confirmed_at) {
    // Log uit als email niet bevestigd is
    await supabase.auth.signOut();
    return { 
      error: "Je e-mailadres is nog niet bevestigd. Check je inbox voor de bevestigingslink.",
      requiresEmailConfirmation: true 
    };
  }

  revalidatePath("/", "layout");
  
  // Check if user is admin and redirect accordingly
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();
    
    if (userData?.role === "admin") {
      redirect("/admin/dashboard");
    } else {
      redirect("/account/dashboard");
    }
  } else {
    redirect("/account/dashboard");
  }
}

export async function logout() {
  const supabase = await createServer();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createServer();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  // Validatie
  if (!email || !password || !firstName || !lastName) {
    return { error: "Vul alle velden in." };
  }

  if (password.length < 6) {
    return { error: "Wachtwoord moet minimaal 6 karakters lang zijn." };
  }

  // Email validatie
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Voer een geldig e-mailadres in." };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    console.error("Signup error:", error);
    return { error: error.message || "Er is een fout opgetreden bij het aanmaken van het account." };
  }

  // Check of de gebruiker is aangemaakt
  if (data?.user) {
    console.log("User created successfully:", data.user.email);
    
    // Check of email confirmation nodig is
    // Als email confirmation aan staat, is user.email_confirmed_at null
    // Als email confirmation uit staat, is user.email_confirmed_at direct gevuld
    if (!data.user.email_confirmed_at) {
      // Email confirmation is vereist - gebruiker moet email bevestigen
      return { 
        success: true, 
        message: "check_email",
        requiresEmailConfirmation: true 
      };
    } else {
      // Email confirmation staat UIT - dit zou niet moeten gebeuren in productie
      console.warn("WARNING: Email confirmation is disabled! This is a security risk.");
      return { 
        success: true, 
        message: "account_created",
        requiresEmailConfirmation: false 
      };
    }
  }

  // Fallback - dit zou niet moeten gebeuren
  return { 
    success: true, 
    message: "check_email",
    requiresEmailConfirmation: true 
  };
}

