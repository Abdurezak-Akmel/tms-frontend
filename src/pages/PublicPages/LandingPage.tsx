import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2, Play, Star, Shield,
  Zap, Users, BookOpen, Lock, LayoutDashboard, MonitorPlay,
  CreditCard, ArrowRight, GraduationCap, Award,
  ChevronDown, Twitter, Linkedin, Facebook, Menu, X,
  Lightbulb, TrendingUp, Briefcase, Code, BarChart, Settings,
  Smartphone, Bell, Heart, Link as LinkIcon, Clock
} from 'lucide-react';

// ==========================================
// 1. Navigation
// ==========================================
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
              HabeshaTech
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Features</a>
            <a href="#demo" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Demo</a>
            <a href="#pricing" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Pricing</a>
            <div className="flex items-center gap-4 ml-4">
              <Link to="/user-login" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">Log In</Link>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-indigo-200">
                Sign Up
              </button>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu (Simplified) */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4">
          <div className="flex flex-col space-y-4">
            <a href="#features" className="text-slate-600 font-medium">Features</a>
            <a href="#demo" className="text-slate-600 font-medium">Demo</a>
            <a href="#pricing" className="text-slate-600 font-medium">Pricing</a>
            <Link to="/user-login" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">Log In</Link>
            <button className="w-full bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium">Sign Up</button>
          </div>
        </div>
      )}
    </nav>
  );
};

