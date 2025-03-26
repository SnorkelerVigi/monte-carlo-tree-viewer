
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="text-center max-w-md w-full bg-white rounded-xl shadow-sm border p-8 animate-fade-in">
        <h1 className="text-5xl font-light text-slate-800 mb-4">404</h1>
        <p className="text-xl text-slate-600 mb-6">Page not found</p>
        <a 
          href="/" 
          className="inline-block px-6 py-3 bg-primary text-white rounded-md transition-colors hover:bg-blue-600"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
