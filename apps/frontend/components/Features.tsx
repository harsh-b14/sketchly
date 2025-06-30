import { Clock, Edit3, Palette, Share2, Smartphone, Users } from "lucide-react";

export function Features(){
    const features = [
        {
          icon: <Edit3 className="w-6 h-6" />,
          title: "Infinite Canvas",
          description: "Unlimited space for your ideas with smooth zooming and panning"
        },
        {
          icon: <Users className="w-6 h-6" />,
          title: "Real-time Collaboration",
          description: "Work together seamlessly with live cursors and instant updates"
        },
        {
          icon: <Palette className="w-6 h-6" />,
          title: "Rich Drawing Tools",
          description: "Professional drawing tools with shapes, text, and sticky notes"
        },
        {
          icon: <Share2 className="w-6 h-6" />,
          title: "Easy Sharing",
          description: "Share boards instantly with secure links and permissions"
        },
        {
          icon: <Smartphone className="w-6 h-6" />,
          title: "Cross-Platform",
          description: "Works perfectly on desktop, tablet, and mobile devices"
        },
        {
          icon: <Clock className="w-6 h-6" />,
          title: "Version History",
          description: "Never lose work with automatic saves and version control"
        }
    ];

    return(
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Everything you need to collaborate
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Powerful features designed to make visual collaboration effortless and productive
                </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                <div 
                    key={index}
                    className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-blue-600">
                        {feature.icon}
                    </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                </div>
                ))}
            </div>
            </div>
        </section>
    )
}