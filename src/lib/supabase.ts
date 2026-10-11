import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Check environment variables first, then localStorage (enables live browser configuration)
export const getSupabaseConfig = (): { url: string; anonKey: string } => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || "";
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

  const storedUrl = typeof window !== "undefined" ? localStorage.getItem("ooma_supabase_url") || "" : "";
  const storedKey = typeof window !== "undefined" ? localStorage.getItem("ooma_supabase_anon_key") || "" : "";

  return {
    url: storedUrl.trim() || envUrl.trim(),
    anonKey: storedKey.trim() || envKey.trim(),
  };
};

export const saveSupabaseConfig = (url: string, anonKey: string) => {
  if (typeof window !== "undefined") {
    if (url.trim()) {
      localStorage.setItem("ooma_supabase_url", url.trim());
    } else {
      localStorage.removeItem("ooma_supabase_url");
    }
    if (anonKey.trim()) {
      localStorage.setItem("ooma_supabase_anon_key", anonKey.trim());
    } else {
      localStorage.removeItem("ooma_supabase_anon_key");
    }
  }
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey } = getSupabaseConfig();

  if (!url || !anonKey) {
    return null;
  }

  // Validate URL format
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return null;
  }

  try {
    if (!supabaseInstance) {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        realtime: {
          params: {
            eventsPerSecond: 10,
          },
        },
      });
    }
    return supabaseInstance;
  } catch (error) {
    console.error("[Supabase] Failed to initialize client:", error);
    return null;
  }
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey && (url.startsWith("http://") || url.startsWith("https://")));
};

export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: "Supabase URL and Anon Key are missing. Please enter them in settings or .env",
    };
  }

  try {
    // Attempt a light ping or select from projects/profiles table
    const { error } = await client.from("projects").select("id").limit(1);
    if (error) {
      // If table doesn't exist yet, but credentials are valid, Supabase returns 404 or relation does not exist
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        return {
          success: true,
          message: "Connected to Supabase! The database is reachable. (Tables need to be created using the SQL schema script).",
        };
      }
      return {
        success: false,
        message: `Supabase returned error: ${error.message} (Code: ${error.code})`,
      };
    }
    return {
      success: true,
      message: "Supabase connection active! PostgreSQL database and tables are verified.",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to reach Supabase server. Check your network and URL.",
    };
  }
};
