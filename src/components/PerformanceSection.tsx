import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Activity, MemoryStick, Zap, Scale } from "lucide-react";
import { useState } from "react";

const PerformanceSection = () => {
  const [isAfter, setIsAfter] = useState(false);

  return (
    <section className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Visualize Algorithm Performance
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Interact with our performance metrics to see the tangible impact of our 
              optimization algorithms. Toggle between states to witness the transformation.
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`text-lg font-semibold ${!isAfter ? 'text-highlight-magenta' : 'text-muted-foreground'}`}>
                Before
              </span>
              <Switch 
                checked={isAfter} 
                onCheckedChange={setIsAfter}
                className="data-[state=checked]:bg-primary"
              />
              <span className={`text-lg font-semibold ${isAfter ? 'text-primary' : 'text-muted-foreground'}`}>
                After
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="card-glow text-center">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Processing Speed</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {isAfter ? "3.2x" : "1.0x"} Baseline
                </div>
                <Badge variant="outline" className={isAfter ? "text-primary border-primary/30" : "text-muted-foreground"}>
                  {isAfter ? "Optimized Performance" : "Standard Performance"}
                </Badge>
              </CardContent>
            </Card>

            <Card className="card-glow text-center">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MemoryStick className="w-5 h-5 text-highlight-magenta" />
                  <CardTitle className="text-lg">Memory Efficiency</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {isAfter ? "42" : "86"} MB Avg
                </div>
                <Badge variant="outline" className={isAfter ? "text-primary border-primary/30" : "text-highlight-magenta border-highlight-magenta/30"}>
                  {isAfter ? "Reduced Allocation" : "Initial Allocation"}
                </Badge>
              </CardContent>
            </Card>

            <Card className="card-glow text-center">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-highlight-yellow" />
                  <CardTitle className="text-lg">Energy Consumption</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {isAfter ? "0.61" : "0.98"} kWh
                </div>
                <Badge variant="outline" className={isAfter ? "text-primary border-primary/30" : "text-highlight-yellow border-highlight-yellow/30"}>
                  {isAfter ? "Optimized Power" : "Default Power Draw"}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Time Complexity</h3>
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="h-48 relative">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    <defs>
                      <linearGradient id="beforeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(320, 100%, 65%)" />
                        <stop offset="100%" stopColor="hsl(320, 100%, 45%)" />
                      </linearGradient>
                      <linearGradient id="afterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(195, 100%, 50%)" />
                        <stop offset="100%" stopColor="hsl(195, 100%, 30%)" />
                      </linearGradient>
                    </defs>
                    
                    {/* Before curve */}
                    <path
                      d="M 20 180 Q 100 120 200 80 Q 300 40 380 20"
                      stroke={isAfter ? "hsl(215, 25%, 65%)" : "url(#beforeGradient)"}
                      strokeWidth="3"
                      fill="none"
                      opacity={isAfter ? 0.3 : 1}
                      className="transition-all duration-500"
                    />
                    
                    {/* After curve */}
                    <path
                      d="M 20 180 Q 100 160 200 140 Q 300 120 380 100"
                      stroke={isAfter ? "url(#afterGradient)" : "hsl(215, 25%, 65%)"}
                      strokeWidth="3"
                      fill="none"
                      opacity={isAfter ? 1 : 0.3}
                      className="transition-all duration-500"
                    />
                  </svg>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-highlight-magenta rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Before</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span className="text-sm text-muted-foreground">After</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Memory Usage (MB)</h3>
              <div className="bg-card rounded-xl p-6 border border-border mb-8">
                <div className="space-y-4">
                  {["Heap Sort", "Merge Sort", "Quick Sort"].map((algorithm, index) => {
                    const beforeValues = [78, 44, 22];
                    const afterValues = [45, 28, 15];
                    const colors = ["text-primary", "text-highlight-magenta", "text-highlight-yellow"];
                    
                    return (
                      <div key={algorithm}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-foreground">{algorithm}</span>
                          <span className="text-sm text-muted-foreground">
                            {isAfter ? afterValues[index] : beforeValues[index]}ms
                          </span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r from-current to-current h-2 rounded-full transition-all duration-700 ${colors[index]}`}
                            style={{ 
                              width: `${isAfter ? (afterValues[index] / 78) * 100 : (beforeValues[index] / 78) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Card className="card-glow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Scale className="w-6 h-6 text-primary" />
                    <h4 className="text-xl font-bold text-foreground">Scalability Index</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-gradient mb-2">
                      {isAfter ? "76.4" : "45.2"}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Our system's enhanced architecture demonstrates a solid 
                    baseline for performance, ready for exponential optimization.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;