import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth-context';
import { Navigate } from 'react-router-dom';
import { ProfileDialog } from '../components/ProfileDialog';
import { ProfileView } from '../components/ProfileView';

interface ProfileData {
  name: string;
  occupation: string;
  cuisinePreferences: string[];
  dietaryPreferences: string[];
  profileImage: string;
}

const Profile: React.FC = () => {
  const { user, setProfileCompleted } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/v1/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.profile) {
          const normalizedProfile = {
            name: data.profile.name || '',
            occupation: data.profile.occupation || '',
            cuisinePreferences: Array.isArray(data.profile.cuisinePreferences) ? data.profile.cuisinePreferences : [],
            dietaryPreferences: Array.isArray(data.profile.dietaryPreferences) ? data.profile.dietaryPreferences : [],
            profileImage: data.profile.profileImage || ''
          };
          setProfile(normalizedProfile);
          
          if (data.profile.name && isFirstVisit) {
            setIsFirstVisit(false);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkFirstVisit = async () => {
      await fetchProfile();
      if (!user?.profileCompleted) {
        setIsDialogOpen(true);
        setIsFirstVisit(true);
      }
    };
    checkFirstVisit();
  }, [user]);

  const onProfileUpdate = async (updatedProfile: ProfileData) => {
    try {
      setIsDialogOpen(false);
      setProfile(updatedProfile);
      
      if (isFirstVisit) {
        setProfileCompleted();
        setIsFirstVisit(false);
      }
      
      setShowSuccess(true);
      
      setTimeout(async () => {
        await fetchProfile();
      }, 500);
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error in profile update:', error);
    }
  };

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="profile-container flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] p-8">
      {showSuccess && (
        <div className="fixed top-4 right-4 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          <div className="w-5 h-5 text-white">✓</div>
          Profile saved successfully!
        </div>
      )}

      <ProfileView 
        profile={profile} 
        isFirstVisit={isFirstVisit}
        onEdit={() => setIsDialogOpen(true)}
      />

      <ProfileDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        initialData={profile}
        onSave={onProfileUpdate}
      />
    </div>
  );
};

export default Profile;