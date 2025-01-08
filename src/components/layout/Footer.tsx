import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 py-2 px-4 bg-dashboard-background/50 backdrop-blur-sm text-xs text-dashboard-muted">
      <div className="container mx-auto flex justify-center space-x-4">
        <Link 
          to="/privacy" 
          className="hover:text-dashboard-text transition-colors"
        >
          Privacy Policy
        </Link>
        <span>•</span>
        <Link 
          to="/terms" 
          className="hover:text-dashboard-text transition-colors"
        >
          Terms of Service
        </Link>
      </div>
    </footer>
  );
};

export default Footer; 