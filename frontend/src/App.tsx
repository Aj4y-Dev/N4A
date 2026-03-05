import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import SignUpPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./store/authstore";

// protect routes that require authentication
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }: { children: React.ReactNode }) => {
	const { isAuthenticated } = useAuthStore();

	if (isAuthenticated) {
		return <Navigate to='/' replace />;
	}

	return children;
};

function App() {
	const { isCheckingAuth, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) return null; // Or a loading spinner

	return (
		<div
			className='min-h-screen bg-gradient-to-br
    from-gray-900 via-indigo-900 to-violet-900 flex items-center justify-center relative overflow-hidden'
		>
			<FloatingShape color='bg-indigo-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			<FloatingShape color='bg-violet-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShape color='bg-purple-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />

			<Routes>
				<Route
					path='/'
					element={
						<ProtectedRoute>
							{"Home"}
						</ProtectedRoute>
					}
				/>
				<Route
					path='/signup'
					element={
						<RedirectAuthenticatedUser>
							<SignUpPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path='/login'
					element={
						<RedirectAuthenticatedUser>
							<LoginPage />
						</RedirectAuthenticatedUser>
					}
				/>
			</Routes>
		</div>
	);
}

export default App;