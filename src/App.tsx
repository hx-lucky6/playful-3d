/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform } from "motion/react";
import { ArrowRight, ArrowLeft, Mail, Instagram, Linkedin, Dribbble, X, CheckCircle2, Layers, Cpu, Palette, Rocket } from "lucide-react";

const CursorFollower = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  return (
    <motion.div
      style={{
        translateX: cursorX,
        translateY: cursorY,
      }}
      className="fixed top-0 left-0 w-8 h-8 bg-primary/20 rounded-full pointer-events-none z-[9999] -ml-4 -mt-4 backdrop-blur-sm hidden md:block"
    />
  );
};

const MagneticButton: React.FC<{ children: React.ReactNode, className?: string, onClick?: () => void }> = ({ children, className, onClick }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.4);
    y.set((clientY - centerY) * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const springX = useSpring(x, { damping: 20, stiffness: 150 });
  const springY = useSpring(y, { damping: 20, stiffness: 150 });

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      className={className}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

const Navbar = ({ activeTab, setActiveTab, onHireMeClick }: { activeTab: string, setActiveTab: (tab: string) => void, onHireMeClick: () => void }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[60]"
        style={{ scaleX }}
      />
      <motion.nav 
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-6 left-1/2 w-[90%] max-w-5xl rounded-full px-6 py-3 bg-white/70 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex justify-between items-center z-50"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-black tracking-tighter text-zinc-900 cursor-pointer" 
          onClick={() => setActiveTab('work')}
        >
          UX/3D Portfolio
        </motion.div>
        <div className="hidden md:flex items-center gap-10">
          {['work', 'process', 'about'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative py-1 group"
            >
              <span className={`${activeTab === tab ? 'text-orange-600 font-extrabold' : 'text-zinc-500 font-medium'} transition-all duration-300 capitalize`}>
                {tab}
              </span>
              {activeTab === tab && (
                <motion.div 
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
            </button>
          ))}
        </div>
        <MagneticButton 
          onClick={onHireMeClick}
          className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold shadow-[0_10px_25px_rgba(166,51,0,0.3)]"
        >
          Hire Me
        </MagneticButton>
      </motion.nav>
    </>
  );
};

const HireMeModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl"
        >
          <div className="p-8 md:p-12">
            <button onClick={onClose} className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h2 className="font-headline text-4xl font-extrabold tracking-tight mb-4">Let's build something <span className="text-primary italic">extraordinary.</span></h2>
            <p className="text-zinc-500 mb-8">Ready to bring your 3D vision to life? Drop me a message and let's start the conversation.</p>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email</label>
                  <input type="email" className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Project Details</label>
                <textarea rows={4} className="w-full px-4 py-3 bg-zinc-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none" placeholder="Tell me about your project..."></textarea>
              </div>
              <button className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-primary/20">
                Send Message
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const ProcessView = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="pt-32 pb-24 px-6"
  >
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-label text-xs uppercase tracking-[0.2em] rounded-full mb-6">Workflow</span>
        <h2 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface mb-6">From Concept to <span className="text-primary italic">Reality.</span></h2>
        <p className="text-xl text-on-surface-variant max-w-2xl mx-auto">A meticulous blend of artistic vision and technical precision across every stage of the 3D pipeline.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { icon: Layers, title: "Discovery", desc: "Deep dive into brand identity, user personas, and core aesthetic goals.", color: "bg-blue-50 text-blue-500" },
          { icon: Cpu, title: "Sculpting", desc: "High-fidelity 3D modeling with focus on form, silhouette, and modularity.", color: "bg-orange-50 text-orange-500" },
          { icon: Palette, title: "Texturing", desc: "Advanced PBR material creation for hyper-realistic tactile feedback.", color: "bg-purple-50 text-purple-500" },
          { icon: Rocket, title: "Implementation", desc: "Seamless integration into digital products with optimized performance.", color: "bg-green-50 text-green-500" }
        ].map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500"
          >
            <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-6`}>
              <step.icon className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
            <p className="text-on-surface-variant leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-24 p-12 bg-zinc-900 rounded-[3rem] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent"></div>
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-4xl font-bold mb-6">Optimized for Performance</h3>
          <p className="text-zinc-400 text-lg mb-8">Every asset is engineered to be lightweight without compromising on visual fidelity. We use custom compression algorithms and LOD systems to ensure smooth 60fps experiences on all devices.</p>
          <div className="flex flex-wrap gap-4">
            {['Web GL', 'Three.js', 'React Three Fiber', 'Blender', 'Substance Painter'].map((tech, i) => (
              <span key={i} className="px-4 py-2 bg-white/10 rounded-full text-sm font-medium">{tech}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const AboutView = () => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="pt-32 pb-24 px-6"
  >
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5">
          <motion.div 
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            whileInView={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl"
          >
            <img 
              src="https://picsum.photos/seed/designer/800/800" 
              alt="Designer Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <div className="text-white font-headline text-3xl font-bold">Alex Rivera</div>
              <div className="text-white/80 font-medium">Lead 3D & UX Designer</div>
            </div>
          </motion.div>
        </div>
        <div className="lg:col-span-7">
          <span className="inline-block px-4 py-1.5 bg-secondary-container/20 text-secondary font-label text-xs uppercase tracking-[0.2em] rounded-full mb-6">The Story</span>
          <h2 className="font-headline text-5xl font-extrabold tracking-tighter mb-8">Crafting digital <span className="text-secondary italic">souls</span> for the modern web.</h2>
          <p className="text-xl text-on-surface-variant mb-8 leading-relaxed">
            With over 8 years of experience at the intersection of 3D art and user experience, I help brands bridge the gap between static interfaces and immersive digital worlds.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                UX Strategy
              </h4>
              <p className="text-on-surface-variant">Defining user flows that feel natural and intuitive in 3D spaces.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                3D Art Direction
              </h4>
              <p className="text-on-surface-variant">Creating cohesive visual languages that resonate with target audiences.</p>
            </div>
          </div>
          <div className="flex gap-6">
            <button className="px-8 py-4 bg-on-surface text-surface rounded-full font-bold hover:scale-105 transition-all">View Resume</button>
            <div className="flex items-center gap-4">
              <a href="#" className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Dribbble className="w-5 h-5" /></a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-32">
        <h3 className="font-headline text-3xl font-bold mb-12 text-center">Trusted by Global Brands</h3>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale">
          {['Stripe', 'Airbnb', 'Nike', 'Apple', 'Figma'].map((brand, i) => (
            <span key={i} className="text-3xl font-black tracking-tighter">{brand}</span>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const rotate = useTransform(scrollY, [0, 500], [0, 15]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 px-6 overflow-hidden">
      <motion.div 
        style={{ y: y1 }}
        className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] bg-primary-container/20 blur-[120px] rounded-full -z-10"
      ></motion.div>
      <motion.div 
        style={{ y: y2 }}
        className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%] bg-secondary-container/20 blur-[120px] rounded-full -z-10"
      ></motion.div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 z-10"
        >
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-block px-4 py-1.5 bg-surface-container-highest text-on-surface-variant font-label text-xs uppercase tracking-[0.2em] rounded-full mb-8"
          >
            Case Study: Final Reveal
          </motion.span>
          <h1 className="font-headline text-[clamp(3rem,8vw,5.5rem)] font-extrabold leading-[0.95] tracking-tighter text-on-surface mb-8">
            { "The Perfect Dimension.".split(" ").map((word, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (i * 0.1), duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block mr-4 last:mr-0"
              >
                {word === "Perfect" ? <span className="text-primary italic">{word}</span> : word}
              </motion.span>
            ))}
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-lg md:text-xl text-on-surface-variant max-w-md leading-relaxed mb-10"
          >
            Bridging the gap between 2D interfaces and 3D playfulness. A complete modular ecosystem for the next generation of digital identity.
          </motion.p>
          <motion.div 
            whileHover={{ x: 10 }}
            className="flex items-center gap-4 cursor-pointer group"
          >
            <MagneticButton className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
              <span className="material-symbols-outlined text-primary group-hover:text-white">play_arrow</span>
            </MagneticButton>
            <span className="font-semibold text-on-surface">Watch Process Reel</span>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 relative"
        >
          <motion.div 
            style={{ rotate }}
            className="relative w-full aspect-[4/5] md:aspect-square flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-white/30 backdrop-blur-3xl rounded-[4rem] rotate-3 -z-10 shadow-inner"></div>
            <motion.img 
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              alt="3D Character" 
              className="w-[110%] h-[110%] object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)] scale-110 -translate-y-8" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjU_hhS97d1462gGi54i37YpToqLdzrtIkgm31C90GBPhUjTtBN61JahmWQYV2DP5YSeuCgJXKQPfS9V93lhmBJeS78drBx15yHg4C7zhr4EpBX9pEztUZ2Spd5K2wUw2HJNpVemj_w79DMWo34_2vxl0c_05wYLuKiwS-VYUtM--dMstghNW9WoYVuzGiZyXoqfb-nvzDGPo9_ws1lcULq0OrB5ZDA3bKkFivv8HJLyyCEvv3mfREr8BCWLlZmr7OHPEkrHX1ow"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const StatItem: React.FC<{ stat: any, index: number }> = ({ stat, index }) => {
  const [count, setCount] = useState(0);
  const targetValue = parseInt(stat.value) || 0;
  const isPlus = stat.value.includes('+');
  const isPercent = stat.value.includes('%');

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = targetValue / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [targetValue]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      className="flex flex-col items-center md:items-start text-center md:text-left space-y-4"
    >
      <span className={`font-headline text-7xl font-black ${stat.color} tracking-tighter`}>
        {isPlus && '+'}{count}{isPercent && '%'}{!isPlus && !isPercent && stat.value}
      </span>
      <div className="space-y-1">
        <h3 className="font-bold text-xl text-on-surface">{stat.label}</h3>
        <p className="text-on-surface-variant max-w-[240px]">{stat.desc}</p>
      </div>
    </motion.div>
  );
};

const Stats = () => (
  <section className="py-32 px-6 bg-surface-container-low">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6">
        {[
          { label: "User Activity", value: "+120%", color: "text-primary", desc: "Significant boost in session duration through interactive avatar customization." },
          { label: "Modular Components", value: "500+", color: "text-on-surface", desc: "A massive library of interchangeable assets for infinite combinations." },
          { label: "Brand Recognition", value: "A+", color: "text-secondary", desc: "Defined a unique visual language that stands out in a saturated market." }
        ].map((stat, i) => (
          <StatItem key={i} stat={stat} index={i} />
        ))}
      </div>
    </div>
  </section>
);

const Collection = () => (
  <section className="py-32 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div className="max-w-xl">
          <h2 className="font-headline text-5xl font-extrabold tracking-tight mb-6">The Curated Collection</h2>
          <p className="text-lg text-on-surface-variant">Exploring the diverse range of characters and pets designed to create an emotional connection with users.</p>
        </div>
        <div className="flex gap-4">
          <button className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-surface-container-highest transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button className="w-14 h-14 rounded-full bg-on-surface text-surface flex items-center justify-center hover:opacity-90 transition-opacity">
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Main Feature */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -10, rotateX: 5, rotateY: -5 }}
          viewport={{ once: true }}
          className="md:col-span-8 group relative bg-surface-container-lowest rounded-xl overflow-hidden p-8 flex flex-col md:flex-row items-center gap-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] transition-all duration-500 perspective-1000"
        >
          <div className="flex-1 space-y-4 order-2 md:order-1">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">Hero Character</span>
            <h3 className="text-4xl font-bold font-headline">Urban Explorer</h3>
            <p className="text-on-surface-variant max-w-xs">Engineered with 48 points of articulation and 200+ unique material shaders.</p>
            <div className="flex gap-2 pt-4">
              <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-bold uppercase tracking-wider">Rigged</span>
              <span className="px-3 py-1 bg-surface-container rounded-full text-xs font-bold uppercase tracking-wider">4K Textures</span>
            </div>
          </div>
          <div className="flex-1 order-1 md:order-2">
            <img 
              alt="Urban Explorer Avatar" 
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQUEvcSWsC9zdM7mVC60Y4XnTMNiyawJNvzC9kQRXyNfvgUfGgUKyiQJCpO6TTislS_gr5GzG_2_6pKe7ZVk0bOoG9Ei-pE0to5xwbMhWFeijZSRMSHGlkU3pfxh1SaOLLj02Eox5flOYrW_xcvn85Sxjeh1qZ0l03SOFe-Oqi_gTdQ7p7a0Wkfzg0DrQYVJWFYPY5dwSVbM5l8TCDOdtTEo54Q48WlenhVydjXP7xSx98ZcuFs-lKJmRylcfygLPGgn7RyQ6jWw"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Side Asset */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ y: -10, rotateX: -5, rotateY: 5 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="md:col-span-4 group relative bg-secondary-container/30 rounded-xl overflow-hidden p-8 flex flex-col justify-between shadow-[0_10px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] transition-all duration-500 perspective-1000"
        >
          <div>
            <h3 className="text-2xl font-bold font-headline mb-2">Digital Companions</h3>
            <p className="text-sm text-on-secondary-container">Procedurally generated pet variants.</p>
          </div>
          <div className="h-64 mt-4">
            <img 
              alt="3D Pet" 
              className="w-full h-full object-contain group-hover:rotate-6 transition-transform duration-500" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPuLjvC_9JFCd4-6iHSUdVGTq_CGJDz2ByMOB62I7duOEuq0xhmtmgGp22M4qGz77L3RarU4EDmaWyljRrgMAe7pkiTw6iGdb5Dn6iokJ1wEWiQvvNKmRueF3-DvxpKOs6kqxxwNPU7fUGgzH3EMjF10oKu105NkY6HYYeORUxc8RsJZ8jv7PjcNdU6RPVgOQR3qEt1A2GBHXKvpsT-VNAMX146FYIYxKqfGgYbDR60p9FR6GlJgJz3pno9eRveTJom7D2yFrHXQ"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Detail: Textures */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="md:col-span-4 group relative bg-surface-container-low rounded-xl overflow-hidden p-8 flex flex-col justify-between hover:bg-surface-container-highest transition-colors duration-500"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-primary">texture</span>
            </div>
            <h3 className="text-2xl font-bold font-headline">Tactile Fidelity</h3>
            <p className="text-sm text-on-surface-variant">Focusing on material realism from matte plastics to soft-touch fabrics.</p>
          </div>
          <div className="mt-8 flex -space-x-4">
            <div className="w-16 h-16 rounded-full border-4 border-surface bg-primary-container"></div>
            <div className="w-16 h-16 rounded-full border-4 border-surface bg-secondary-container"></div>
            <div className="w-16 h-16 rounded-full border-4 border-surface bg-tertiary-container"></div>
          </div>
        </motion.div>

        {/* Large Asset: Neon Punk */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="md:col-span-8 group relative bg-zinc-900 rounded-xl overflow-hidden p-0 flex flex-col md:flex-row shadow-[0_30px_60px_rgba(0,0,0,0.2)]"
        >
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center space-y-6">
            <h3 className="text-3xl font-bold font-headline text-white">Neon Punk <br/><span className="text-orange-400">Night Edition</span></h3>
            <p className="text-zinc-400">A special edition release utilizing emissive maps and volumetric lighting effects.</p>
            <button className="self-start px-6 py-2 border border-zinc-700 text-white rounded-full text-sm font-bold hover:bg-zinc-800 transition-colors">View Variant</button>
          </div>
          <div className="md:w-1/2 relative bg-gradient-to-br from-zinc-800 to-zinc-900 h-80 md:h-auto overflow-hidden">
            <img 
              alt="Neon Character" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:scale-110 transition-transform duration-700" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCr6Mktu5PeU6XRpKMB1leKfjd1qbWamuZiE6jWXn_sN4p3Bo-Fga3qkUoFvoXKayoo6n6rXI-BACLKgbu5x5qysxff1liHraqPkIuJhA4YSw-rcIH3VO7Y9rkJyS-GLSsmKNyva2N3z0SkPL8XGVWlQ0zIunl5x7vjCjHfl8o84y8Y0zHPHAsWt0aErp97w8Lisv8N8-1yTj0frNi9MRb5jc_fF7JjHhSG8VAi2vd4SmzHbsqPeALqEWxJZ1RSQpPFsU-3yhlGQ"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="relative py-48 px-6 text-center overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
    <div className="max-w-4xl mx-auto">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter mb-10 text-on-surface"
      >
        Ready to open the <br/><span className="text-primary italic">new era?</span>
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-xl text-on-surface-variant mb-12 max-w-2xl mx-auto leading-relaxed"
      >
        Transforming standard user interfaces into memorable digital experiences. Let's build something that moves.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-6"
      >
        <button className="px-10 py-5 bg-primary text-on-primary rounded-full text-lg font-bold hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_20px_40px_rgba(166,51,0,0.3)]">
          Start a Project
        </button>
        <button className="px-10 py-5 bg-surface-container-highest text-on-surface rounded-full text-lg font-bold hover:bg-surface-container-high transition-all duration-300">
          Download Portfolio
        </button>
      </motion.div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="w-full pt-24 pb-12 px-8 bg-zinc-50 flex flex-col md:flex-row justify-between items-end max-w-7xl mx-auto gap-8">
    <div className="flex flex-col gap-6 items-start">
      <div className="text-lg font-bold text-zinc-900 uppercase tracking-[0.3em]">Editorial Playful</div>
      <p className="font-body text-sm tracking-wide uppercase font-semibold text-zinc-400 max-w-xs">
        © 2024 Editorial Playful. Crafted for 3D Worlds.
      </p>
    </div>
    <div className="flex gap-8">
      {[
        { icon: Linkedin, label: "LinkedIn" },
        { icon: Dribbble, label: "Dribbble" },
        { icon: Instagram, label: "Instagram" },
        { icon: Mail, label: "Email" }
      ].map((social, i) => (
        <MagneticButton key={i}>
          <a 
            className="font-body text-sm tracking-wide uppercase font-semibold text-zinc-400 hover:text-orange-500 transition-colors hover:underline flex items-center gap-2" 
            href="#"
          >
            <social.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{social.label}</span>
          </a>
        </MagneticButton>
      ))}
    </div>
  </footer>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('work');
  const [isHireMeOpen, setIsHireMeOpen] = useState(false);

  return (
    <div className="min-h-screen selection:bg-primary-container selection:text-on-primary-container cursor-none md:cursor-auto">
      <CursorFollower />
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onHireMeClick={() => setIsHireMeOpen(true)} 
      />
      
      <HireMeModal isOpen={isHireMeOpen} onClose={() => setIsHireMeOpen(false)} />

      <main className="w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'work' && (
            <motion.div key="work">
              <Hero />
              <Stats />
              <Collection />
              <CTA />
            </motion.div>
          )}
          {activeTab === 'process' && <ProcessView key="process" />}
          {activeTab === 'about' && <AboutView key="about" />}
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
}
