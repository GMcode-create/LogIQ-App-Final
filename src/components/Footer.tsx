import { Code2, Instagram, BarChart3 } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { motion } from "framer-motion";

const Footer = () => {


  const socialLinks = [
    { href: "https://instagram.com/logiq", icon: Instagram, label: "Instagram", color: "text-slate-400 hover:text-purple-400" }
  ];

  return (
    <footer className="py-8 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent" style={{ backgroundPosition: '100% 0%' }} />
      </div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced LogiQ branding */}
          <ScrollReveal variant="fadeUp" delay={0.2}>
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Code2 className="w-5 h-5 text-white" />
                </motion.div>
                <span className="text-lg font-bold text-white">LogiQ</span>
              </div>
              <motion.p 
                className="text-cyan-400 text-sm font-semibold mb-2 flex items-center justify-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <BarChart3 className="w-3 h-3" />
                Algorithm Visualization Redefined
              </motion.p>
              <motion.p 
                className="text-slate-300 leading-relaxed max-w-md mx-auto text-xs"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Empowering students, educators, and developers with interactive 
                algorithm visualizations and performance benchmarking tools.
              </motion.p>
            </div>
          </ScrollReveal>

          {/* Bottom section with all elements aligned */}
          <ScrollReveal variant="fadeUp" delay={0.6}>
            <div className="flex items-center justify-center pt-4 mt-4 border-t border-slate-700/50">
              <motion.div 
                className="flex items-center gap-3 text-xs"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <p className="text-slate-500">
                  © 2024 LogiQ. All Rights Reserved.
                </p>
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item, index) => (
                  <motion.a 
                    key={item}
                    href={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-slate-500 hover:text-cyan-400 transition-colors duration-300"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item}
                  </motion.a>
                ))}
                {/* Instagram icon without box */}
                {socialLinks.map((social, index) => (
                  <motion.a 
                    key={social.label}
                    href={social.href} 
                    className={`${social.color} hover:scale-110 transition-all duration-300 group`}
                    aria-label={social.label}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <social.icon className="w-4 h-4 group-hover:animate-pulse" />
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </footer>
  );
};

export default Footer;