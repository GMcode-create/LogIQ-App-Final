import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Link, TrendingUp, Settings, Download } from "lucide-react";

const DetailedFeaturesSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Engineered for Peak Performance
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore a professional-grade toolset designed for sophisticated algorithmic trading and analysis.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Card className="card-glow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-highlight-yellow/20 rounded-lg flex items-center justify-center">
                      <Link className="w-4 h-4 text-highlight-yellow" />
                    </div>
                    <Badge variant="outline" className="text-highlight-yellow border-highlight-yellow/30">
                      Algorithm Types
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Code2 className="w-4 h-4 text-primary" />
                    </div>
                    <CardTitle className="text-foreground">Code Editor</CardTitle>
                  </div>
                </CardHeader>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-highlight-magenta/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-highlight-magenta" />
                    </div>
                    <CardTitle className="text-foreground">Live Performance Tracking</CardTitle>
                  </div>
                </CardHeader>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-highlight-cyan/20 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-highlight-cyan" />
                    </div>
                    <CardTitle className="text-foreground">Personalization</CardTitle>
                  </div>
                </CardHeader>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                      <Download className="w-4 h-4 text-accent" />
                    </div>
                    <CardTitle className="text-foreground">Export/Share Results</CardTitle>
                  </div>
                </CardHeader>
              </Card>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Code2 className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">Wide Range of Supported Algorithms</h3>
              </div>
              
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Visualize and compare all major algorithm types, from sorting and 
                searching to pathfinding and graph traversal. Perfect for mastering CS 
                fundamentals or exploring advanced topics.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-highlight-yellow/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-highlight-yellow rounded-full"></div>
                  </div>
                  <span className="text-foreground">Sorting: Bubble, Merge, Quick, Heap, Radix, and more</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-highlight-yellow/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-highlight-yellow rounded-full"></div>
                  </div>
                  <span className="text-foreground">Searching: Binary, Linear, Interpolation, Jump</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-highlight-yellow/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-highlight-yellow rounded-full"></div>
                  </div>
                  <span className="text-foreground">Graph: BFS, DFS, Dijkstra, A*, Kruskal's, Prim's</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-highlight-yellow/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-highlight-yellow rounded-full"></div>
                  </div>
                  <span className="text-foreground">Tree & Custom algorithms: AVL, Segment Trees, and user-defined approaches</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DetailedFeaturesSection;