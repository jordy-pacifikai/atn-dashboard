'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  LayoutDashboard, Mail, FileText, TrendingUp, MessageCircle,
  HelpCircle, Sparkles, Target, Zap, CheckCircle2, Clock,
  ArrowRight, Play, Bot, BarChart3, Shield, Phone, Send
} from 'lucide-react'

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'demo' | 'faq'>('overview')

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[--atn-primary] to-[#5856D6] p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4" />
            Prototype fonctionnel
          </div>

          <h1 className="text-3xl font-bold mb-3">
            Automatisez votre marketing avec l'IA
          </h1>

          <p className="text-white/80 text-lg max-w-2xl mb-6">
            Ce dashboard démontre comment PACIFIK'AI peut transformer vos opérations marketing
            en automatisant les tâches répétitives tout en gardant le contrôle humain.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/demo-site"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[--atn-primary] rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              <Play className="w-4 h-4" />
              Voir la démo live
            </Link>
            <a
              href="https://cal.com/pacifikai/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 text-white rounded-lg font-medium hover:bg-white/30 transition-colors border border-white/30"
            >
              <Phone className="w-4 h-4" />
              Réserver un appel
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-[--bg-secondary] rounded-xl">
        {[
          { id: 'overview', label: 'Ce que vous achetez', icon: Target },
          { id: 'demo', label: 'Tester la démo', icon: Play },
          { id: 'faq', label: 'Questions', icon: HelpCircle },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[--text-primary] shadow-sm'
                : 'text-[--text-secondary] hover:text-[--text-primary]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Value Proposition */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Clock,
                title: '40h/mois économisées',
                description: 'Réponses clients, newsletters, articles SEO - tout est automatisé',
                color: 'text-[--atn-green]',
                bg: 'bg-green-50',
              },
              {
                icon: TrendingUp,
                title: '+35% d\'engagement',
                description: 'Contenu personnalisé par IA = meilleurs taux d\'ouverture et clics',
                color: 'text-[--atn-primary]',
                bg: 'bg-blue-50',
              },
              {
                icon: Bot,
                title: '24/7 sans interruption',
                description: 'Votre concierge IA répond même à 3h du matin',
                color: 'text-[--atn-secondary]',
                bg: 'bg-purple-50',
              },
            ].map((item, i) => (
              <div key={i} className={`p-5 rounded-xl ${item.bg} border border-[--border-primary]`}>
                <item.icon className={`w-8 h-8 ${item.color} mb-3`} />
                <h3 className="font-semibold text-[--text-primary] mb-1">{item.title}</h3>
                <p className="text-sm text-[--text-secondary]">{item.description}</p>
              </div>
            ))}
          </div>

          {/* What's Included */}
          <div className="bg-white rounded-xl border border-[--border-primary] overflow-hidden">
            <div className="p-5 border-b border-[--border-primary]">
              <h2 className="font-semibold text-lg text-[--text-primary]">Ce qui est inclus dans cette proposition</h2>
              <p className="text-sm text-[--text-secondary] mt-1">25 workflows automatisés, prêts à être activés</p>
            </div>

            <div className="divide-y divide-[--border-primary]">
              {/* Build Category 1 */}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[--text-primary]">Relation Client IA</h3>
                    <p className="text-xs text-[--text-secondary]">Builds 1, 5, 8, 9</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Concierge Tiare 24/7', desc: 'Chatbot multilingue qui répond aux questions voyageurs', status: 'live' },
                    { name: 'Suivi Réservations', desc: 'Relances automatiques, confirmations, rappels', status: 'ready' },
                    { name: 'Alertes Vols', desc: 'Notifications retards/annulations sur tous les canaux', status: 'ready' },
                    { name: 'Réponses Avis', desc: 'Génération automatique de réponses personnalisées', status: 'ready' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-[--bg-secondary] rounded-lg">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${item.status === 'live' ? 'text-[--atn-green]' : 'text-[--text-tertiary]'}`} />
                      <div>
                        <p className="font-medium text-sm text-[--text-primary]">
                          {item.name}
                          {item.status === 'live' && (
                            <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">ACTIF</span>
                          )}
                        </p>
                        <p className="text-xs text-[--text-secondary]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Build Category 2 */}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[--text-primary]">Contenu & Marketing</h3>
                    <p className="text-xs text-[--text-secondary]">Builds 2, 3, 6, 10</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Newsletters Personnalisées', desc: 'Génération et envoi via Brevo avec segmentation IA', status: 'live' },
                    { name: 'Articles SEO', desc: 'Blog optimisé référencement, chargé depuis Airtable', status: 'live' },
                    { name: 'Social Listening', desc: 'Monitoring mentions et analyse sentiment', status: 'ready' },
                    { name: 'Upsell Engine', desc: 'Offres personnalisées post-réservation', status: 'ready' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-[--bg-secondary] rounded-lg">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${item.status === 'live' ? 'text-[--atn-green]' : 'text-[--text-tertiary]'}`} />
                      <div>
                        <p className="font-medium text-sm text-[--text-primary]">
                          {item.name}
                          {item.status === 'live' && (
                            <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">ACTIF</span>
                          )}
                        </p>
                        <p className="text-xs text-[--text-secondary]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Build Category 3 */}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[--text-primary]">Intelligence Business</h3>
                    <p className="text-xs text-[--text-secondary]">Builds 4, 7, 16, 20</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Alertes ROI', desc: 'Détection anomalies sur vos routes aériennes', status: 'ready' },
                    { name: 'Veille Concurrentielle', desc: 'Surveillance prix et offres des concurrents', status: 'ready' },
                    { name: 'Review Intelligence', desc: 'Analyse sémantique de tous vos avis clients', status: 'ready' },
                    { name: 'Pricing Monitor', desc: 'Optimisation tarifaire dynamique', status: 'ready' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-[--bg-secondary] rounded-lg">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-[--text-tertiary]" />
                      <div>
                        <p className="font-medium text-sm text-[--text-primary]">{item.name}</p>
                        <p className="text-xs text-[--text-secondary]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Build Category 4 */}
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[--text-primary]">Marketing Automation V2</h3>
                    <p className="text-xs text-[--text-secondary]">Builds 21-25</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Customer Journeys', desc: 'Parcours client automatisés multi-touchpoints' },
                    { name: 'A/B Testing', desc: 'Tests automatiques sur vos campagnes' },
                    { name: 'Lead Scoring', desc: 'Qualification prospects par IA' },
                    { name: 'Attribution Multi-canal', desc: 'Analyse ROI de chaque canal marketing' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-[--bg-secondary] rounded-lg">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-[--text-tertiary]" />
                      <div>
                        <p className="font-medium text-sm text-[--text-primary]">{item.name}</p>
                        <p className="text-xs text-[--text-secondary]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-xl border border-[--border-primary] p-6">
            <h2 className="font-semibold text-lg text-[--text-primary] mb-6">Comment ça fonctionne</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { step: '1', title: 'On se connecte', desc: 'Accès à vos systèmes existants (CRM, email, etc.)', icon: Shield },
                { step: '2', title: 'L\'IA apprend', desc: 'Analyse de vos données et personnalisation', icon: Bot },
                { step: '3', title: 'Workflows actifs', desc: 'Les automatisations tournent 24/7', icon: Zap },
                { step: '4', title: 'Vous contrôlez', desc: 'Dashboard pour superviser et ajuster', icon: LayoutDashboard },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[--atn-primary]/10 flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-5 h-5 text-[--atn-primary]" />
                  </div>
                  <div className="text-xs font-semibold text-[--atn-primary] mb-1">ÉTAPE {item.step}</div>
                  <h3 className="font-semibold text-sm text-[--text-primary] mb-1">{item.title}</h3>
                  <p className="text-xs text-[--text-secondary]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'demo' && (
        <div className="space-y-6">
          {/* Demo Instructions */}
          <div className="bg-white rounded-xl border border-[--border-primary] p-6">
            <h2 className="font-semibold text-lg text-[--text-primary] mb-2">Testez par vous-même</h2>
            <p className="text-sm text-[--text-secondary] mb-6">
              3 fonctionnalités sont déjà actives et connectées. Vous pouvez les tester maintenant.
            </p>

            <div className="space-y-4">
              {/* Demo 1 */}
              <div className="p-4 border border-[--border-primary] rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[--text-primary]">Chatbot Tiare</h3>
                      <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">LIVE</span>
                    </div>
                    <p className="text-sm text-[--text-secondary] mb-3">
                      Posez une question comme un voyageur le ferait. L'IA répond en temps réel avec le contexte Air Tahiti Nui.
                    </p>
                    <div className="bg-[--bg-secondary] rounded-lg p-3 mb-3">
                      <p className="text-xs text-[--text-tertiary] mb-2">Exemples de questions à poser :</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Quelle est la franchise bagages ?',
                          'Vol Paris-Tahiti combien de temps ?',
                          'Meilleure période pour Bora Bora ?',
                        ].map((q, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-white rounded border border-[--border-primary] text-[--text-secondary]">
                            "{q}"
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href="/demo-site"
                      className="inline-flex items-center gap-2 text-sm font-medium text-[--atn-primary] hover:underline"
                    >
                      Ouvrir le site et tester le chatbot
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Demo 2 */}
              <div className="p-4 border border-[--border-primary] rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[--text-primary]">Newsletter Brevo</h3>
                      <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">LIVE</span>
                    </div>
                    <p className="text-sm text-[--text-secondary] mb-3">
                      Inscrivez-vous avec votre email. Vous recevrez la prochaine newsletter générée par IA.
                    </p>
                    <Link
                      href="/demo-site"
                      className="inline-flex items-center gap-2 text-sm font-medium text-[--atn-primary] hover:underline"
                    >
                      S'inscrire à la newsletter
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Demo 3 */}
              <div className="p-4 border border-[--border-primary] rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[--text-primary]">Blog SEO Dynamique</h3>
                      <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">LIVE</span>
                    </div>
                    <p className="text-sm text-[--text-secondary] mb-3">
                      Les articles sont chargés depuis Airtable en temps réel. Chaque article a un score SEO calculé par IA.
                    </p>
                    <Link
                      href="/demo-site"
                      className="inline-flex items-center gap-2 text-sm font-medium text-[--atn-primary] hover:underline"
                    >
                      Voir le blog
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Features */}
          <div className="bg-white rounded-xl border border-[--border-primary] p-6">
            <h2 className="font-semibold text-lg text-[--text-primary] mb-2">Explorer le dashboard</h2>
            <p className="text-sm text-[--text-secondary] mb-4">
              Naviguez dans les différentes sections pour voir ce que chaque workflow peut faire.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { name: 'Overview', href: '/', desc: 'Vue d\'ensemble de tous les KPIs' },
                { name: 'Calendrier', href: '/calendar', desc: 'Planning éditorial avec drag & drop' },
                { name: 'Newsletters', href: '/newsletters', desc: 'Historique et stats des campagnes' },
                { name: 'Contenu SEO', href: '/content', desc: 'Génération d\'articles optimisés' },
              ].map((item, i) => (
                <Link
                  key={i}
                  href={item.href}
                  className="flex items-center justify-between p-3 bg-[--bg-secondary] rounded-lg hover:bg-[--bg-tertiary] transition-colors group"
                >
                  <div>
                    <p className="font-medium text-sm text-[--text-primary]">{item.name}</p>
                    <p className="text-xs text-[--text-secondary]">{item.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[--text-tertiary] group-hover:text-[--atn-primary] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="space-y-3">
          {[
            {
              q: 'C\'est quoi PACIFIK\'AI exactement ?',
              a: 'Une agence spécialisée dans l\'automatisation par IA pour les entreprises polynésiennes. On crée des workflows n8n connectés à des agents IA (Claude, GPT) pour automatiser vos tâches répétitives.',
            },
            {
              q: 'Les données de cette démo sont-elles réelles ?',
              a: 'Non, c\'est une démo avec des données fictives. En production, tout serait connecté aux vrais systèmes Air Tahiti Nui (CRM, email, base réservations, etc.).',
            },
            {
              q: 'Combien de temps pour mettre en place ?',
              a: 'Comptez 2-4 semaines pour le pack Starter, 4-8 semaines pour Business, et 2-3 mois pour Enterprise avec intégrations complexes.',
            },
            {
              q: 'Le chatbot peut-il vraiment réserver des vols ?',
              a: 'Dans cette démo, non. Mais le workflow peut être connecté à votre système de réservation pour permettre des réservations directes ou des redirections intelligentes.',
            },
            {
              q: 'Quelle est la différence avec ChatGPT ?',
              a: 'ChatGPT est un outil généraliste. Nos workflows sont spécifiquement entraînés sur vos données, votre ton de marque, et connectés à vos systèmes. L\'IA connaît vos produits, vos prix, vos destinations.',
            },
            {
              q: 'Qui gère les workflows au quotidien ?',
              a: 'Les workflows tournent en autonomie. Vous gardez le contrôle via le dashboard pour superviser, approuver certaines actions (comme les réponses aux avis négatifs), et ajuster les paramètres.',
            },
            {
              q: 'Et si l\'IA fait une erreur ?',
              a: 'On met en place des garde-fous : validation humaine pour les actions sensibles, limites de budget, logs complets. Vous pouvez toujours intervenir.',
            },
            {
              q: 'Comment contacter PACIFIK\'AI ?',
              a: 'Email: jordy@pacifikai.com • Téléphone: +689 89 55 81 89 • Ou réservez un appel sur cal.com/pacifikai/demo',
            },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-[--border-primary] rounded-xl p-4">
              <p className="font-medium text-[--text-primary] mb-2">{item.q}</p>
              <p className="text-sm text-[--text-secondary]">{item.a}</p>
            </div>
          ))}
        </div>
      )}

      {/* CTA Footer */}
      <div className="bg-[--bg-secondary] rounded-xl p-6 text-center">
        <h2 className="font-semibold text-lg text-[--text-primary] mb-2">Prêt à automatiser ?</h2>
        <p className="text-sm text-[--text-secondary] mb-4">
          Réservez un appel de 30 minutes pour discuter de vos besoins
        </p>
        <div className="flex justify-center gap-3">
          <a
            href="https://cal.com/pacifikai/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[--atn-primary] text-white rounded-lg font-medium hover:bg-[--atn-primary]/90 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Réserver un appel
          </a>
          <a
            href="mailto:jordy@pacifikai.com"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[--text-primary] rounded-lg font-medium hover:bg-[--bg-tertiary] transition-colors border border-[--border-primary]"
          >
            <Send className="w-4 h-4" />
            Envoyer un email
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-[--text-tertiary] pt-4">
        <p>Dashboard ATN v2.0 • Prototype PACIFIK'AI</p>
      </div>
    </div>
  )
}
