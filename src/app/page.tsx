import Link from 'next/link'
import { Zap, Dumbbell, Users, UserCircle, DollarSign, Binoculars, Building2, Plug, Check, ArrowRight, Star, TrendingUp, Shield } from 'lucide-react'

const products = [
  { name: 'RallyIQ Coach', icon: Dumbbell, color: 'bg-blue-500', desc: 'Practice planning, player notes, and development tracking all in one intelligent coaching hub.', features: ['AI Practice Planner', 'Player Development Notes', 'Performance Tracking'] },
  { name: 'RallyIQ Teams', icon: Users, color: 'bg-green-500', desc: 'Complete team management — roster, schedules, tournaments, and parent communication.', features: ['Smart Roster Management', 'Schedule & Tournament Tracker', 'Parent Communication Hub'] },
  { name: 'RallyIQ Profiles', icon: UserCircle, color: 'bg-purple-500', desc: 'Dynamic athlete profiles with video highlights and recruiting snapshots.', features: ['Video Highlight Reels', 'Recruiting Contact Tracker', 'Academic & Athletic Stats'] },
  { name: 'RallyIQ Fundraise', icon: DollarSign, color: 'bg-yellow-500', desc: 'Powerful fundraising with campaigns, sponsor management, and donor tracking.', features: ['Campaign Management', 'Sponsor Portal', 'Donor Analytics'] },
  { name: 'RallyIQ Scout', icon: Binoculars, color: 'bg-red-500', desc: 'Comprehensive scouting with competitor monitoring and tryout pipeline management.', features: ['Competitor Monitoring', 'Tryout Pipeline', 'Roster Intelligence Reports'] },
  { name: 'RallyIQ Org', icon: Building2, color: 'bg-indigo-500', desc: 'Multi-team oversight with financial reporting and organizational-level analytics.', features: ['Multi-Team Dashboard', 'Financial Reports', 'Org-Level Sponsor Portal'] },
  { name: 'RallyIQ Integrations', icon: Plug, color: 'bg-orange-500', desc: 'Connect Band, GameChanger, NCS, social media, and AI video editing in one hub.', features: ['Band & GameChanger Sync', 'Social Media Automation', 'AI Video Highlight Editing'] },
]

const pricing = [
  { name: 'Starter', price: 49, desc: 'Perfect for single-team programs', features: ['1 Team', 'Coach & Player Portals', 'Basic Scheduling', 'Practice Planner', 'Email Support'] },
  { name: 'Pro', price: 149, desc: 'For growing multi-team clubs', features: ['Up to 8 Teams', 'All Portal Types', 'Fundraising Suite', 'Scout Tools', 'Integrations', 'Priority Support'], popular: true },
  { name: 'Org', price: 399, desc: 'Enterprise-grade for large organizations', features: ['Unlimited Teams', 'Full Platform Access', 'Advanced Analytics', 'White-label Branding', 'API Access', 'Dedicated Support'] },
]

