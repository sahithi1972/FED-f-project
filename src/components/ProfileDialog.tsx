import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../contexts/auth-context';
import { X, Check, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ProfileData | null;
  onSave: (updatedProfile: ProfileData) => void;
}

interface ProfileData {
  name: string;
  occupation: string;
  cuisinePreferences: string[];
  dietaryPreferences: string[];
  profileImage: string;
}

export const ProfileDialog: React.FC<ProfileDialogProps> = ({ 
  open, 
  onOpenChange, 
  initialData,
  onSave 
}) => {
  const { setProfileCompleted, updateUserData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    occupation: '',
    cuisinePreferences: [],
    dietaryPreferences: [],
    profileImage: ''
  });
  const [imagePreview, setImagePreview] = useState(initialData?.profileImage || '');

  useEffect(() => {
    if (open) {
      // Reset form data when dialog opens
      const defaultData = {
        name: initialData?.name ?? '',
        occupation: initialData?.occupation ?? '',
        cuisinePreferences: Array.isArray(initialData?.cuisinePreferences) ? initialData.cuisinePreferences : [],
        dietaryPreferences: Array.isArray(initialData?.dietaryPreferences) ? initialData.dietaryPreferences : [],
        profileImage: initialData?.profileImage ?? ''
      };
      setFormData(defaultData);
      setImagePreview(initialData?.profileImage || '');
      setError('');
      setShowSuccess(false);
    }
  }, [open, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/upload/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setFormData(prev => ({ ...prev, profileImage: data.url }));
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image');
      setImagePreview(''); // Reset preview on error
    }
  };

  const handlePreferenceChange = (type: 'cuisinePreferences' | 'dietaryPreferences', value: string) => {
    setFormData(prev => {
      const currentPreferences = prev[type];
      const updatedPreferences = currentPreferences.includes(value)
        ? currentPreferences.filter(p => p !== value)
        : [...currentPreferences, value];
      return { ...prev, [type]: updatedPreferences };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      // Create a sanitized version of the form data
      const profileData = {
        name: formData.name.trim(),
        occupation: formData.occupation.trim(),
        cuisinePreferences: Array.isArray(formData.cuisinePreferences) ? formData.cuisinePreferences : [],
        dietaryPreferences: Array.isArray(formData.dietaryPreferences) ? formData.dietaryPreferences : [],
        profileImage: formData.profileImage || '',
        profileCompleted: true
      };

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        console.error('Error parsing response:', e);
        responseData = {};
      }

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update profile');
      }
      
      // Get response data or use submitted data
      const responseProfile = responseData.data || responseData.profile || {};
      
      // Create profile update with response data, falling back to submitted data
      const updatedProfile: ProfileData = {
        name: responseProfile.name || formData.name.trim(),
        occupation: responseProfile.occupation || formData.occupation.trim(),
        cuisinePreferences: responseProfile.cuisinePreferences || formData.cuisinePreferences,
        dietaryPreferences: responseProfile.dietaryPreferences || formData.dietaryPreferences,
        profileImage: responseProfile.profileImage || formData.profileImage
      };

      // Update auth context
      updateUserData(updatedProfile);
      setProfileCompleted();
      
      // Call the onSave callback with updated profile
      onSave(updatedProfile);

      // Show success animation
      setShowSuccess(true);
      
      // Close dialog after a brief delay to show success animation
      setTimeout(() => {
        onOpenChange(false);
      }, 1000);

    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-border"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                  )}
                  <Label
                    htmlFor="photo-upload"
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <span className="text-white text-sm">Change</span>
                  </Label>
                </motion.div>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <span>Upload new photo</span>
                  </motion.div>
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={cn(
                  "transition-all duration-200 focus:scale-[1.01]",
                  error && "border-destructive"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input
                id="occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleInputChange}
                className="transition-all duration-200 focus:scale-[1.01]"
              />
            </div>

            <div className="space-y-2">
              <Label>Favorite Cuisines</Label>
              <div className="flex flex-wrap gap-2">
                {['Indian', 'Italian', 'Mexican', 'Chinese', 'Mediterranean'].map((cuisine) => (
                  <motion.button
                    key={cuisine}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => handlePreferenceChange('cuisinePreferences', cuisine)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm transition-colors",
                      formData.cuisinePreferences.includes(cuisine)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    {cuisine}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dietary Preferences</Label>
              <div className="flex flex-wrap gap-2">
                {['Vegetarian', 'Vegan', 'Gluten Free', 'Dairy Free'].map((diet) => (
                  <motion.button
                    key={diet}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => handlePreferenceChange('dietaryPreferences', diet)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm transition-colors",
                      formData.dietaryPreferences.includes(diet)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    )}
                  >
                    {diet}
                  </motion.button>
                ))}
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}

            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="bg-primary text-primary-foreground p-4 rounded-full"
                  >
                    <Check className="w-8 h-8" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : showSuccess ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : null}
                {loading ? "Updating..." : showSuccess ? "Updated!" : "Update Profile"}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};