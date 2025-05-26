export interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  source: string
  category: string
  publishedAt: string
  url: string
  imageUrl?: string
}

// Mock news data
const mockNews: NewsArticle[] = [
  {
    id: "1",
    title: "Revolutionary AI Breakthrough Changes Everything We Know About Machine Learning",
    summary:
      "Scientists at leading tech companies have developed a new AI model that can understand context better than ever before, potentially revolutionizing how we interact with technology.",
    content: "Full article content here...",
    source: "TechCrunch",
    category: "Technology",
    publishedAt: "2024-01-15T10:30:00Z",
    url: "https://example.com/ai-breakthrough",
  },
  {
    id: "2",
    title: "Global Climate Summit Reaches Historic Agreement on Carbon Emissions",
    summary:
      "World leaders have agreed on ambitious new targets for reducing carbon emissions, marking a significant step forward in the fight against climate change.",
    content: "Full article content here...",
    source: "Reuters",
    category: "Politics",
    publishedAt: "2024-01-15T08:15:00Z",
    url: "https://example.com/climate-summit",
  },
  {
    id: "3",
    title: "Championship Game Delivers Thrilling Overtime Victory",
    summary:
      "In a nail-biting finish, the home team secured victory in overtime, capping off one of the most exciting seasons in recent memory.",
    content: "Full article content here...",
    source: "ESPN",
    category: "Sports",
    publishedAt: "2024-01-14T22:45:00Z",
    url: "https://example.com/championship-game",
  },
  {
    id: "4",
    title: "Stock Market Reaches New Heights Amid Economic Optimism",
    summary:
      "Major indices hit record highs as investors show confidence in the economic recovery and corporate earnings reports exceed expectations.",
    content: "Full article content here...",
    source: "Wall Street Journal",
    category: "Business",
    publishedAt: "2024-01-14T16:20:00Z",
    url: "https://example.com/stock-market",
  },
  {
    id: "5",
    title: "New Study Reveals Surprising Benefits of Mediterranean Diet",
    summary:
      "Researchers have discovered additional health benefits of the Mediterranean diet, including improved cognitive function and longevity.",
    content: "Full article content here...",
    source: "Health News",
    category: "Health",
    publishedAt: "2024-01-14T14:10:00Z",
    url: "https://example.com/mediterranean-diet",
  },
  {
    id: "6",
    title: "Blockbuster Movie Breaks Opening Weekend Records",
    summary:
      "The highly anticipated sequel has shattered box office records, earning more in its opening weekend than any film in the franchise.",
    content: "Full article content here...",
    source: "Entertainment Weekly",
    category: "Entertainment",
    publishedAt: "2024-01-14T12:30:00Z",
    url: "https://example.com/blockbuster-movie",
  },
  {
    id: "7",
    title: "Quantum Computing Milestone Achieved by Research Team",
    summary:
      "A breakthrough in quantum computing brings us closer to solving complex problems that are impossible for traditional computers.",
    content: "Full article content here...",
    source: "Science Daily",
    category: "Technology",
    publishedAt: "2024-01-13T18:45:00Z",
    url: "https://example.com/quantum-computing",
  },
  {
    id: "8",
    title: "International Trade Agreement Signed by Major Economies",
    summary:
      "A new trade deal promises to boost economic cooperation and reduce barriers between participating countries.",
    content: "Full article content here...",
    source: "Financial Times",
    category: "Politics",
    publishedAt: "2024-01-13T15:20:00Z",
    url: "https://example.com/trade-agreement",
  },
  {
    id: "9",
    title: "Olympic Preparations Underway as Athletes Gear Up for Competition",
    summary: "Athletes from around the world are making final preparations as the upcoming Olympic Games approach.",
    content: "Full article content here...",
    source: "Olympic News",
    category: "Sports",
    publishedAt: "2024-01-13T11:15:00Z",
    url: "https://example.com/olympic-preparations",
  },
  {
    id: "10",
    title: "Startup Raises Record Funding for Green Energy Innovation",
    summary:
      "A promising clean energy startup has secured the largest Series A funding round in the renewable energy sector.",
    content: "Full article content here...",
    source: "Green Tech Media",
    category: "Business",
    publishedAt: "2024-01-12T20:30:00Z",
    url: "https://example.com/green-energy-startup",
  },
  {
    id: "11",
    title: "Mental Health Awareness Campaign Launches Nationwide",
    summary:
      "A comprehensive mental health initiative aims to reduce stigma and improve access to mental health resources.",
    content: "Full article content here...",
    source: "Health Today",
    category: "Health",
    publishedAt: "2024-01-12T17:45:00Z",
    url: "https://example.com/mental-health-campaign",
  },
  {
    id: "12",
    title: "Streaming Platform Announces Exclusive Content Partnership",
    summary:
      "Major streaming service secures exclusive rights to highly anticipated series and movies from renowned creators.",
    content: "Full article content here...",
    source: "Variety",
    category: "Entertainment",
    publishedAt: "2024-01-12T13:20:00Z",
    url: "https://example.com/streaming-partnership",
  },
]

export const getNews = (): NewsArticle[] => {
  return mockNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export const searchNews = (articles: NewsArticle[], query: string): NewsArticle[] => {
  const searchTerm = query.toLowerCase().trim()
  if (!searchTerm) return articles

  return articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.summary.toLowerCase().includes(searchTerm) ||
      article.source.toLowerCase().includes(searchTerm),
  )
}

export const filterNewsByCategory = (articles: NewsArticle[], category: string): NewsArticle[] => {
  if (category === "All") return articles
  return articles.filter((article) => article.category === category)
}

export const getArticleById = (id: string): NewsArticle | undefined => {
  return mockNews.find((article) => article.id === id)
}
