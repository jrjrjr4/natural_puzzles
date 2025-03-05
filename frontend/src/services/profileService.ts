import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Profile } from '../types/supabase';

// Create Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Service to interact with user profiles in Supabase
 */
export const profileService = {
  /**
   * Get a user profile by ID
   * @param id User ID (UUID)
   * @returns Profile or null if not found
   */
  async getProfile(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data as Profile;
  },

  /**
   * Update a user profile
   * @param id User ID (UUID)
   * @param profile Profile data to update
   * @returns Updated profile or null if update failed
   */
  async updateProfile(
    id: string, 
    profile: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    
    return data as Profile;
  },

  /**
   * Get the current user's profile
   * @returns Current user's profile or null if not authenticated
   */
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    return this.getProfile(user.id);
  }
};

export default profileService; 