import { supabase } from './config.js';

// Handle file uploads for tickets
async function uploadTicketAttachment(file, ticketId) {
    try {
        // Create a unique file name
        const fileName = `${ticketId}/${Date.now()}-${file.name}`;
        
        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from('ticket-attachments')
            .upload(fileName, file);
            
        if (error) throw error;
        
        // Get public URL for the file
        const { data: { publicUrl } } = supabase.storage
            .from('ticket-attachments')
            .getPublicUrl(fileName);
            
        return {
            path: fileName,
            url: publicUrl
        };
    } catch (error) {
        console.error('Error uploading file:', error.message);
        throw error;
    }
}

// Download ticket attachment
async function downloadTicketAttachment(filePath) {
    try {
        const { data, error } = await supabase.storage
            .from('ticket-attachments')
            .download(filePath);
            
        if (error) throw error;
        
        // Create blob URL for download
        const url = URL.createObjectURL(data);
        return url;
    } catch (error) {
        console.error('Error downloading file:', error.message);
        throw error;
    }
}

// List attachments for a ticket
async function listTicketAttachments(ticketId) {
    try {
        const { data, error } = await supabase.storage
            .from('ticket-attachments')
            .list(ticketId);
            
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error listing files:', error.message);
        throw error;
    }
}

// Delete ticket attachment
async function deleteTicketAttachment(filePath) {
    try {
        const { error } = await supabase.storage
            .from('ticket-attachments')
            .remove([filePath]);
            
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting file:', error.message);
        throw error;
    }
}

export {
    uploadTicketAttachment,
    downloadTicketAttachment,
    listTicketAttachments,
    deleteTicketAttachment
}; 