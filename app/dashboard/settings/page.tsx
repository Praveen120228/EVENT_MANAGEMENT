'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/hooks/useSupabase'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, User, Lock, Bell, Mail, Trash2, Globe, Palette, Shield } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url: string
  timezone: string
  language: string
  theme: string
  email_notifications: boolean
  event_reminders: boolean
  guest_updates: boolean
  marketing_emails: boolean
  weekly_digest: boolean
  created_at: string
  updated_at: string
}

export default function SettingsPage() {
  const router = useRouter()
  const { user, supabase, loading: authLoading } = useSupabase()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
    timezone: 'UTC',
    language: 'en',
    theme: 'system'
  })
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    event_reminders: true,
    guest_updates: true,
    marketing_emails: false,
    weekly_digest: true
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // Fetch user profile when component mounts or auth state changes
  useEffect(() => {
    let isMounted = true;
    
    const loadProfile = async () => {
      if (!authLoading && !user) {
        router.push('/auth/login');
        return;
      }
      
      if (user && supabase) {
        await fetchProfile();
      }
    };
    
    loadProfile();
    
    return () => {
      isMounted = false;
    };
  }, [user, authLoading, router, supabase]);

  const fetchProfile = async () => {
    if (!supabase || !user) return
    
    setLoading(true)
    setError(null)
    
    try {
      // Single query to fetch all profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) {
        // If profile doesn't exist, create one with all fields
        if (error.code === 'PGRST116') {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([{
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || '',
              timezone: 'UTC',
              language: 'en',
              theme: 'system',
              email_notifications: true,
              event_reminders: true,
              guest_updates: true,
              marketing_emails: false,
              weekly_digest: true
            }])
            .select()
            .single()
          
          if (createError) throw createError
          
          // Set profile data
          setProfile(newProfile as UserProfile)
          setFormData({
            full_name: newProfile.full_name || '',
            email: newProfile.email || user.email || '',
            current_password: '',
            new_password: '',
            confirm_password: '',
            timezone: newProfile.timezone || 'UTC',
            language: newProfile.language || 'en',
            theme: newProfile.theme || 'system'
          })
          setNotifications({
            email_notifications: newProfile.email_notifications !== undefined ? newProfile.email_notifications : true,
            event_reminders: newProfile.event_reminders !== undefined ? newProfile.event_reminders : true,
            guest_updates: newProfile.guest_updates !== undefined ? newProfile.guest_updates : true,
            marketing_emails: newProfile.marketing_emails !== undefined ? newProfile.marketing_emails : false,
            weekly_digest: newProfile.weekly_digest !== undefined ? newProfile.weekly_digest : true
          })
        } else {
          throw error
        }
      } else {
        // Profile exists, use the data
        setProfile(data as UserProfile)
        setFormData({
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          current_password: '',
          new_password: '',
          confirm_password: '',
          timezone: data.timezone || 'UTC',
          language: data.language || 'en',
          theme: data.theme || 'system'
        })
        setNotifications({
          email_notifications: data.email_notifications !== undefined ? data.email_notifications : true,
          event_reminders: data.event_reminders !== undefined ? data.event_reminders : true,
          guest_updates: data.guest_updates !== undefined ? data.guest_updates : true,
          marketing_emails: data.marketing_emails !== undefined ? data.marketing_emails : false,
          weekly_digest: data.weekly_digest !== undefined ? data.weekly_digest : true
        })
        if (data.avatar_url) {
          setAvatarPreview(data.avatar_url)
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch profile:', err)
      setError(err.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be less than 5MB')
        return
      }
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setError('File must be an image (JPEG, PNG, GIF, or WEBP)')
        return
      }
      
      setAvatarFile(file)
      setError(null)
      
      // Create a preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.onerror = () => {
        setError('Failed to read the image file')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileUpdate = async () => {
    if (!supabase || !user) return
    
    setSaving(true)
    setError(null)
    setSuccess(null)
    
    try {
      // Basic validation
      if (!formData.full_name.trim()) {
        throw new Error('Full name is required')
      }
      
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        throw new Error('Valid email is required')
      }
      
      // Create a single update object with all fields
      const updateData: any = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        timezone: formData.timezone,
        language: formData.language,
        theme: formData.theme,
        email_notifications: notifications.email_notifications,
        event_reminders: notifications.event_reminders,
        guest_updates: notifications.guest_updates,
        marketing_emails: notifications.marketing_emails,
        weekly_digest: notifications.weekly_digest,
        updated_at: new Date().toISOString()
      }
      
      // Single update operation
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
      
      if (updateError) throw updateError
      
      // If there's a new avatar file, upload it
      if (avatarFile) {
        // Use simple filename without nested folders to avoid RLS issues
        const fileExt = avatarFile.name.split('.').pop()
        const fileName = `user_${user.id.replace(/-/g, '')}_${Date.now()}.${fileExt}`
        
        try {
          // Try direct upload with simple filename
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile, { 
              upsert: true,
              contentType: avatarFile.type 
            })
          
          if (uploadError) {
            // If upload fails with bucket not found, try a different fallback approach
            if (uploadError.message.includes('bucket') || uploadError.message.includes('violates row-level security policy')) {
              console.error('Upload failed due to bucket/policy issues, switching to base64 storage')
              
              // Convert image to base64 and store directly in profile
              const reader = new FileReader()
              
              // Convert the upload to a Promise-based operation
              const base64 = await new Promise((resolve, reject) => {
                reader.onloadend = () => resolve(reader.result)
                reader.onerror = reject
                reader.readAsDataURL(avatarFile)
              })
              
              // Store the base64 image directly in the avatar_url field
              // Note: This is a fallback and not ideal for large images
              const { error: base64Error } = await supabase
                .from('profiles')
                .update({ 
                  avatar_url: base64,
                  updated_at: new Date().toISOString()
                })
                .eq('id', user.id)
              
              if (base64Error) throw base64Error
              
              // Update local state
              setProfile(prev => prev ? { 
                ...prev, 
                avatar_url: base64 as string 
              } : null)
              
              setSuccess('Profile updated successfully with embedded avatar')
              return
            } else {
              throw uploadError
            }
          }
          
          // Get the public URL if storage upload succeeded
          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName)
          
          // Update the profile with the new avatar URL
          const { error: avatarUpdateError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', user.id)
          
          if (avatarUpdateError) throw avatarUpdateError
          
          // Update local state with URL
          setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null)
          
        } catch (err: any) {
          console.error('Avatar upload error:', err)
          // Continue with profile update even if avatar upload fails
          setError(`Profile updated but avatar upload failed: ${err.message}`)
          // Still consider this a partial success
          setSuccess('Profile information updated successfully')
          return
        }
      }
      
      // Update local state
      setProfile(prev => prev ? { ...prev, ...updateData } : null)
      
      setSuccess('Profile updated successfully')
    } catch (err: any) {
      console.error('Failed to update profile:', err)
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (!supabase || !user) return
    
    setSaving(true)
    setError(null)
    setSuccess(null)
    
    try {
      // Validate password fields
      if (!formData.current_password) {
        throw new Error('Current password is required')
      }
      
      if (!formData.new_password) {
        throw new Error('New password is required')
      }
      
      if (formData.new_password.length < 8) {
        throw new Error('New password must be at least 8 characters long')
      }
      
      if (formData.new_password !== formData.confirm_password) {
        throw new Error('New passwords do not match')
      }
      
      // Update password
      const { error } = await supabase.auth.updateUser({
        password: formData.new_password
      })
      
      if (error) throw error
      
      // Clear password fields
      setFormData({
        ...formData,
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
      
      setSuccess('Password updated successfully')
    } catch (err: any) {
      console.error('Failed to update password:', err)
      setError(err.message || 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationUpdate = async () => {
    if (!supabase || !user) return
    
    setSaving(true)
    setError(null)
    setSuccess(null)
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          email_notifications: notifications.email_notifications,
          event_reminders: notifications.event_reminders,
          guest_updates: notifications.guest_updates,
          marketing_emails: notifications.marketing_emails,
          weekly_digest: notifications.weekly_digest,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
      
      if (error) throw error
      
      setProfile(prev => prev ? { 
        ...prev, 
        email_notifications: notifications.email_notifications,
        event_reminders: notifications.event_reminders,
        guest_updates: notifications.guest_updates,
        marketing_emails: notifications.marketing_emails,
        weekly_digest: notifications.weekly_digest
      } : null)
      
      setSuccess('Notification preferences updated successfully')
    } catch (err: any) {
      console.error('Failed to update notification preferences:', err)
      setError(err.message || 'Failed to update notification preferences')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!supabase || !user) return
    
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return
    }
    
    setSaving(true)
    setError(null)
    
    try {
      // Delete user data from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)
      
      if (profileError) throw profileError
      
      // Delete user's events
      const { error: eventsError } = await supabase
        .from('events')
        .delete()
        .eq('organizer_id', user.id)
      
      if (eventsError) throw eventsError
      
      // Delete user's guests
      const { error: guestsError } = await supabase
        .from('guests')
        .delete()
        .eq('organizer_id', user.id)
      
      if (guestsError) throw guestsError
      
      // Delete user's communications
      const { error: communicationsError } = await supabase
        .from('communications')
        .delete()
        .eq('organizer_id', user.id)
      
      if (communicationsError) throw communicationsError
      
      // Delete user's avatar from storage
      const { error: storageError } = await supabase.storage
        .from('avatars')
        .remove([`${user.id}/avatar.png`, `${user.id}/avatar.jpg`, `${user.id}/avatar.jpeg`])
      
      if (storageError) throw storageError
      
      // Sign out the user
      await supabase.auth.signOut()
      
      // Redirect to login page
      router.push('/auth/login')
    } catch (err: any) {
      console.error('Failed to delete account:', err)
      setError(err.message || 'Failed to delete account')
      setSaving(false)
    }
  }

  if (authLoading) {
    return (
      <div className="container mx-auto py-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-4 px-4 sm:px-6 md:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Settings</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-6 h-auto">
          <TabsTrigger value="profile" className="py-3 text-sm data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
            <User className="h-4 w-4 mr-2 hidden sm:inline-block" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="py-3 text-sm data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
            <Lock className="h-4 w-4 mr-2 hidden sm:inline-block" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="py-3 text-sm data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
            <Bell className="h-4 w-4 mr-2 hidden sm:inline-block" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="advanced" className="py-3 text-sm data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
            <Shield className="h-4 w-4 mr-2 hidden sm:inline-block" />
            Advanced
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Profile</CardTitle>
              <CardDescription>Manage your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-border">
                      <AvatarImage src={avatarPreview || ''} alt={formData.full_name} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-800 text-lg">
                        {formData.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-100"
                        asChild
                      >
                        <label htmlFor="avatar-upload" className="cursor-pointer flex items-center justify-center">
                          <User className="h-4 w-4 text-emerald-600" />
                          <span className="sr-only">Change Avatar</span>
                        </label>
                      </Button>
                    </div>
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg, image/png, image/gif, image/webp"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  
                  {avatarFile && (
                    <div className="text-sm text-muted-foreground text-center">
                      Selected: {avatarFile.name.length > 20 ? avatarFile.name.substring(0, 20) + '...' : avatarFile.name} ({Math.round(avatarFile.size / 1024)} KB)
                    </div>
                  )}
                  
                  {avatarPreview && !profile?.avatar_url && (
                    <Alert className="bg-blue-50 border-blue-200 text-blue-800 text-sm">
                      <AlertDescription>
                        Your new avatar will be saved when you click "Save Changes"
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {avatarPreview && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="touch-manipulation min-h-[40px]"
                      onClick={() => {
                        setAvatarFile(null)
                        setAvatarPreview(profile?.avatar_url || null)
                      }}
                    >
                      Remove new avatar
                    </Button>
                  )}
                </div>
                
                <Separator />
                
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="full_name" className="text-sm font-medium">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Your full name"
                      className="h-10 sm:h-11 px-3 py-2 text-base"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Your email address"
                      className="h-10 sm:h-11 px-3 py-2 text-base"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleProfileUpdate}
                disabled={saving || loading}
                className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto min-h-[44px] text-base"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Change Password</CardTitle>
              <CardDescription>Update your password to keep your account secure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="current_password" className="text-sm font-medium">Current Password</Label>
                  <Input
                    id="current_password"
                    type="password"
                    value={formData.current_password}
                    onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                    placeholder="Your current password"
                    className="h-10 sm:h-11 px-3 py-2 text-base"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new_password" className="text-sm font-medium">New Password</Label>
                  <Input
                    id="new_password"
                    type="password"
                    value={formData.new_password}
                    onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                    placeholder="Your new password"
                    className="h-10 sm:h-11 px-3 py-2 text-base"
                  />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Password must be at least 8 characters long
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm_password" className="text-sm font-medium">Confirm New Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={formData.confirm_password}
                    onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                    placeholder="Confirm your new password"
                    className="h-10 sm:h-11 px-3 py-2 text-base"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handlePasswordUpdate}
                disabled={saving || loading}
                className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto min-h-[44px] text-base"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl text-red-800">Danger Zone</CardTitle>
              <CardDescription className="text-red-700">
                Actions that can't be undone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-red-800">Delete Account</h3>
                <p className="text-xs sm:text-sm text-red-700">
                  Once you delete your account, there is no going back. This action cannot be undone.
                  All your data, including events, guests, and communications will be permanently deleted.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={saving || loading}
                className="w-full sm:w-auto min-h-[44px] text-base"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Account'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-base font-medium text-gray-900">Email Notifications</h3>
                
                <div className="grid gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="email_notifications" className="text-sm font-medium">General Notifications</Label>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Receive important updates about your account and events
                      </p>
                    </div>
                    <div className="touch-manipulation w-11 h-6 min-h-[40px] flex items-center">
                      <Switch
                        id="email_notifications"
                        checked={notifications.email_notifications}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, email_notifications: checked }))
                        }
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="event_reminders" className="text-sm font-medium">Event Reminders</Label>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Get reminders about upcoming events you've organized
                      </p>
                    </div>
                    <div className="touch-manipulation w-11 h-6 min-h-[40px] flex items-center">
                      <Switch
                        id="event_reminders"
                        checked={notifications.event_reminders}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, event_reminders: checked }))
                        }
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="guest_updates" className="text-sm font-medium">Guest Updates</Label>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Receive notifications when guests RSVP to your events
                      </p>
                    </div>
                    <div className="touch-manipulation w-11 h-6 min-h-[40px] flex items-center">
                      <Switch
                        id="guest_updates"
                        checked={notifications.guest_updates}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, guest_updates: checked }))
                        }
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="weekly_digest" className="text-sm font-medium">Weekly Digest</Label>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Get a weekly summary of your events and guest activity
                      </p>
                    </div>
                    <div className="touch-manipulation w-11 h-6 min-h-[40px] flex items-center">
                      <Switch
                        id="weekly_digest"
                        checked={notifications.weekly_digest}
                        onCheckedChange={(checked) => 
                          setNotifications(prev => ({ ...prev, weekly_digest: checked }))
                        }
                        className="data-[state=checked]:bg-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-base font-medium text-gray-900">Marketing</h3>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="marketing_emails" className="text-sm font-medium">Marketing Emails</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Receive updates about new features and product improvements
                    </p>
                  </div>
                  <div className="touch-manipulation w-11 h-6 min-h-[40px] flex items-center">
                    <Switch
                      id="marketing_emails"
                      checked={notifications.marketing_emails}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, marketing_emails: checked }))
                      }
                      className="data-[state=checked]:bg-emerald-600"
                    />
                  </div>
                </div>
              </div>
              
            </CardContent>
            <CardFooter className="flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleNotificationUpdate}
                disabled={saving || loading}
                className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto min-h-[44px] text-base"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Preferences...
                  </>
                ) : (
                  'Save Preferences'
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">Advanced Settings</CardTitle>
              <CardDescription>Manage advanced features and troubleshooting tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Database Tools</h3>
                  <p className="text-sm text-muted-foreground">
                    Tools to fix common database issues and troubleshoot problems with your account.
                  </p>
                  <Button 
                    onClick={() => router.push('/dashboard/settings/database')}
                    variant="outline"
                    className="mt-2"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Open Database Tools
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 