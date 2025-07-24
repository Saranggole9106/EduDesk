// Supabase Configuration
const SUPABASE_URL = 'https://rqvvikwvdhnxcdyiteon.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxdnZpa3d2ZGhueGNkeWl0ZW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNjU2MDQsImV4cCI6MjA2ODk0MTYwNH0.Vd1jxEZI4Miugn1qgLofA5-oKwAADkIElRNZ0mUpMro'

// Initialize Supabase Client
const { createClient } = supabase
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Base URL for GitHub Pages
const BASE_URL = window.location.hostname === 'localhost' 
    ? '' 
    : '/EduDesk'

// Export configuration
export { 
    supabaseClient as supabase,
    BASE_URL
} 