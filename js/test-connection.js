import { supabase } from './config.js';

// Test database connection
async function testConnection() {
    try {
        // Test simple query
        const { data, error } = await supabase
            .from('profiles')
            .select('count')
            .limit(1);
        
        if (error) {
            console.error('Connection Error:', error.message);
            return;
        }
        
        console.log('Successfully connected to Supabase!');
        
        // Set up real-time subscription
        const subscription = supabase
            .channel('table-db-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'tickets'
            }, (payload) => {
                console.log('Real-time update received:', payload);
            })
            .subscribe((status) => {
                console.log('Real-time subscription status:', status);
            });
            
        console.log('Real-time subscription initialized');
        
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

// Run the test
testConnection(); 