import { Edit3, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return(
        <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">WhiteSpace</span>
                </div>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                    {/* <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
                    <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a> */}
                    <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Help</a>
                    <Link to="/signin" className="text-gray-600 hover:text-gray-900 transition-colors">Sign In</Link>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started
                    </button>
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                </div>
            </div>
        
            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                <div className="px-4 py-2 space-y-1">
                    <a href="#features" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Features</a>
                    {/* <a href="#pricing" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Pricing</a>
                    <a href="#testimonials" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Reviews</a> */}
                    <a href="#" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Help</a>
                    <Link to="/signin" className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">Sign In</Link>
                    <button className="w-full mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Get Started
                    </button>
                </div>
                </div>
            )}
        </nav>
    )
}