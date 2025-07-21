import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Computer Science Student",
    avatar: "AR",
    content: "The visualizer made complex data structures like AVL trees finally click for me. An essential tool for any CS student aiming for top-tier companies.",
    rating: 5
  },
  {
    name: "Samantha Chen",
    role: "Software Engineer",
    content: "As a software engineer, I use this platform to refresh my knowledge on algorithms before interviews. The step-by-step visualizations are incredibly effective.",
    rating: 5
  },
  {
    name: "Dr. Alan Grant",
    role: "Professor, CS Department",
    content: "An excellent pedagogical tool. Visual learning is powerful, and this platform harnesses it perfectly for computer science education.",
    rating: 5
  },
  {
    name: "Maria Santos",
    role: "Tech Interview Coach",
    content: "Preparing for FAANG interviews was daunting. This visualizer was my secret weapon for mastering dynamic programming and graph algorithms.",
    rating: 5
  },
  {
    name: "Leo Martinez",
    role: "Computer Science Student",
    content: "The ability to control the pace of the visualization is key. I can slow down complex steps to really understand what's happening under the hood.",
    rating: 5
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(2);

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Loved by Developers and Educators
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform is trusted by students, software engineers, and computer science professors for mastering algorithms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {testimonials.slice(0, 4).map((testimonial, index) => (
              <Card key={index} className="card-glow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-highlight-yellow text-highlight-yellow" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground text-sm">
                        {testimonial.name}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Featured testimonial */}
          <Card className="card-glow max-w-4xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-highlight-yellow text-highlight-yellow" />
                ))}
              </div>
              
              <blockquote className="text-2xl font-medium text-foreground mb-8 leading-relaxed">
                "As a software engineer, I use this platform to refresh my knowledge on 
                algorithms before interviews. The step-by-step visualizations are incredibly 
                effective."
              </blockquote>
              
              <div className="flex items-center justify-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/20 text-primary font-semibold text-lg">
                    SC
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="font-semibold text-foreground">
                    Samantha Chen
                  </div>
                  <div className="text-muted-foreground">
                    Software Engineer
                  </div>
                </div>
              </div>
              
              {/* Pagination dots */}
              <div className="flex justify-center gap-2 mt-8">
                {[0, 1, 2].map((index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === 1 ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;