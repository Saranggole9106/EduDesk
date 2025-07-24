import { supabase } from './config.js';

// Role-based queries
const roleQueries = {
    // Student queries
    student: {
        // Get student's tickets
        getMyTickets: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            return await supabase
                .from('tickets')
                .select(`
                    *,
                    responses:ticket_responses(*)
                `)
                .eq('created_by', user.id)
                .order('created_at', { ascending: false });
        },

        // Create new ticket
        createTicket: async (ticketData) => {
            const { data: { user } } = await supabase.auth.getUser();
            return await supabase
                .from('tickets')
                .insert([{
                    ...ticketData,
                    created_by: user.id,
                    status: 'pending'
                }])
                .select();
        },

        // Add response to own ticket
        addResponse: async (ticketId, response) => {
            const { data: { user } } = await supabase.auth.getUser();
            // First verify ticket ownership
            const { data: ticket } = await supabase
                .from('tickets')
                .select()
                .eq('id', ticketId)
                .eq('created_by', user.id)
                .single();

            if (!ticket) throw new Error('Ticket not found or access denied');

            return await supabase
                .from('ticket_responses')
                .insert([{
                    ticket_id: ticketId,
                    response,
                    created_by: user.id
                }])
                .select();
        }
    },

    // Staff queries
    staff: {
        // Get department tickets
        getDepartmentTickets: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            const { data: profile } = await supabase
                .from('profiles')
                .select('department')
                .eq('id', user.id)
                .single();

            return await supabase
                .from('tickets')
                .select(`
                    *,
                    responses:ticket_responses(*),
                    student:profiles!tickets_created_by_fkey(*)
                `)
                .eq('category', profile.department)
                .order('created_at', { ascending: false });
        },

        // Get assigned tickets
        getAssignedTickets: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            return await supabase
                .from('tickets')
                .select(`
                    *,
                    responses:ticket_responses(*),
                    student:profiles!tickets_created_by_fkey(*)
                `)
                .eq('assigned_to', user.id)
                .order('created_at', { ascending: false });
        },

        // Update ticket status
        updateTicketStatus: async (ticketId, status) => {
            const { data: { user } } = await supabase.auth.getUser();
            return await supabase
                .from('tickets')
                .update({ 
                    status,
                    assigned_to: user.id,
                    updated_at: new Date().toISOString()
                })
                .eq('id', ticketId)
                .select();
        },

        // Add response to any ticket in department
        addResponse: async (ticketId, response) => {
            const { data: { user } } = await supabase.auth.getUser();
            return await supabase
                .from('ticket_responses')
                .insert([{
                    ticket_id: ticketId,
                    response,
                    created_by: user.id
                }])
                .select();
        }
    },

    // Admin queries
    admin: {
        // Get all tickets
        getAllTickets: async () => {
            return await supabase
                .from('tickets')
                .select(`
                    *,
                    responses:ticket_responses(*),
                    student:profiles!tickets_created_by_fkey(*),
                    staff:profiles!tickets_assigned_to_fkey(*)
                `)
                .order('created_at', { ascending: false });
        },

        // Get all users
        getAllUsers: async () => {
            return await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });
        },

        // Update user role
        updateUserRole: async (userId, role) => {
            return await supabase
                .from('profiles')
                .update({ role })
                .eq('id', userId)
                .select();
        },

        // Assign ticket to staff
        assignTicket: async (ticketId, staffId) => {
            return await supabase
                .from('tickets')
                .update({ 
                    assigned_to: staffId,
                    updated_at: new Date().toISOString()
                })
                .eq('id', ticketId)
                .select();
        },

        // Get analytics
        getAnalytics: async () => {
            const { data: tickets } = await supabase
                .from('tickets')
                .select('status, category, created_at');

            return {
                totalTickets: tickets.length,
                byStatus: tickets.reduce((acc, ticket) => {
                    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
                    return acc;
                }, {}),
                byCategory: tickets.reduce((acc, ticket) => {
                    acc[ticket.category] = (acc[ticket.category] || 0) + 1;
                    return acc;
                }, {}),
                byDate: tickets.reduce((acc, ticket) => {
                    const date = new Date(ticket.created_at).toLocaleDateString();
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {})
            };
        }
    }
};

// Check user role and return appropriate queries
async function getRoleQueries() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile) throw new Error('Profile not found');

    return roleQueries[profile.role] || null;
}

export {
    roleQueries,
    getRoleQueries
}; 