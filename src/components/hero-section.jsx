import {
  Activity,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Package,
  Scale,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative bg-cover bg-center min-h-[90vh] flex items-center py-20 px-6 overflow-hidden"
      style={{
        backgroundImage: 'url("/images/pexels-lovetosmile-36200692.jpg")', // Ensure this path is correct
      }}
    >
      {/* Dynamic Floating Animations (Self-contained) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0%, 100% { transform: rotateZ(7deg) translateY(0px); }
          50% { transform: rotateZ(7deg) translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: rotateZ(7deg) translateY(0px); }
          50% { transform: rotateZ(7deg) translateY(-12px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: rotateZ(7deg) translateY(0px); }
          50% { transform: rotateZ(7deg) translateY(-8px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite 2s; }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite 1s; }
      `,
        }}
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B132B]/95 via-[#0B132B]/80 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-tl from-[#0B132B] via-transparent to-transparent z-0 opacity-80" />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        {/* --- LEFT CONTENT --- */}
        <div className="text-white flex flex-col items-start pt-8 lg:pt-0 z-20">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-md">
            <Clock className="w-3.5 h-3.5 text-primary" />
            Save Time and Money
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.15] mb-6">
            Unified Scheduling <br className="hidden sm:block" />
            for <span className="text-blue-500">Every Service</span>
            <br />
            <span className="text-[#5A67D8]">Sector</span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-slate-400 leading-relaxed mb-10 max-w-lg font-light">
            We deliver a smart and dynamic service scheduling and progress
            tracking system built to adapt to any industry.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/register/organization"
              className="inline-flex justify-center items-center rounded-[25px] px-8 py-3.5 bg-blue-600 text-white font-medium shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:bg-blue-500 hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all duration-300 border border-blue-500/50"
            >
              Register Organization
            </Link>

            <Link
              href="/services"
              className="inline-flex justify-center items-center rounded-[25px] px-8 py-3.5 bg-white/5 text-white font-medium border border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              Explore Services
            </Link>
          </div>
        </div>

        {/* --- RIGHT CONTENT (Glassmorphism Pipeline) --- */}
        <div className="relative h-[600px] lg:flex items-center justify-center z-10 pointer-events-none">
          {/* Background Glowing Lines (Simulated SVG Stream) */}
          <svg
            className="absolute inset-0 w-full h-full opacity-40"
            viewBox="0 0 500 500"
          >
            <path
              d="M 50 350 C 150 350, 200 150, 450 100"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
            <path
              d="M 80 400 C 250 400, 300 200, 480 250"
              fill="none"
              stroke="url(#gradient2)"
              strokeWidth="1.5"
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>

          {/* Glowing Nodes representing dates */}
          <div className="absolute animate-float top-[31%] right-[30%] flex flex-col items-center gap-1 opacity-70">
            <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]"></div>
            <span className="text-white text-xs font-semibold">Mon 12</span>
          </div>
          <div className="absolute animate-float-delayed top-[61%] left-[20%] flex flex-col items-center gap-1 opacity-70">
            <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc]"></div>
            <span className="text-white text-xs font-semibold">Tue 13</span>
          </div>
          <div className="absolute animate-float-slow bottom-[7%] right-[25%] flex flex-col items-center gap-1 opacity-70">
            <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa]"></div>
            <span className="text-white text-xs font-semibold">Wed 14</span>
          </div>

          {/* Floating Card 1: Clinic Visit */}
          <div className="absolute animate-float bg-white/10 backdrop-blur-md rounded-[20px] transform rotate-x-30 rotate-z-7 top-[12%] right-[7%] h-27 w-64  border border-white/20 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"></div>
          <div className="absolute animate-float bg-gray-800 backdrop-blur-md rounded-[20px] transform rotate-x-30 rotate-z-7 top-[10%] right-[10%] h-27 w-64  border border-white/20 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Clinic Visit</h3>
                <p className="text-xs text-slate-300 mt-0.5">10:00 AM</p>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                  <CheckCircle2 className="w-3 h-3" />
                  Confirmed
                </div>
              </div>
            </div>
          </div>

          {/* Floating Card 2: Package Delivery */}
          <div className="absolute animate-float-delayed bg-white/10 backdrop-blur-md rounded-[20px] transform rotate-x-30 rotate-z-7 top-[42%] left-[8%] h-27 w-64  border border-white/20 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] z-20"></div>
          <div className="absolute animate-float-delayed bg-gray-800 backdrop-blur-md rounded-[20px] transform rotate-x-30 rotate-z-7 top-[40%] left-[5%] h-27 w-64  border border-white/20 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] z-20">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">
                  Package Delivery
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">2:30 PM</p>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold tracking-wider text-blue-400 uppercase">
                  <Activity className="w-3 h-3" />
                  In Progress
                </div>
              </div>
            </div>
          </div>

          {/* Floating Card 3: Legal Consultation */}
          <div className="absolute animate-float-slow bg-white/10 backdrop-blur-md rounded-[20px] transform rotate-x-30 rotate-z-7 bottom-[13%] right-[2%] h-27 w-64  border border-white/20 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"></div>
          <div className="absolute animate-float-slow bg-gray-800 backdrop-blur-md rounded-[20px] transform rotate-x-30 rotate-z-7 bottom-[15%] right-[5%] h-27 w-64  border border-white/20 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-slate-500/40 border border-slate-500/50 text-slate-200">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">
                  Legal Consultation
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">4:00 PM</p>
                <div className="flex items-center gap-1.5 mt-2 text-[10px] font-bold tracking-wider text-slate-300 uppercase">
                  <CalendarCheck className="w-3 h-3" />
                  Booked
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
