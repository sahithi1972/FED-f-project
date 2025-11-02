import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';

interface ProfileData {
  name: string;
  occupation: string;
  cuisinePreferences: string[];
  dietaryPreferences: string[];
  profileImage: string;
}

interface ProfileViewProps {
  profile: ProfileData | null;
  isFirstVisit: boolean;
  onEdit: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, isFirstVisit, onEdit }) => {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle>My Profile</CardTitle>
        <Button 
          onClick={onEdit}
          variant="outline"
        >
          {isFirstVisit ? 'Complete Profile' : 'Edit Profile'}
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          {profile?.profileImage ? (
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-border">
              <img 
                src={profile.profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
          
          <div className="flex-1 space-y-4">
            <div>
              <Label>Name</Label>
              <p className="text-lg font-medium">{profile?.name || 'Not set'}</p>
            </div>
            <div>
              <Label>Occupation</Label>
              <p className="text-lg">{profile?.occupation || 'Not set'}</p>
            </div>
          </div>
        </div>

        <div>
          <Label>Cuisine Preferences</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {profile?.cuisinePreferences?.map((cuisine) => (
              <span key={cuisine} className="px-3 py-1 bg-secondary rounded-full text-sm">
                {cuisine}
              </span>
            ))}
            {(!profile?.cuisinePreferences || profile.cuisinePreferences.length === 0) && 
              <span className="text-muted-foreground">Not set</span>
            }
          </div>
        </div>

        <div>
          <Label>Dietary Preferences</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {profile?.dietaryPreferences?.map((pref) => (
              <span key={pref} className="px-3 py-1 bg-secondary rounded-full text-sm">
                {pref}
              </span>
            ))}
            {(!profile?.dietaryPreferences || profile.dietaryPreferences.length === 0) && 
              <span className="text-muted-foreground">Not set</span>
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};