export interface User {
  id: string
  name: string
  email: string
  password: string
  preferences: string[]
  createdAt: string
}

const USERS_KEY = "newshub_users"
const CURRENT_USER_KEY = "newshub_current_user"

// Initialize with demo user
const initializeUsers = () => {
  const existingUsers = localStorage.getItem(USERS_KEY)
  if (!existingUsers) {
    const demoUser: User = {
      id: "demo-user",
      name: "Demo User",
      email: "demo@example.com",
      password: "demo123",
      preferences: ["Technology", "Business"],
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(USERS_KEY, JSON.stringify([demoUser]))
  }
}

export const signup = (userData: {
  name: string
  email: string
  password: string
  preferences: string[]
}): boolean => {
  initializeUsers()

  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")

  // Check if user already exists
  if (users.find((user) => user.email === userData.email)) {
    return false
  }

  const newUser: User = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email,
    password: userData.password,
    preferences: userData.preferences,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))

  // Auto login after signup
  const { password, ...userWithoutPassword } = newUser
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))

  return true
}

export const login = (email: string, password: string): boolean => {
  initializeUsers()

  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    const { password: _, ...userWithoutPassword } = user
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword))
    return true
  }

  return false
}

export const logout = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export const getCurrentUser = (): Omit<User, "password"> | null => {
  const userStr = localStorage.getItem(CURRENT_USER_KEY)
  return userStr ? JSON.parse(userStr) : null
}

export const updateUser = (userData: Omit<User, "password">): void => {
  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
  const userIndex = users.findIndex((u) => u.id === userData.id)

  if (userIndex !== -1) {
    // Keep the existing password
    users[userIndex] = { ...users[userIndex], ...userData }
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    // Update current user session
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData))
  }
}
