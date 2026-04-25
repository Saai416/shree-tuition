import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fcevtzexgziwhquzubqf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZXZ0emV4Z3ppd2hxdXp1YnFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwNTc4OTIsImV4cCI6MjA5MjYzMzg5Mn0.-vXlbi_Iq2VV06RrbuFybOyVKyRQd7itSnFJ4JZNHIE";

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase.from('announcements').select('*');
    if (error) {
        console.error("Error fetching announcements", error);
    } else {
        console.log("Announcements in DB:", data);
    }
}

check();