// ==========================================
// 2. Hero Section
// ==========================================
const HeroSection = () => (
  <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative">
    {/* Background Decorations */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-400 to-purple-400 blur-[100px] rounded-full mix-blend-multiply"></div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-8">
        <SparklesIcon className="w-4 h-4" />
        <span>AI-Based Full Stack Website Development</span>
      </div>

      <h1 className="text-5xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
        Master Full Stack Web Systems Design and Development<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
          From Software Requirements Specification (SRS) to Deployment
        </span>
      </h1>

      <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
        At HabeshaTech, you learn not how to write code in python or javascript, but you learn how to develop the entire web system your clients need.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-lg transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 group">
          Sign Up
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
        <button className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2">
          <Play className="w-5 h-5 text-indigo-600" />
          Watch the Introduction
        </button>
      </div>

      <p className="mt-6 text-md text-slate-500">Free HTML + CSS + Basic Javascript Course. Just sign up and get the courses.</p>
    </div>
  </section>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

// ==========================================
// 3. Trusted By
// ==========================================
// const TrustedBy = () => (
//   <section className="py-10 border-y border-slate-200 bg-white">
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//       <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Trusted by leading educators and institutions</p>
//       <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
//         {/* Placeholder Logos */}
//         {['Acme University', 'GlobalTech Tutors', 'CodeAcademy Pro', 'LinguaLearn', 'DesignMasters'].map((brand) => (
//           <div key={brand} className="text-xl font-bold font-serif text-slate-800 flex items-center gap-2">
//             <Globe className="w-6 h-6" /> {brand}
//           </div>
//         ))}
//       </div>
//     </div>
//   </section>
// );

// ==========================================
// 4. Product Demo
// ==========================================
const ProductDemo = () => (
  <section id="demo" className="py-24 bg-slate-50 relative">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">See Lumina in Action</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Experience the seamlessly crafted interface designed for minimal friction and maximum learning.</p>
      </div>

      <div className="relative mx-auto max-w-5xl rounded-2xl bg-slate-900 p-2 shadow-2xl overflow-hidden ring-1 ring-white/10">
        <div className="flex items-center px-4 py-3 border-b border-white/10">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
        </div>
        <div className="aspect-video bg-slate-800 relative group cursor-pointer overflow-hidden rounded-b-xl border border-white/5 flex items-center justify-center">
          {/* Fake Dashboard Screenshot Background */}
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>

          {/* Play Button */}
          <div className="relative z-10 w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ==========================================
// 5. Key Features Overview
// ==========================================
const KeyFeatures = () => {
  const features = [
    { icon: <LayoutDashboard />, title: 'Intuitive Dashboard', desc: 'Get a bird’s-eye view of your academy’s performance, revenue, and student engagement.' },
    { icon: <MonitorPlay />, title: 'Rich Media Player', desc: 'Secure, high-quality video playback with resume-state, captioning, and speed controls.' },
    { icon: <Shield />, title: 'Role-Based Access', desc: 'Granular permissions for Admins, Instructors, and Students to ensure data security.' },
    { icon: <CreditCard />, title: 'Integrated Payments', desc: 'Accept payments globally with seamless Stripe and PayPal integrations.' },
    { icon: <Zap />, title: 'Automated Workflows', desc: 'Trigger emails, grant access, and issue certificates automatically.' },
    { icon: <Award />, title: 'Certifications', desc: 'Auto-generate and issue beautiful certificates upon course completion.' },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything You Need to Scale</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Powerful features wrapped in an elegant interface.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 6. Access Model Explanation
// ==========================================
const AccessModel = () => (
  <section className="py-24 bg-slate-900 text-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Designed for Every Participant</h2>
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            LuminaTMS securely separates environments based on user roles, ensuring that everyone gets exactly the tools they need without the clutter.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 bg-blue-500/20 p-2 rounded-lg text-blue-400 h-fit"><Shield className="w-6 h-6" /></div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Super Admin</h4>
                <p className="text-slate-400">Full system control, financial reporting, and user management.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 bg-purple-500/20 p-2 rounded-lg text-purple-400 h-fit"><Users className="w-6 h-6" /></div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Instructors</h4>
                <p className="text-slate-400">Course creation, student analytics, and assignment grading.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 bg-green-500/20 p-2 rounded-lg text-green-400 h-fit"><BookOpen className="w-6 h-6" /></div>
              <div>
                <h4 className="text-xl font-semibold mb-1">Students</h4>
                <p className="text-slate-400">Focused learning environment, progress tracking, and community access.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          {/* Mockup illustration */}
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 blur-[80px] opacity-30 rounded-full"></div>
          <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700" />
                <div><div className="h-4 w-24 bg-slate-700 rounded mb-2" /><div className="h-3 w-16 bg-slate-700 rounded" /></div>
              </div>
              <div className="h-8 w-24 bg-indigo-600/20 border border-indigo-500/30 rounded text-indigo-400 text-xs flex items-center justify-center font-bold">Admin Panel</div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-slate-700/50 rounded-lg flex items-center px-4 gap-4">
                  <div className="w-8 h-8 rounded bg-slate-600" />
                  <div className="flex-1"><div className="h-3 w-1/3 bg-slate-600 rounded" /></div>
                  <div className="h-3 w-12 bg-slate-600 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ==========================================
// 7. How It Works
// ==========================================
const HowItWorks = () => {
  const steps = [
    { num: '01', title: 'Create Your Course', desc: 'Upload videos, add resources, and structure your curriculum with our drag-and-drop builder.' },
    { num: '02', title: 'Set Price & Access', desc: 'Define pricing tiers, payment plans, or roles required to access the content.' },
    { num: '03', title: 'Launch & Earn', desc: 'Publish your course and instantly accept students and payments securely.' },
  ];

  return (
    <section className="py-24 bg-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-xl text-slate-600">From creation to profit in three simple steps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector Line (hidden on mobile) */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-indigo-200"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 mb-6 shadow-xl">
                {step.num}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 8. Testimonials
// ==========================================
const Testimonials = () => (
  <section className="py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Loved by Educators Worldwide</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: 'Sarah Jenkins', role: 'Dev Bootcamp Founder', text: 'Lumina completely transformed how we deliver our curriculum. The admin dashboard saves me 10 hours a week.' },
          { name: 'Marcus Chen', role: 'Language Instructor', text: 'The video playback is extremely smooth, and my students constantly praise the beautiful UI.' },
          { name: 'Elena Rodriguez', role: 'Corporate Trainer', text: 'Role-based access was the game-changer for us. B2B client management is now a breeze.' }
        ].map((testimonial, idx) => (
          <div key={idx} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-lg shadow-slate-100 flex flex-col">
            <div className="flex text-yellow-400 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <p className="text-slate-700 text-lg mb-8 flex-1">"{testimonial.text}"</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                {testimonial.name.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-slate-900">{testimonial.name}</div>
                <div className="text-sm text-slate-500">{testimonial.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ==========================================
// 9. Pricing
// ==========================================
const Pricing = () => {
  const plans = [
    { name: 'Starter', price: '$49', desc: 'Perfect for new instructors.', features: ['Up to 100 Students', 'Unlimited Courses', 'Basic Analytics', 'Community Support'] },
    { name: 'Professional', price: '$99', desc: 'For growing academies.', popular: true, features: ['Unlimited Students', 'Custom Domain', 'Advanced Analytics', 'Priority Support', 'Certificates'] },
    { name: 'Enterprise', price: 'Custom', desc: 'For massive scale.', features: ['Dedicated Account Manager', 'White-labeling', 'API Access', 'Custom Integrations', 'SLA'] },
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-slate-600">Grow your business without unpredictable costs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <div key={idx} className={`relative p-8 rounded-2xl bg-white border ${plan.popular ? 'border-indigo-500 shadow-2xl shadow-indigo-100 scale-105 z-10' : 'border-slate-200 shadow-lg'}`}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-slate-500 mb-6">{plan.desc}</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-slate-900">{plan.price}</span>
                {plan.price !== 'Custom' && <span className="text-slate-500">/mo</span>}
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-bold transition-colors ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
                {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 10. FAQ
// ==========================================
const FAQ = () => {
  const faqs = [
    { q: 'Can I host my own videos?', a: 'Yes! Lumina provides secure, encrypted video hosting out of the box so your content cannot be downloaded without permission.' },
    { q: 'Do you take a cut of my sales?', a: 'No, we charge a flat monthly subscription. You keep 100% of the revenue from your courses (standard payment gateway fees apply).' },
    { q: 'Can I migrate my students from another platform?', a: 'Absolutely. We offer an easy CSV import tool, and our support team can assist you with large migrations.' },
    { q: 'Is there a limit on bandwidth or storage?', a: 'Our Professional plan includes generous storage and bandwidth that easily accommodates 99% of creators. Enterprise plans have uncapped limits.' }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group border border-slate-200 rounded-xl bg-white [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-900 text-lg">
                {faq.q}
                <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// 11. CTA Section
// ==========================================
const CTASection = () => (
  <section className="py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-indigo-600 rounded-3xl p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 opacity-20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Build Your Academy?</h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join thousands of educators scaling their businesses on Lumina. Start your 14-day free trial today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors shadow-xl">
              Start Free Trial
            </button>
            <button className="px-8 py-4 bg-indigo-700 text-white rounded-xl font-bold text-lg hover:bg-indigo-800 transition-colors border border-indigo-500">
              Talk to Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ==========================================
// 12. Footer
// ==========================================
const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
        <div className="col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-white">LuminaTMS</span>
          </div>
          <p className="text-slate-400 max-w-sm mb-6">
            Empowering the world's best educators to build, manage, and scale their online learning academies.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Product</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Use Cases</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Integration</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Resources</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
            <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Company</h4>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-white transition-colors">About</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-800 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} LuminaTMS Inc. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// ==========================================
// NEW: Benefits / Value Proposition
// ==========================================
const Benefits = () => (
  <section className="py-24 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative">
          <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-3xl opacity-20 transform -rotate-6"></div>
          <div className="relative bg-white border border-slate-100 p-8 rounded-3xl shadow-xl space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shrink-0"><TrendingUp /></div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Increase Course Completion</h4>
                <p className="text-slate-600">Our distraction-free learner interface is engineered to keep students engaged from start to finish.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 shrink-0"><Clock /></div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Save Hours on Admin</h4>
                <p className="text-slate-600">Automated enrollment, instant receipt generation, and self-serve password resets free up your day.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shrink-0"><Heart /></div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">Build a Loyal Brand</h4>
                <p className="text-slate-600">Fully white-labeled. Your colors, your domain, and your identity front and center.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Why Choose Lumina?</h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Stop duct-taping generic plugins together. Lumina is a purpose-built engine that optimizes the two most important metrics for your academy: your revenue and your students' success.
          </p>
          <ul className="space-y-4">
            {['Zero transaction fees on our end', '99.9% uptime SLA guaranteed', 'Bank-level encryption for video assets', 'World-class 24/7 technical support'].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium">
                <CheckCircle2 className="w-5 h-5 text-indigo-600" /> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

// ==========================================
// NEW: Target Users
// ==========================================
const TargetUsers = () => {
  const users = [
    { icon: <Briefcase />, title: 'Corporate Trainers', desc: 'Securely train employees and track compliance with robust reporting tools.' },
    { icon: <Code />, title: 'Tech Educators', desc: 'Host coding bootcamps with rich media integration and sequential unlocking.' },
    { icon: <Lightbulb />, title: 'Solo Creators', desc: 'Turn your expertise into a passive income stream without technical headaches.' },
  ];

  return (
    <section className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Is Lumina For?</h2>
          <p className="text-xl text-slate-400">Flexibility to adapt to any educational business model.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {users.map((user, idx) => (
            <div key={idx} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors">
              <div className="w-14 h-14 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center mb-6">
                {user.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{user.title}</h3>
              <p className="text-slate-400 leading-relaxed">{user.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// NEW: Admin Capabilities & Student Expr.
// ==========================================
const DeepDive = () => (
  <section className="py-24 bg-slate-50 border-y border-slate-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
      {/* Admin */}
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200 text-slate-700 text-sm font-semibold mb-6">
            <Settings className="w-4 h-4" /> Admin Capabilities
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Command Central for Your Business</h2>
          <p className="text-lg text-slate-600 mb-8">
            Manage everything from a single, lightning-fast dashboard. Monitor student progress, handle refunds, and adjust permissions in clicks, not hours.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <BarChart className="w-8 h-8 text-indigo-600 mb-3" />
              <h4 className="font-bold text-slate-900">Advanced Analytics</h4>
              <p className="text-sm text-slate-500">Track drop-off rates and video engagement.</p>
            </div>
            <div>
              <Users className="w-8 h-8 text-indigo-600 mb-3" />
              <h4 className="font-bold text-slate-900">Bulk Management</h4>
              <p className="text-sm text-slate-500">Import/export users and edit roles at scale.</p>
            </div>
          </div>
        </div>
        <div className="relative rounded-2xl bg-white p-2 shadow-xl border border-slate-200">
          {/* Mock Admin UI */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div className="font-bold text-slate-800">Revenue Overview</div>
              <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">+14% this week</div>
            </div>
            <div className="space-y-3">
              {[80, 45, 90, 60].map((w, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 text-xs text-slate-400">Day {i + 1}</div>
                  <div className="flex-1 bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${w}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Student */}
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1 relative rounded-2xl bg-slate-900 p-2 shadow-2xl overflow-hidden">
          {/* Mock Student UI */}
          <div className="absolute inset-0 bg-indigo-500/10 blur-xl"></div>
          <div className="relative bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-start gap-4 mb-6 pb-6 border-b border-slate-700">
              <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center"><Play className="text-white" /></div>
              <div>
                <div className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">Module 3</div>
                <div className="text-white font-bold text-lg">Advanced State Management</div>
              </div>
            </div>
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Course Progress</span>
              <span>68%</span>
            </div>
            <div className="bg-slate-700 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full w-[68%]"></div>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
            <Smartphone className="w-4 h-4" /> Student Experience
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">An Interface They Will Love</h2>
          <p className="text-lg text-slate-600 mb-8">
            We removed the friction so your students can focus entirely on learning. Beautiful typography, intuitive navigation, and perfectly responsive across all devices.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <MonitorPlay className="w-8 h-8 text-indigo-600 mb-3" />
              <h4 className="font-bold text-slate-900">Distraction-Free</h4>
              <p className="text-sm text-slate-500">Theater mode and clean sidebar navigation.</p>
            </div>
            <div>
              <Bell className="w-8 h-8 text-indigo-600 mb-3" />
              <h4 className="font-bold text-slate-900">Smart Resumes</h4>
              <p className="text-sm text-slate-500">Picks up right where they left off, automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// ==========================================
// NEW: Request & Payment Flow
// ==========================================
const PaymentFlow = () => {
  const flow = [
    { icon: <LinkIcon />, title: '1. Share Link', desc: 'Send your checkout link or embed it on your site.' },
    { icon: <CreditCard />, title: '2. Secure Checkout', desc: 'Student pays via Stripe or PayPal instantly.' },
    { icon: <Lock />, title: '3. Auto-Access', desc: 'Account created and course unlocked automatically.' },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frictionless Enrollment Flow</h2>
          <p className="text-xl text-slate-600">Zero manual intervention required to process new students.</p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 pl-0 md:pl-10">
          {flow.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="text-center w-full md:w-64">
                <div className="mx-auto w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-lg border border-indigo-100 mb-6 group-hover:bg-indigo-600 [&>svg]:w-8 [&>svg]:h-8">
                  {step.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h4>
                <p className="text-slate-500">{step.desc}</p>
              </div>
              {idx < flow.length - 1 && (
                <div className="hidden md:block text-slate-300">
                  <ArrowRight className="w-8 h-8" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// MAIN PAGE EXPORT
// ==========================================
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      <main>
        <HeroSection />
        {/* <TrustedBy /> */}
        <KeyFeatures />
        <HowItWorks />
        <PaymentFlow />
        <DeepDive />
        <AccessModel />
        <ProductDemo />
        <Benefits />
        <TargetUsers />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;