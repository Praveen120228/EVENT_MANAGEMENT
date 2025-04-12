import { getSupabaseClient } from './supabase';

export interface DemoRequest {
  id: string;
  name: string;
  email: string;
  company: string | null;
  event_type: string | null;
  message: string | null;
  status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'declined';
  created_at: string;
  updated_at: string;
}

export async function fetchDemoRequests() {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('demo_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return { data: data as DemoRequest[], error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to fetch demo requests' };
  }
}

export async function updateDemoRequestStatus(id: string, status: DemoRequest['status']) {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('demo_requests')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return { data: data as DemoRequest, error: null };
  } catch (error: any) {
    return { data: null, error: error.message || 'Failed to update demo request status' };
  }
}

export async function deleteDemoRequest(id: string) {
  const supabase = getSupabaseClient();
  
  try {
    const { error } = await supabase
      .from('demo_requests')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete demo request' };
  }
} 