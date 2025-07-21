import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, BarChart3 } from "lucide-react";

const DemoSection = () => {
  return (
    <section className="py-20" id="demo">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              See Algorithms in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our interactive algorithm visualizer. Watch sorting algorithms, see code 
              execution step-by-step, and compare performance metrics.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="card-glow group">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-foreground">
                  Sorting Algorithm Visualization
                </CardTitle>
                <p className="text-muted-foreground">
                  Watch algorithms like Quick Sort, Merge Sort, and 
                  Heap Sort unfold in real-time.
                </p>
              </CardHeader>
              <CardContent>
                <div className="bg-secondary/30 rounded-lg p-6 mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-code-pattern opacity-50"></div>
                  <div className="relative z-10">
                    <div className="text-6xl font-bold text-muted-foreground/20 text-center py-12">
                      LOADING...
                    </div>
                    
                    <div className="flex justify-center space-x-2 mb-4">
                      {[40, 70, 45, 90, 60, 25, 80, 35, 55, 75].map((height, index) => (
                        <div
                          key={index}
                          className="bg-gradient-primary rounded-t"
                          style={{
                            height: `${height}px`,
                            width: '20px',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <Button variant="outline-glow" className="w-full group">
                  <Play className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  View Demo
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">
                    Code Editor Interface
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Follow the code execution with live syntax highlighting.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-card/50 rounded-lg p-4 font-mono text-sm border border-border">
                    <div className="text-highlight-yellow">function</div>{" "}
                    <div className="text-primary inline">quickSort</div>
                    <div className="text-muted-foreground inline">(arr) {"{"}</div>
                    <br />
                    <div className="text-muted-foreground ml-4">
                      if (arr.length {"<="} 1) {"{"} return arr; {"}"}
                    </div>
                    <br />
                    <div className="text-muted-foreground ml-4">
                      // ...logic shows here as it runs
                    </div>
                    <br />
                    <div className="text-muted-foreground">{"}"}</div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Play className="w-4 h-4 mr-2" />
                    View Demo
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-foreground">
                    Algorithm Comparison Dashboard
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Analyze performance metrics like time and space complexity.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Heap Sort", time: "78ms", color: "bg-primary" },
                      { name: "Merge Sort", time: "44ms", color: "bg-highlight-magenta" },
                      { name: "Quick Sort", time: "22ms", color: "bg-highlight-yellow" }
                    ].map((algorithm, index) => (
                      <div key={algorithm.name} className="flex items-center justify-between">
                        <span className="text-sm text-foreground">{algorithm.name}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-secondary rounded-full h-2">
                            <div 
                              className={`${algorithm.color} h-2 rounded-full`}
                              style={{ width: `${(78 - parseInt(algorithm.time)) / 78 * 100 + 20}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground min-w-[40px]">
                            {algorithm.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Demo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;