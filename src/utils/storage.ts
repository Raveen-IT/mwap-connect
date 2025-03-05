
import { User } from '@/types/user';

// Local storage keys
const USERS_KEY = 'mwap_users';
const CURRENT_USER_KEY = 'mwap_current_user';

// Get all users from local storage
export const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_KEY);
  if (!usersJson) return [];
  return JSON.parse(usersJson);
};

// Add a new user to local storage
export const addUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Find a user by ID
export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

// Find a user by mobile number
export const getUserByMobile = (mobile: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.mobile === mobile);
};

// Find a user by Aadhaar number
export const getUserByAadhaar = (aadhaar: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.aadhaarNumber === aadhaar);
};

// Save current logged in user
export const setCurrentUser = (user: User): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

// Get current logged in user
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  if (!userJson) return null;
  return JSON.parse(userJson);
};

// Clear current user (logout)
export const clearCurrentUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Update user details
export const updateUser = (user: User): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Also update current user if it's the same user
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === user.id) {
      setCurrentUser(user);
    }
  }
};
