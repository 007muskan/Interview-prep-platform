"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/components/providers/auth-provider"
import { useProfile } from "@/hooks/use-profile"
import { useProfileContext } from "@/components/providers/profile-provider"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { user: authUser } = useAuth()
  const { profile, loading, saving, uploadingImage, error, updateProfile, uploadImage } = useProfile()
  const { updateProfileImage } = useProfileContext()
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    bio: "",
    targetRole: "",
    targetCompanies: [] as string[],
    timeline: "",
  })

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    weeklyReports: true,
    jobRecommendations: false,
    theme: "light",
  })

  const [newCompany, setNewCompany] = useState("")
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPreferences, setSavingPreferences] = useState(false)

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: profile.bio || "",
        targetRole: profile.targetRole || "",
        targetCompanies: profile.targetCompanies || [],
        timeline: profile.timeline || "",
      })

      if (profile.preferences) {
        setPreferences({
          emailNotifications: profile.preferences.emailNotifications,
          weeklyReports: profile.preferences.weeklyReports,
          jobRecommendations: profile.preferences.jobRecommendations,
          theme: profile.preferences.theme,
        })
      }
    }
  }, [profile])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddCompany = () => {
    if (newCompany.trim() && !formData.targetCompanies.includes(newCompany.trim())) {
      setFormData(prev => ({
        ...prev,
        targetCompanies: [...prev.targetCompanies, newCompany.trim()]
      }))
      setNewCompany("")
    }
  }

  const handleRemoveCompany = (company: string) => {
    setFormData(prev => ({
      ...prev,
      targetCompanies: prev.targetCompanies.filter(c => c !== company)
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size on client side
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB.",
        variant: "destructive",
      })
      return
    }

    // Validate file type on client side
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file (JPG, PNG, or GIF).",
        variant: "destructive",
      })
      return
    }

    try {
      const imageUrl = await uploadImage(file)
      // Update the global profile context
      if (imageUrl) {
        updateProfileImage(imageUrl)
      }
      toast({
        title: "Image uploaded",
        description: "Your profile picture has been updated successfully.",
      })
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Failed to upload image",
        variant: "destructive",
      })
    }

    // Clear the input so the same file can be selected again
    event.target.value = ""
  }

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true)
      await updateProfile(formData)
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleSavePreferences = async () => {
    try {
      setSavingPreferences(true)
      await updateProfile({ preferences })
      toast({
        title: "Preferences updated",
        description: "Your preferences have been saved successfully.",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingPreferences(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div>
                  <Label htmlFor="email-loading">Email</Label>
                  <Input 
                    id="email-loading" 
                    type="email" 
                    value={authUser?.email || ""}
                    disabled
                    className="mt-1 bg-gray-50 cursor-not-allowed text-gray-700" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
              </div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Card>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Error loading profile: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    )
  }

  const displayName = profile?.name || authUser?.user_metadata?.name || "User"
  const displayEmail = profile?.email || authUser?.email || authUser?.user_metadata?.email || ""

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Profile Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.image || ""} />
                  <AvatarFallback className="bg-orange-200 text-orange-700 text-2xl">
                    {displayName.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                {uploadingImage && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
              <div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={uploadingImage}
                />
                <label htmlFor="image-upload">
                  <Button size="sm" disabled={uploadingImage} asChild>
                    <span className="cursor-pointer">
                      {uploadingImage ? "Uploading..." : "Change Photo"}
                    </span>
                  </Button>
                </label>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (Max 2MB)</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="mt-1" 
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={displayEmail}
                  disabled
                  className="mt-1 bg-gray-50 cursor-not-allowed text-gray-700" 
                  placeholder="Loading email..."
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="mt-1" 
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="San Francisco, CA"
                className="mt-1" 
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                rows={4}
                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself and your career goals..."
              />
            </div>

            <Button onClick={handleSaveProfile} disabled={savingProfile}>
              {savingProfile ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Career Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="targetRole">Target Role</Label>
                <Input 
                  id="targetRole" 
                  value={formData.targetRole}
                  onChange={(e) => handleInputChange("targetRole", e.target.value)}
                  placeholder="Senior Full Stack Developer"
                  className="mt-1" 
                />
              </div>
              <div>
                <Label htmlFor="targetCompany">Target Companies</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                  {formData.targetCompanies.map((company) => (
                    <Badge key={company} variant="secondary" className="cursor-pointer">
                      {company}
                      <button
                        onClick={() => handleRemoveCompany(company)}
                        className="ml-1 text-xs hover:text-red-600"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    placeholder="Add company"
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCompany()}
                  />
                  <Button size="sm" onClick={handleAddCompany}>Add</Button>
                </div>
              </div>
              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Input 
                  id="timeline" 
                  value={formData.timeline}
                  onChange={(e) => handleInputChange("timeline", e.target.value)}
                  placeholder="6 months"
                  className="mt-1" 
                />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive updates about your progress</p>
            </div>
            <Switch
              checked={preferences.emailNotifications}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Reports</p>
              <p className="text-sm text-gray-600">Get weekly summary of your activities</p>
            </div>
            <Switch
              checked={preferences.weeklyReports}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, weeklyReports: checked }))}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Job Recommendations</p>
              <p className="text-sm text-gray-600">Receive personalized job suggestions</p>
            </div>
            <Switch
              checked={preferences.jobRecommendations}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, jobRecommendations: checked }))}
            />
          </div>
          <Button onClick={handleSavePreferences} disabled={savingPreferences} className="mt-4">
            {savingPreferences ? "Saving..." : "Save Preferences"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
