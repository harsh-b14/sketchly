import { ArrowRight, Check, Lightbulb, MessageSquare, MousePointer2, Target, Zap, Play } from "lucide-react";

export function HeroComponent(){
    return(
        <section className="pt-24 mt-6 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="transition-all duration-1000 opacity-100 translate-y-0">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                    Collaborate on ideas
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> visually</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    The infinite canvas for teams to brainstorm, plan, and create together. 
                    Real-time collaboration that feels magical.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
                    Start Creating Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    Free forever plan
                    </div>
                    <div className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                    No credit card required
                    </div>
                </div>
                </div>
                
                <div className="transition-all duration-1000 delay-300 opacity-100 translate-y-0">
                <div className="relative">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-6 mb-4">
                        <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white"></div>
                            <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                            <div className="w-6 h-6 bg-purple-500 rounded-full border-2 border-white"></div>
                        </div>
                        </div>
                        <div className="space-y-3">
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="flex items-center space-x-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">Brainstorm Ideas</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                            <div className="bg-yellow-100 p-2 rounded text-xs">Feature A</div>
                            <div className="bg-blue-100 p-2 rounded text-xs">Feature B</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                            <div className="flex items-center space-x-2 mb-2">
                            <Target className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium">Project Goals</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">3 people editing</span>
                        <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600">Live</span>
                        </div>
                    </div>
                    </div>
                    
                    {/* Floating elements */}
                    <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 animate-bounce">
                    <MousePointer2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 animate-pulse">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>
    )
}