import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold text-red-600">Oops! Page not found</h1>
      <p className="text-gray-600 mt-4">We couldn't find what you were looking for.</p>
      <Link to="/" className="mt-6 text-blue-600 underline">
        Go back home
      </Link>
    </div>
  );
};

export default ErrorPage;
