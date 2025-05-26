"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, User, Settings, Heart } from "lucide-react"
import { getCurrentUser, updateUser, logout } from "@/lib/auth"
import { getSavedArticles } from "@/lib/storage"
import Link from "next/link"

const interests = ["Technology", "Politics", "Sports", "Business", "Health", "Entertainment"]

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [savedCount, setSavedCount] = useState(0)
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
    })
    setSelectedInterests(currentUser.preferences || [])

    const saved = getSavedArticles(currentUser.id)
    setSavedCount(saved.length)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess("")
    setLoading(true)

    try {
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        preferences: selectedInterests,
      }

      updateUser(updatedUser)
      setUser(updatedUser)
      setSuccess("Profile updated successfully!")
    } catch (err) {
      console.error("Error updating profile:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleInterestChange = (interest: string, checked: boolean) => {
    if (checked) {
      setSelectedInterests((prev) => [...prev, interest])
    } else {
      setSelectedInterests((prev) => prev.filter((i) => i !== interest))
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to News
              </Button>
            </Link>
            <h1 className="ml-4 text-xl font-semibold text-gray-900">Profile Settings</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Overview */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-sm">Saved Articles</span>
                  </div>
                  <span className="font-semibold">{savedCount}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm">Interests</span>
                  </div>
                  <span className="font-semibold">{selectedInterests.length}</span>
                </div>

                <div className="pt-4 space-y-2">
                  <Link href="/saved" className="block">
                    <Button variant="outline" className="w-full">
                      View Saved Articles
                    </Button>
                  </Link>
                  <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information and news preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {success && (
                    <Alert>
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>News Interests</Label>
                    <p className="text-sm text-gray-600">
                      Select topics you're interested in to get personalized news recommendations
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {interests.map((interest) => (
                        <div key={interest} className="flex items-center space-x-2">
                          <Checkbox
                            id={interest}
                            checked={selectedInterests.includes(interest)}
                            onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                          />
                          <Label htmlFor={interest} className="text-sm">
                            {interest}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
