import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 animate-fade-in">
          <AlertCircle role="img" aria-label="alert" className="h-10 w-10 text-red-500" />
          <h1 className="text-3xl font-bold text-gray-900">404 – Page Not Found</h1>
        </div>

        <p className="mt-4 text-gray-700 text-base">
          Oops! The page you're looking for doesn't exist. Maybe you forgot to add it to the router?
        </p>

        <div className="mt-6">
          <a
            href="/"
            className="inline-block bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-md"
          >
            Go back home
          </a>
        </div>
      </div>
    </div>
  );
}
