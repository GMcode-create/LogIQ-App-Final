import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, Code, Briefcase, FlaskConical } from "lucide-react";

const audiences = [
  {
    icon: GraduationCap,
    title: "Students",
    description: "Master subjects with AI-powered study aids and interactive modules. Prepare for exams effectively and excel.",
    highlight: "border-highlight-cyan"
  },
  {
    icon: Users,
    title: "Educators",
    description: "Create engaging lesson plans and automate grading. Get insights to personalize your teaching for every student.",
    highlight: "border-highlight-magenta"
  },
  {
    icon: Code,
    title: "Developers",
    description: "Accelerate your workflow with intelligent code suggestions, debugging assistance, and project scaffolding.",
    highlight: "border-primary"
  },
  {
    icon: Briefcase,
    title: "Interview Candidates",
    description: "Ace your next job interview with tailored practice questions, mock interviews, and instant performance feedback.",
    highlight: "border-highlight-yellow",
    featured: true
  },
  {
    icon: FlaskConical,
    title: "Researchers",
    description: "Analyze complex data, summarize literature, and generate new hypotheses with advanced AI research tools.",
    highlight: "border-accent"
  }
];

const TargetAudienceSection = () => {
  return (
    <section className="py-20 bg-gradient-secondary" id="about">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Designed for the innovators of</span>
              <br />
              <span className="text-gradient">tomorrow</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform is meticulously crafted to empower a diverse range of users, from 
              students embarking on their learning journey to professionals pushing the 
              boundaries of technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {audiences.slice(0, 4).map((audience, index) => (
              <Card 
                key={index} 
                className={`card-glow ${audience.featured ? 'ring-2 ring-primary/30' : ''} group cursor-pointer`}
              >
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl border-2 ${audience.highlight} flex items-center justify-center bg-card/50 group-hover:scale-110 transition-transform duration-300`}>
                    <audience.icon className="w-10 h-10 text-foreground" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-foreground">
                    {audience.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed flex-grow">
                    {audience.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Researchers card - centered */}
          <div className="flex justify-center">
            <Card className="card-glow group cursor-pointer max-w-md">
              <CardContent className="p-8 text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl border-2 ${audiences[4].highlight} flex items-center justify-center bg-card/50 group-hover:scale-110 transition-transform duration-300`}>
                  {React.createElement(audiences[4].icon, { className: "w-10 h-10 text-foreground" })}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  {audiences[4].title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {audiences[4].description}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;