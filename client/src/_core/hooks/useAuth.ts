import { useEffect, useState, useCallback } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/supabaseClient";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(_options?: UseAuthOptions) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();

      if (!mounted) return;

      if (error) {
        setError(error.message);
        setUser(null);
      } else {
        setUser(data.user ?? null);
        setError(null);
      }

      setLoading(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      setError(null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  }, []);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      setError(error.message);
      setUser(null);
      return { data: null, error };
    }

    setUser(data.user ?? null);
    setError(null);
    return { data: data.user, error: null };
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    refresh,
    logout,
  };
}