const testimonials = [
  { name: 'Sarah Chen', role: 'Club Director, Eastside FC', text: 'RallyIQ transformed how we manage 12 teams. The integrated fundraising alone paid for itself in one season.', rating: 5 },
  { name: 'Mike Rivera', role: 'Head Coach, U18 Boys', text: 'The practice planner and player notes have made me a significantly more organized and effective coach.', rating: 5 },
  { name: 'Tom Williams', role: 'Parent, U16 Girls', text: 'Finally a platform where I know exactly when practices are, how my daughter is developing, and can donate easily.', rating: 5 },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-dark">RallyIQ</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#products" className="hover:text-gray-900 transition-colors">Products</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-gray-900 transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign In</Link>
            <Link href="/register" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden gradient-dark">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#1a56db33,_transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-gray-300 mb-6">
            <Zap className="h-3.5 w-3.5 text-accent" />
            The all-in-one sports management platform
          </div>
          <h1 className="text-5xl sm:text-7xl font-black text-white leading-tight max-w-5xl mx-auto">
            Win on the field.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-accent">
              Win off it too.
            </span>
          </h1>
          <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            RallyIQ gives coaches, clubs, and organizations everything they need — from practice planning and player development to fundraising and recruiting.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white hover:bg-accent-600 transition-colors">
              Start Free Trial <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto flex items-center justify-center rounded-xl border border-white/20 px-8 py-4 text-lg font-semibold text-white hover:bg-white/5 transition-colors">
              Live Demo
            </Link>
          </div>
          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-gray-500">
            {['No credit card required', 'Free 30-day trial', '500+ clubs trust us'].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-400" />{t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
          {[
            { value: '500+', label: 'Clubs' },
            { value: '12,000+', label: 'Athletes' },
            { value: '$2.4M', label: 'Raised' },
            { value: '98%', label: 'Satisfaction' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-primary-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-dark">7 powerful modules. One platform.</h2>
            <p className="mt-4 text-xl text-gray-500">Everything your sports organization needs, seamlessly connected.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => {
              const Icon = p.icon
              return (
                <div key={p.name} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow group">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${p.color} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{p.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{p.desc}</p>
                  <ul className="space-y-1.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
            {[
              { icon: TrendingUp, color: 'text-primary', title: 'Data-Driven Coaching', desc: 'Track every practice, note every player improvement, and generate development summaries that actually help athletes grow.' },
              { icon: Shield, color: 'text-green-500', title: 'Role-Based Access', desc: 'Coaches, players, parents, and org admins each see exactly what they need — nothing more, nothing less.' },
              { icon: Zap, color: 'text-accent', title: 'AI-Powered Highlights', desc: 'Upload raw footage and let our AI automatically detect goals, saves, and key moments to create stunning highlight reels.' },
            ].map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className="text-center">
                  <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 mb-6`}>
                    <Icon className={`h-8 w-8 ${f.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-3">{f.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-dark">Simple, transparent pricing</h2>
            <p className="mt-4 text-xl text-gray-500">No hidden fees. Cancel anytime.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {pricing.map((p) => (
              <div key={p.name} className={`relative rounded-2xl p-8 ${p.popular ? 'bg-primary text-white shadow-2xl scale-105' : 'bg-white border border-gray-200'}`}>
                {p.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-sm font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-1 ${p.popular ? 'text-white' : 'text-dark'}`}>{p.name}</h3>
                <p className={`text-sm mb-6 ${p.popular ? 'text-primary-200' : 'text-gray-500'}`}>{p.desc}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className={`text-5xl font-black ${p.popular ? 'text-white' : 'text-dark'}`}>${p.price}</span>
                  <span className={p.popular ? 'text-primary-200' : 'text-gray-400'}>/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {p.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${p.popular ? 'text-primary-100' : 'text-gray-600'}`}>
                      <Check className={`h-4 w-4 flex-shrink-0 ${p.popular ? 'text-primary-300' : 'text-green-500'}`} />{f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block w-full rounded-xl py-3 text-center font-semibold transition-colors ${
                    p.popular ? 'bg-white text-primary hover:bg-primary-50' : 'bg-primary text-white hover:bg-primary-700'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-dark">Coaches and clubs love RallyIQ</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-gray-100 bg-gray-50 p-8">
                <div className="flex text-yellow-400 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-dark">{t.name}</p>
                  <p className="text-sm text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-dark py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">Ready to rally your team?</h2>
          <p className="text-gray-400 text-xl mb-10">Join 500+ clubs already using RallyIQ to build winning programs.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white hover:bg-accent-600 transition-colors">
              Start Free Trial <ArrowRight className="h-5 w-5" />
            </Link>
            <Link href="/login" className="w-full sm:w-auto rounded-xl border border-white/20 px-8 py-4 text-lg font-semibold text-white hover:bg-white/5 transition-colors">
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">RallyIQ</span>
            </div>
            <p className="text-gray-500 text-sm">© 2025 RallyIQ. All rights reserved.</p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-300">Privacy</a>
              <a href="#" className="hover:text-gray-300">Terms</a>
              <a href="#" className="hover:text-gray-300">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
