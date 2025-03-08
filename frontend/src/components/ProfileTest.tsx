import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';

export default function ProfileTest() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await profileService.getCurrentProfile();
      setProfile(data);
      setMessage('Profile loaded successfully');
    } catch (error: any) {
      setMessage(`Error loading profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateBio = async () => {
    setLoading(true);
    try {
      const updatedProfile = await profileService.updateProfile(user!.id, {
        bio: "Chess enthusiast and puzzle solver!",
        display_name: "JR Chess"
      });
      setProfile(updatedProfile);
      setMessage('Profile updated successfully');
    } catch (error: any) {
      setMessage(`Error updating profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Profile Test</h2>
      
      {message && (
        <div className="mb-4 p-3 bg-blue-100 rounded">
          {message}
        </div>
      )}

      {profile && (
        <div className="mb-4">
          <h3 className="font-bold">Current Profile:</h3>
          <pre className="bg-gray-100 p-3 rounded mt-2 overflow-auto">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={loadProfile}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh Profile
        </button>
        
        <button
          onClick={updateBio}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4"
        >
          Update Bio & Display Name
        </button>
      </div>
    </div>
  );
} 