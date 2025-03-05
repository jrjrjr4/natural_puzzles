import SignUpComponent from '../components/SignUp';

export default function SignUpPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Create an Account</h1>
      <p className="text-center mb-8 text-gray-600">
        Sign up to track your progress and save your puzzle history.
      </p>
      <SignUpComponent />
    </div>
  );
} 