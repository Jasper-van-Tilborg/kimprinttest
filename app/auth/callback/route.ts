import { createServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/account/dashboard";

  if (code) {
    const supabase = await createServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
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
      }
      
      redirect(next);
    }
  }

  // Return the user to an error page with instructions
  redirect("/account?error=auth_callback_error");
}













