"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, registerSchema } from "./schemas/AuthSchema";

// Função para obter a URL do site, usada para redirecionamentos após login ou registro
function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

// Função para lidar com o login do usuário
export async function login(
  _prevState: { error?: string } | null,
  formData: FormData,
) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Verifique os dados informados." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/home");
}
// Função para lidar com o login do usuário usando OAuth (Google)
export async function loginWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=oauth");
  }

  redirect(data.url);
}

// Função para lidar com o registro de um novo usuário
export async function register(
  _prevState: { error?: string; success?: string } | null,
  formData: FormData,
) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Verifique os campos e a senha informados." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    phone: parsed.data.phone,
    password: parsed.data.password,
    options: {
      data: {
        name: parsed.data.name,
      },
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    console.error("Supabase signUp error:", error.message);
    return { error: `Não foi possível concluir o cadastro: ${error.message}` };
  }

  if (data.session) {
    redirect("/main");
  }

  return {
    success: "Cadastro iniciado! Verifique seu e-mail para confirmar a conta.",
  };
}

// Função para lidar com o logout do usuário
export async function logout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: "Não foi possível encerrar a sessão." };
  }

  redirect("/login");
}
