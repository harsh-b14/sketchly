import { Edit3, Globe, MessageSquare, Users } from "lucide-react"

export function Footer(){
    return(
        <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold">WhiteSpace</span>
                </div>
                <p className="text-gray-400 mb-4">
                    The infinite canvas for visual collaboration
                </p>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Globe className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <MessageSquare className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Users className="w-5 h-5" />
                    </a>
                </div>
                </div>
                
                <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Templates</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                </ul>
                </div>
                
                <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
                </div>
                
                <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                </ul>
                </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-400 text-sm">
                © 2024 WhiteSpace. All rights reserved.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
                </div>
            </div>
            </div>
        </footer>
    )
}