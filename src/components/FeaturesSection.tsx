import { Card, CardContent } from "@/components/ui/card";
import { Monitor, GitCompare, Code, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Monitor,
    title: "Interactive Visualizer",
    description: "Watch algorithms come to life. Step through code execution and understand complex logic with interactive, animated visualizations.",
    color: "text-highlight-cyan"
  },
  {
    icon: GitCompare,
    title: "Algorithm Comparison",
    description: "Run algorithms side-by-side. Compare their performance, step count, and efficiency on the same dataset in real-time.",
    color: "text-highlight-magenta"
  },
  {
    icon: Code,
    title: "Custom Algorithm Builder",
    description: "Bring your own algorithms. Use our intuitive builder to write, import, and visualize your custom logic seamlessly.",
    color: "text-primary"
  },
  {
    icon: TrendingUp,
    title: "Performance Analytics",
    description: "Get detailed insights. Analyze time and space complexity with comprehensive charts and metrics for every algorithm run.",
    color: "text-highlight-yellow"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-glow group cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 ${feature.color} flex items-center justify-center bg-secondary/50 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;