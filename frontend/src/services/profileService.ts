import { Profile } from '../types/supabase';
import { supabase } from '../lib/supabaseClient';

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
    try {
      console.log(`ProfileService: Getting profile for user ${id}...`);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('ProfileService: Error fetching profile:', error);
        return null;
      }
      
      console.log('ProfileService: Profile fetched successfully:', data);
      return data as Profile;
    } catch (e) {
      console.error('ProfileService: Unexpected error in getProfile:', e);
      return null;
    }
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
    try {
      console.log('ProfileService: Getting current user...');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('ProfileService: No current user found');
        return null;
      }
      
      console.log('ProfileService: Current user found, fetching profile...');
      return this.getProfile(user.id);
    } catch (e) {
      console.error('ProfileService: Unexpected error in getCurrentProfile:', e);
      return null;
    }
  },

  async getCurrentProfileOld(): Promise<Profile | null> {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .single();

    if (error) throw error;
    return profile;
  },

  async updateProfileOld(userId: string, updates: ProfileUpdate): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }
};

export default profileService; 