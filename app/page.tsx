'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { AuroraBackground } from '@/components/aurora-background'
import { CloudLogo } from '@/components/cloud-logo'
import { 
  Cloud, 
  CheckCircle2, 
  XCircle,
  ArrowRight, 
  PlayCircle,
  Shield,
  Mic,
  Zap,
  FolderOpen,
  FileText,
  Sparkles,
  Grid2x2,
  Minus,
  Maximize2,
  X,
  Globe,
  Monitor,
  Heart,
  Lock,
  BookOpen,
  Code2,
  HelpCircle,
  ChevronUp
} from 'lucide-react'

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState('home')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400)
      
      // Update active section based on scroll position
      const sections = ['home', 'features', 'about', 'pricing', 'docs']
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden scroll-smooth">
      <AuroraBackground />
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 h-[60px] flex items-center justify-between px-6 lg:px-12" style={{
        background: 'rgba(13, 17, 23, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        <div className="flex items-center gap-2.5">
          <CloudLogo size={34} />
          <span className="font-bold text-lg text-white tracking-wide">CloudOS</span>
        </div>
        
        <div className="hidden md:flex items-center gap-5">
          {[
            { label: 'Features', id: 'features' },
            { label: 'About', id: 'about' },
            { label: 'Pricing', id: 'pricing' },
            { label: 'Docs', id: 'docs' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-sm transition-colors ${
                activeSection === item.id ? 'text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Link 
            href="/auth?mode=signin"
            className="h-9 px-4 flex items-center rounded border border-white/15 text-sm text-white hover:border-white/30 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/auth"
            className="h-9 px-4 flex items-center rounded bg-[#0078D4] text-sm font-semibold text-white hover:bg-[#1084D8] transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section id="home" className="min-h-[calc(100vh-60px)] flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 lg:py-0">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Column */}
            <div className="flex-1 max-w-[560px]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded border" style={{
                background: 'rgba(108, 203, 95, 0.10)',
                borderColor: 'rgba(108, 203, 95, 0.25)',
              }}>
                <CheckCircle2 className="w-3 h-3 text-[#6CCB5F]" />
                <span className="text-xs font-medium text-[#6CCB5F]">Free forever. No credit card.</span>
              </div>
              
              <h1 className="mt-5 text-4xl lg:text-6xl font-extrabold text-white leading-[1.1] text-balance">
                Your computer<br />lives in the cloud.
              </h1>
              
              <p className="mt-5 text-lg text-white/60 leading-relaxed">
                Most people cannot afford a laptop.<br />
                We built a full computer that runs<br />
                in any browser, on any device,<br />
                anywhere in the world. For free.
              </p>
              
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <Link 
                  href="/auth"
                  className="h-12 px-6 flex items-center gap-2 rounded bg-[#0078D4] text-[15px] font-semibold text-white hover:bg-[#1084D8] hover:scale-[1.02] transition-all"
                >
                  Open CloudOS
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="h-12 px-6 flex items-center gap-2 rounded border border-white/15 text-[15px] text-white/70 hover:border-white/30 hover:text-white transition-all">
                  <PlayCircle className="w-4 h-4" />
                  See how it works
                </button>
              </div>
              
              <div className="mt-6 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[
                    { initial: 'A', gradient: 'linear-gradient(135deg, #0078D4, #60CDFF)' },
                    { initial: 'C', gradient: 'linear-gradient(135deg, #6CCB5F, #0078D4)' },
                    { initial: 'P', gradient: 'linear-gradient(135deg, #C239B3, #0078D4)' },
                  ].map((avatar, i) => (
                    <div 
                      key={i}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white border-2 border-[#0f0f23]"
                      style={{ background: avatar.gradient }}
                    >
                      {avatar.initial}
                    </div>
                  ))}
                </div>
                <span className="text-[13px] text-white/40">
                  Joined by 12,000+ users from 47 countries
                </span>
              </div>
            </div>
            
            {/* Right Column - Windows 11 Desktop Mockup */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div 
                className="relative max-w-[560px] w-full rounded-[10px] overflow-hidden"
                style={{
                  background: '#1e1e1e',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 32px 80px rgba(0, 0, 0, 0.70)',
                  transform: 'rotate(-2deg)',
                }}
              >
                {/* Windows 11 Title Bar */}
                <div className="h-9 flex items-center justify-between px-0" style={{ background: '#202020', borderBottom: '1px solid rgba(255, 255, 255, 0.07)' }}>
                  <div className="flex items-center gap-2 pl-3">
                    <CloudLogo size={16} />
                    <span className="text-[11px] text-white/80 font-medium">CloudOS</span>
                  </div>
                  <div className="flex">
                    <div className="w-[46px] h-9 flex items-center justify-center hover:bg-white/10">
                      <Minus className="w-[10px] h-[10px] text-white/70" />
                    </div>
                    <div className="w-[46px] h-9 flex items-center justify-center hover:bg-white/10">
                      <Maximize2 className="w-[10px] h-[10px] text-white/70" />
                    </div>
                    <div className="w-[46px] h-9 flex items-center justify-center hover:bg-[#E81123] rounded-tr-[10px]">
                      <X className="w-[10px] h-[10px] text-white/70" />
                    </div>
                  </div>
                </div>
                
                {/* Desktop Area */}
                <div className="relative h-[320px] overflow-hidden" style={{ background: '#1a1a2e' }}>
                  {/* Mini Aurora */}
                  <div className="absolute w-[200px] h-[200px] rounded-full top-0 left-0" style={{ background: 'rgba(0, 120, 212, 0.15)', filter: 'blur(60px)' }} />
                  <div className="absolute w-[150px] h-[150px] rounded-full bottom-8 right-0" style={{ background: 'rgba(96, 205, 255, 0.10)', filter: 'blur(50px)' }} />
                  
                  {/* Star dots */}
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 rounded-full bg-white/30"
                      style={{
                        left: `${10 + (i * 12)}%`,
                        top: `${15 + ((i % 3) * 25)}%`,
                      }}
                    />
                  ))}
                  
                  {/* Window 1 - File Explorer */}
                  <div 
                    className="absolute top-4 left-4 w-[200px] h-[130px] rounded-md overflow-hidden"
                    style={{ 
                      background: 'rgba(28, 28, 28, 0.97)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    <div className="h-5 flex items-center justify-between px-2" style={{ background: 'rgba(40, 40, 40, 0.98)' }}>
                      <div className="flex items-center gap-1.5">
                        <FolderOpen className="w-[10px] h-[10px] text-[#FFA500]" />
                        <span className="text-[10px] text-white/80 truncate">File Explorer</span>
                      </div>
                      <div className="flex">
                        <div className="w-[18px] h-5 flex items-center justify-center hover:bg-white/10">
                          <Minus className="w-[8px] h-[8px] text-white/60" />
                        </div>
                        <div className="w-[18px] h-5 flex items-center justify-center hover:bg-white/10">
                          <Maximize2 className="w-[8px] h-[8px] text-white/60" />
                        </div>
                        <div className="w-[18px] h-5 flex items-center justify-center hover:bg-[#E81123]">
                          <X className="w-[8px] h-[8px] text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3 flex gap-4">
                      {['Documents', 'Downloads'].map((folder) => (
                        <div key={folder} className="flex flex-col items-center gap-1">
                          <FolderOpen className="w-6 h-6 text-[#FFA500]" />
                          <span className="text-[8px] text-white/60 truncate">{folder}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Window 2 - Notepad */}
                  <div 
                    className="absolute top-[50px] left-[140px] w-[170px] h-[110px] rounded-md overflow-hidden"
                    style={{ 
                      background: 'rgba(28, 28, 28, 0.97)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    <div className="h-5 flex items-center justify-between px-2" style={{ background: 'rgba(40, 40, 40, 0.98)' }}>
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-[10px] h-[10px] text-[#60CDFF]" />
                        <span className="text-[10px] text-white/80 truncate">Notepad</span>
                      </div>
                      <div className="flex">
                        <div className="w-[18px] h-5 flex items-center justify-center hover:bg-white/10">
                          <Minus className="w-[8px] h-[8px] text-white/60" />
                        </div>
                        <div className="w-[18px] h-5 flex items-center justify-center hover:bg-white/10">
                          <Maximize2 className="w-[8px] h-[8px] text-white/60" />
                        </div>
                        <div className="w-[18px] h-5 flex items-center justify-center hover:bg-[#E81123]">
                          <X className="w-[8px] h-[8px] text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-[9px] text-white/80 font-mono">Welcome to CloudOS!</p>
                      <p className="text-[9px] text-white/50 font-mono mt-1">Your cloud computer</p>
                      <p className="text-[9px] text-white/50 font-mono">is ready to use.</p>
                    </div>
                  </div>
                  
                  {/* Taskbar */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-8 flex items-center justify-between px-3"
                    style={{ 
                      background: 'rgba(32, 32, 32, 0.90)',
                      backdropFilter: 'blur(20px)',
                    }}
                  >
                    <Grid2x2 className="w-[14px] h-[14px] text-[#0078D4]" />
                    <div className="flex items-center gap-1.5">
                      {[
                        { icon: FolderOpen, color: '#FFA500', gradient: 'linear-gradient(135deg, #FF8C00, #FFA500)' },
                        { icon: Globe, color: '#0078D4', gradient: 'linear-gradient(135deg, #0052CC, #0078D4)' },
                        { icon: FileText, color: '#0078D4', gradient: 'linear-gradient(135deg, #2B88D8, #0078D4)' },
                      ].map((app, i) => (
                        <div 
                          key={i} 
                          className="w-6 h-6 rounded flex items-center justify-center relative"
                          style={{ background: app.gradient }}
                        >
                          <app.icon className="w-3.5 h-3.5 text-white" />
                          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0078D4]" />
                        </div>
                      ))}
                    </div>
                    <span className="text-[9px] text-white font-semibold">{currentTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20" style={{ 
        background: 'rgba(22, 27, 34, 0.50)',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
            {[
              { value: '3 Billion', description: 'people locked out of technology by the cost of devices', isGradient: false },
              { value: '$0', description: 'cost to access a full CloudOS computer starting today', isGradient: true },
              { value: '< 2 seconds', description: 'to go from browser to full Windows-style desktop experience', isGradient: false },
            ].map((stat, i) => (
              <div 
                key={i}
                className="text-center px-6"
                style={{ borderRight: i < 2 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none' }}
              >
                <div className={`text-4xl font-extrabold ${stat.isGradient ? 'bg-gradient-to-r from-[#0078D4] to-[#60CDFF] bg-clip-text text-transparent' : 'text-white'}`}>
                  {stat.value}
                </div>
                <p className="mt-2 text-sm text-white/40 max-w-[220px] mx-auto">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center">
            <span className="text-[11px] font-semibold text-[#0078D4] tracking-[2px] uppercase">FEATURES</span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-extrabold text-white text-balance">
              Everything you need.<br />Nothing you don&apos;t.
            </h2>
          </div>
          
          {/* Bento Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <FeatureCard
              icon={FolderOpen}
              gradient="linear-gradient(135deg, #FF8C00, #FFA500)"
              title="30+ Built-in Apps"
              description="From File Explorer to Microsoft Word, Excel, Spotify and Chrome. Everything you need is pre-installed."
            />
            
            {/* Card 2 */}
            <FeatureCard
              icon={Sparkles}
              gradient="linear-gradient(135deg, #7B2FBE, #C239B3)"
              title="CLOUDIA AI Assistant"
              description="Ask anything. Open apps by voice. Get things done faster than clicking. Powered by Cloudflare Workers AI."
            />
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 3 */}
            <FeatureCard
              icon={Monitor}
              gradient="linear-gradient(135deg, #0078D4, #60CDFF)"
              title="Works on Any Device"
              description="Phone, tablet, old laptop, café computer. Any browser works."
            />
            
            {/* Card 4 */}
            <FeatureCard
              icon={Cloud}
              gradient="linear-gradient(135deg, #038387, #67C4CD)"
              title="Cloud File Storage"
              description="Your files live in the cloud. Always synced. Never lost."
            />
            
            {/* Card 5 */}
            <FeatureCard
              icon={Mic}
              gradient="linear-gradient(135deg, #107C10, #6CCB5F)"
              title="ElevenLabs Voice"
              description="Natural voice interface powered by ElevenLabs AI technology."
            />
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-24">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <span className="text-[11px] font-semibold text-[#0078D4] tracking-[2px] uppercase">ABOUT</span>
          <h2 className="mt-4 text-4xl lg:text-5xl font-extrabold text-white text-balance">
            Built for the<br />next billion.
          </h2>
          
          <div className="mt-8 max-w-[600px] mx-auto">
            <p className="text-lg text-white/60 leading-relaxed">
              3 billion people cannot afford a personal computer. We believe access to technology is a human right.
            </p>
            <p className="mt-4 text-lg text-white/60 leading-relaxed">
              CloudOS is a full operating system that runs in any browser. No downloads. No hardware. No expensive device.
            </p>
            <p className="mt-4 text-lg text-white/60 leading-relaxed">
              Powered by Cloudflare&apos;s global edge network and ElevenLabs voice AI.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <ValueCard icon={Globe} title="Global Access" description="Works in 300+ countries" />
            <ValueCard icon={Lock} title="Secure" description="Cloudflare enterprise security" />
            <ValueCard icon={Heart} title="For Everyone" description="Designed for those who need it most" />
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-24" style={{ background: 'rgba(15, 15, 35, 0.50)' }}>
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="text-center">
            <span className="text-[11px] font-semibold text-[#0078D4] tracking-[2px] uppercase">PRICING</span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-extrabold text-white">Simple, honest pricing.</h2>
            <p className="mt-4 text-lg text-white/60">Start free. Upgrade when needed.</p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Free Plan */}
            <PricingCard
              tier="free"
              name="Starter"
              price="$0"
              features={[
                { text: 'Full desktop experience', included: true },
                { text: '5 GB cloud storage', included: true },
                { text: '20 built-in apps', included: true },
                { text: 'CLOUDIA AI (50 msgs/day)', included: true },
                { text: 'Community support', included: true },
                { text: 'Priority support', included: false },
                { text: 'Unlimited storage', included: false },
                { text: 'All 30+ apps', included: false },
              ]}
              buttonText="Get Started Free"
              buttonVariant="outline"
            />
            
            {/* Pro Plan */}
            <PricingCard
              tier="pro"
              name="Pro"
              price="$9"
              isPopular
              features={[
                { text: 'Everything in Free', included: true },
                { text: '100 GB cloud storage', included: true },
                { text: 'All 30+ apps unlocked', included: true },
                { text: 'CLOUDIA AI unlimited', included: true },
                { text: 'Priority support', included: true },
                { text: 'Custom themes', included: true },
                { text: 'Advanced features', included: true },
              ]}
              buttonText="Get Pro"
              buttonVariant="filled"
            />
            
            {/* Enterprise Plan */}
            <PricingCard
              tier="enterprise"
              name="Enterprise"
              price="Custom"
              features={[
                { text: 'Everything in Pro', included: true },
                { text: 'Unlimited storage', included: true },
                { text: 'Team management', included: true },
                { text: 'SSO & Active Directory', included: true },
                { text: 'SLA guarantee (99.9%)', included: true },
                { text: 'Dedicated support', included: true },
                { text: 'Custom deployment', included: true },
              ]}
              buttonText="Contact Sales"
              buttonVariant="outline"
            />
          </div>
        </div>
      </section>
      
      {/* Docs Section */}
      <section id="docs" className="py-24">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="text-center">
            <span className="text-[11px] font-semibold text-[#0078D4] tracking-[2px] uppercase">DOCS</span>
            <h2 className="mt-4 text-4xl lg:text-5xl font-extrabold text-white">Get started in minutes.</h2>
            <p className="mt-4 text-lg text-white/60">Everything you need to use CloudOS effectively.</p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <DocCard
              icon={BookOpen}
              gradient="linear-gradient(135deg, #0078D4, #60CDFF)"
              title="Quick Start Guide"
              description="Get your cloud computer running in under 60 seconds. Step-by-step guide for new users."
              linkText="Read guide"
            />
            <DocCard
              icon={Code2}
              gradient="linear-gradient(135deg, #7B2FBE, #C239B3)"
              title="API Reference"
              description="Integrate CloudOS features into your own applications using our documented REST API."
              linkText="View API docs"
            />
            <DocCard
              icon={HelpCircle}
              gradient="linear-gradient(135deg, #107C10, #6CCB5F)"
              title="FAQ & Support"
              description="Common questions answered. Community forum and 24/7 support for Pro users."
              linkText="Get help"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-28">
        <div className="max-w-[640px] mx-auto px-6 text-center">
          <h2 className="text-5xl lg:text-6xl font-extrabold text-white leading-[1.0]">
            Start working.<br />Right now.
          </h2>
          <p className="mt-6 text-lg text-white/60">
            No downloads. No setup.<br />No credit card. Just open and go.
          </p>
          <Link 
            href="/auth"
            className="mt-10 inline-flex h-14 px-10 items-center rounded bg-[#0078D4] text-lg font-semibold text-white hover:bg-[#1084D8] hover:scale-[1.02] transition-all"
          >
            Open CloudOS — It&apos;s Free
          </Link>
          
          <div className="mt-8 flex flex-wrap justify-center items-center gap-10">
            {[
              { icon: Shield, text: 'Secured by Cloudflare' },
              { icon: Mic, text: 'Voice by ElevenLabs' },
              { icon: Zap, text: '300+ global edge locations' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-white/30">
                <badge.icon className="w-5 h-5" />
                <span className="text-[13px]">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{ 
        background: '#0f0f23',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-[#0078D4]" />
              <span className="font-bold text-white">CloudOS</span>
              <span className="text-[13px] text-white/30 ml-2">Built for ElevenHacks Week 2</span>
            </div>
            <div className="flex items-center gap-6">
              {[
                { label: 'Features', id: 'features' },
                { label: 'About', id: 'about' },
                { label: 'Pricing', id: 'pricing' },
              ].map((link) => (
                <button 
                  key={link.id} 
                  onClick={() => scrollToSection(link.id)}
                  className="text-[13px] text-white/30 hover:text-white/60 transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <span className="text-[13px] text-white/30">Powered by Cloudflare + ElevenLabs</span>
          </div>
          <div className="mt-8 text-center">
            <p className="text-xs text-white/25">2026 CloudOS. The computer for the next billion.</p>
          </div>
        </div>
      </footer>
      
      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-[72px] right-6 w-11 h-11 rounded-full flex items-center justify-center z-50 transition-all duration-200 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.10)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.20)',
        }}
      >
        <ChevronUp className="w-5 h-5 text-white" />
      </button>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon: Icon, gradient, title, description }: {
  icon: React.ElementType
  gradient: string
  title: string
  description: string
}) {
  return (
    <div 
      className="p-8 rounded-xl border border-white/8 hover:border-white/16 hover:-translate-y-1 transition-all duration-200"
      style={{ background: 'rgba(255, 255, 255, 0.04)' }}
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: gradient }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-[15px] text-white/60 leading-relaxed">{description}</p>
    </div>
  )
}

// Value Card Component
function ValueCard({ icon: Icon, title, description }: {
  icon: React.ElementType
  title: string
  description: string
}) {
  return (
    <div 
      className="p-6 rounded-xl border border-white/8"
      style={{ background: 'rgba(255, 255, 255, 0.04)' }}
    >
      <Icon className="w-8 h-8 text-[#0078D4]" />
      <h3 className="mt-3 font-semibold text-white">{title}</h3>
      <p className="mt-1 text-sm text-white/60">{description}</p>
    </div>
  )
}

// Pricing Card Component
function PricingCard({ tier, name, price, isPopular, features, buttonText, buttonVariant }: {
  tier: string
  name: string
  price: string
  isPopular?: boolean
  features: { text: string; included: boolean }[]
  buttonText: string
  buttonVariant: 'outline' | 'filled'
}) {
  return (
    <div 
      className={`p-6 rounded-xl ${isPopular ? 'scale-[1.04] shadow-[0_0_40px_rgba(0,120,212,0.15)]' : ''}`}
      style={{ 
        background: isPopular ? 'rgba(0, 120, 212, 0.08)' : 'rgba(255, 255, 255, 0.04)',
        border: isPopular ? '1px solid #0078D4' : '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {isPopular && (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#0078D4] text-white mb-4">
          Most Popular
        </span>
      )}
      {tier === 'free' && (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#6CCB5F]/20 text-[#6CCB5F] mb-4">
          Free
        </span>
      )}
      
      <div className="flex items-baseline gap-1">
        <span className={`text-5xl font-extrabold ${isPopular ? 'bg-gradient-to-r from-[#0078D4] to-[#60CDFF] bg-clip-text text-transparent' : 'text-white'}`}>
          {price}
        </span>
        {price !== 'Custom' && <span className="text-white/50">/month</span>}
      </div>
      <p className="mt-1 text-lg font-medium text-white">{name}</p>
      
      <ul className="mt-6 space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3">
            {feature.included ? (
              <CheckCircle2 className="w-4 h-4 text-[#6CCB5F] flex-shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-white/20 flex-shrink-0" />
            )}
            <span className={`text-sm ${feature.included ? 'text-white/80' : 'text-white/40'}`}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      
      <button 
        className={`mt-6 w-full h-11 rounded text-sm font-medium transition-colors ${
          buttonVariant === 'filled' 
            ? 'bg-[#0078D4] text-white hover:bg-[#1084D8]' 
            : 'border border-[#0078D4] text-[#0078D4] hover:bg-[#0078D4]/10'
        }`}
      >
        {buttonText}
      </button>
    </div>
  )
}

// Doc Card Component
function DocCard({ icon: Icon, gradient, title, description, linkText }: {
  icon: React.ElementType
  gradient: string
  title: string
  description: string
  linkText: string
}) {
  return (
    <div 
      className="p-6 rounded-xl border border-white/8 hover:border-white/16 transition-colors"
      style={{ background: 'rgba(255, 255, 255, 0.04)' }}
    >
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: gradient }}
      >
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-white/60 leading-relaxed line-clamp-3">{description}</p>
      <a href="#" className="mt-4 inline-block text-sm text-[#0078D4] hover:underline">
        {linkText} &rarr;
      </a>
    </div>
  )
}
