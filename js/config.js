// Supabase Configuration
const SUPABASE_URL = 'https://rqvvikwvdhnxcdyiteon.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxdnZpa3d2ZGhueGNkeWl0ZW9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzNjU2MDQsImV4cCI6MjA2ODk0MTYwNH0.Vd1jxEZI4Miugn1qgLofA5-oKwAADkIElRNZ0mUpMro'

// Initialize Supabase Client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Base URL for GitHub Pages (change this to your repository name)
const BASE_URL = window.location.hostname === 'localhost' 
    ? '' 
    : '/student-helpdesk'

// Export configuration
export { 
    supabase,
    BASE_URL
} 