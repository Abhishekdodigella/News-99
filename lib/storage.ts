import type { NewsArticle } from "./news"

const SAVED_ARTICLES_KEY = "newshub_saved_articles"

interface SavedArticlesData {
  [userId: string]: NewsArticle[]
}

export const saveArticle = (userId: string, article: NewsArticle): void => {
  const savedData: SavedArticlesData = JSON.parse(localStorage.getItem(SAVED_ARTICLES_KEY) || "{}")

  if (!savedData[userId]) {
    savedData[userId] = []
  }

  // Check if article is already saved
  const isAlreadySaved = savedData[userId].some((saved) => saved.id === article.id)
  if (!isAlreadySaved) {
    savedData[userId].push(article)
    localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(savedData))
  }
}

export const removeSavedArticle = (userId: string, articleId: string): void => {
  const savedData: SavedArticlesData = JSON.parse(localStorage.getItem(SAVED_ARTICLES_KEY) || "{}")

  if (savedData[userId]) {
    savedData[userId] = savedData[userId].filter((article) => article.id !== articleId)
    localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(savedData))
  }
}

export const getSavedArticles = (userId: string): NewsArticle[] => {
  const savedData: SavedArticlesData = JSON.parse(localStorage.getItem(SAVED_ARTICLES_KEY) || "{}")
  return savedData[userId] || []
}

export const isArticleSaved = (userId: string, articleId: string): boolean => {
  const savedArticles = getSavedArticles(userId)
  return savedArticles.some((article) => article.id === articleId)
}
