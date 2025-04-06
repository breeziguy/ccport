import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xovojzpwkavzddlcbqex.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhvdm9qenB3a2F2emRkbGNicWV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDExNjg2MTgsImV4cCI6MjAxNjc0NDYxOH0.rOnra3AwXWsIvmRIm2c7hExOcCMj_BBnKSqhIVN-W0Q"
);
