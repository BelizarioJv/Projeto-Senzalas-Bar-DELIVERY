import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Função para lidar com o callback do OAuth (Google)
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(new URL("/home", requestUrl.origin));
    }
  }

  return NextResponse.redirect(
    new URL("/login?error=oauth_callback", requestUrl.origin),
  );
}
