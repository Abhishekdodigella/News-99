"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, Calendar, ExternalLink, Trash2 } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { getSavedArticles, removeSavedArticle, type NewsArticle } from "@/lib/storage"
import Link from "next/link"

export default function SavedPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [savedArticles, setSavedArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }

    setUser(currentUser)
    const saved = getSavedArticles(currentUser.id)
    setSavedArticles(saved)
    setLoading(false)
  }, [router])

  const handleRemoveArticle = (articleId: string) => {
    if (!user) return

    removeSavedArticle(user.id, articleId)
    setSavedArticles((prev) => prev.filter((article) => article.id !== articleId))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading saved articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to News
              </Button>
            </Link>
            <h1 className="ml-4 text-xl font-semibold text-gray-900">Saved Articles</h1>
            <Badge variant="secondary" className="ml-4">
              {savedArticles.length} articles
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {savedArticles.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Heart className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No saved articles yet</h3>
            <p className="text-gray-600 mb-6">
              Start saving articles you want to read later by clicking the heart icon
            </p>
            <Link href="/">
              <Button>Browse News</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{article.category}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveArticle(article.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg leading-tight line-clamp-2">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.summary}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="font-medium">{article.source}</span>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-2" />
                      Read Full Article
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
