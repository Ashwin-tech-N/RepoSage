import initialUsersData from '../data/users.json';
import { User } from '../types';

const USERS_STORAGE_KEY = 'reposage_demo_users_v1';
const SESSION_STORAGE_KEY = 'reposage_session_user_v1';

// Internal helper to get all registered demo users (bundled users.json + LocalStorage demo additions)
export function getRegisteredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      const initialUsers: User[] = (initialUsersData as { users: User[] }).users || [];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(raw);
  } catch {
    return (initialUsersData as { users: User[] }).users || [];
  }
}

// Save users list into local demo user store
function saveRegisteredUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to persist users to localStorage', err);
  }
}

export const authService = {
  // Returns true indicating this is a client-side simulated auth system
  isDemoAuth: true,

  getCurrentUser(): User | null {
    try {
      const session = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!session) return null;
      return JSON.parse(session);
    } catch {
      return null;
    }
  },

  async login(email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulated network latency
    await new Promise((r) => setTimeout(r, 450));

    const cleanEmail = email.trim().toLowerCase();
    const users = getRegisteredUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return {
        success: false,
        error: 'No account found with this email address. Please check your credentials or create a demo account.'
      };
    }

    // Demo user from users.json (null passwordHash) allows login with demo credentials or any demo password
    if (user.passwordHash === null) {
      const sessionUser: User = {
        ...user,
        role: user.role || 'Lead Software Engineer'
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
      return { success: true, user: sessionUser };
    }

    // For custom registered users: verify simple local demo hash
    const inputHash = btoa(password || '');
    if (user.passwordHash && user.passwordHash !== inputHash) {
      return {
        success: false,
        error: 'Invalid password. Please verify your credentials and try again.'
      };
    }

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    return { success: true, user };
  },

  async signup(
    fullName: string,
    email: string,
    username: string,
    password: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise((r) => setTimeout(r, 550));

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();
    const users = getRegisteredUsers();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return {
        success: false,
        error: 'An account with this email address already exists. Please sign in or use another email.'
      };
    }

    if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return {
        success: false,
        error: 'This username is already taken. Please choose another username.'
      };
    }

    // Store in LocalStorage demo store using safe base64 token representation for client demo
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: fullName.trim(),
      email: cleanEmail,
      username: cleanUsername,
      role: 'Software Engineer',
      passwordHash: btoa(password),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveRegisteredUsers(users);

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
    return { success: true, user: newUser };
  },

  demoLogin(): User {
    const users = getRegisteredUsers();
    const demoUser = users.find((u) => u.email === 'demo@reposage.dev') || users[0];
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(demoUser));
    return demoUser;
  },

  logout(): void {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
};
