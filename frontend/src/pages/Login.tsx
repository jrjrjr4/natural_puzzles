import LoginComponent from '../components/Login';

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>
      <p className="text-center mb-8 text-gray-600">
        Sign in to continue your chess puzzle journey.
      </p>
      <LoginComponent />
    </div>
  );
} 