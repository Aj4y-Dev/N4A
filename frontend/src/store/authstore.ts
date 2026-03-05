import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:4000/api/v1";

axios.defaults.withCredentials = true;

export type Role = "STUDENT" | "TEACHER" | "ADMIN";

export interface User {
	id: string;
	email: string;
	username: string;
	role: Role;
	createdAt: string;
	updatedAt: string;
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	error: string | null;
	isLoading: boolean;
	isCheckingAuth: boolean;
	message: string | null;
	signup: (email: string, password: string, username: string) => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,

	signup: async (email, password, username) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/user/signup`, { email, password, username });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error: any) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},

	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/user/login`, { email, password });
			set({
				user: response.data.user,
				isAuthenticated: true,
				isLoading: false,
				error: null,
			});
		} catch (error: any) {
			set({ error: error.response.data.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/user/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error: any) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/user/check-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ user: null, isAuthenticated: false, isCheckingAuth: false });
		}
	},
}));
