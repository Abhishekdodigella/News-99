"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Search, User, BookOpen, TrendingUp, Calendar, ExternalLink } from "lucide-react"
import { getCurrentUser, logout } from "@/lib/auth"
import { getNews, searchNews, filterNewsByCategory, type NewsArticle } from "@/lib/news"
import { saveArticle, getSavedArticles, removeSavedArticle } from "@/lib/storage"
import Link from "next/link"

const categories = ["All", "Technology", "Politics", "Sports", "Business", "Health", "Entertainment"]

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [savedArticleIds, setSavedArticleIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(currentUser)

    // Load articles and saved articles
    const newsData = getNews()
    setArticles(newsData)
    setFilteredArticles(newsData)

    const saved = getSavedArticles(currentUser.id)
    setSavedArticleIds(saved.map((article) => article.id))

    setLoading(false)
  }, [router])

  useEffect(() => {
    let filtered = articles

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filterNewsByCategory(filtered, selectedCategory)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = searchNews(filtered, searchQuery)
    }

    // Apply user preferences if available
    if (user?.preferences?.length > 0 && selectedCategory === "All" && !searchQuery.trim()) {
      const preferredArticles = articles.filter((article) =>
        user.preferences.some((pref: string) => article.category.toLowerCase() === pref.toLowerCase()),
      )
      const otherArticles = articles.filter(
        (article) => !user.preferences.some((pref: string) => article.category.toLowerCase() === pref.toLowerCase()),
      )
      filtered = [...preferredArticles, ...otherArticles]
    }

    setFilteredArticles(filtered)
  }, [articles, selectedCategory, searchQuery, user])

  const handleSaveArticle = (article: NewsArticle) => {
    if (!user) return

    if (savedArticleIds.includes(article.id)) {
      removeSavedArticle(user.id, article.id)
      setSavedArticleIds((prev) => prev.filter((id) => id !== article.id))
    } else {
      saveArticle(user.id, article)
      setSavedArticleIds((prev) => [...prev, article.id])
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading news...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">NewsHub</h1>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                <TrendingUp className="w-3 h-3 mr-1" />
                Live
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/saved">
                <Button variant="ghost" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Saved
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="ghost" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-gray-600">Stay updated with the latest news from around the world</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-xs sm:text-sm">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline">{article.category}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSaveArticle(article)}
                    className={savedArticleIds.includes(article.id) ? "text-red-500" : "text-gray-400"}
                  >
                    <Heart className={`w-4 h-4 ${savedArticleIds.includes(article.id) ? "fill-current" : ""}`} />
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

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
