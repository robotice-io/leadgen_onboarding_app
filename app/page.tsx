import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, BarChart3, Bot, Shield, Zap, TrendingUp, Users, Mail, Eye, Calendar } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-6 py-20 md:py-32">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            {/* Logo */}
            <div className="mb-8">
              <Image
                src="/landing_logo.png"
                alt="Robotice.io"
                width={180}
                height={60}
                priority
                className="dark:brightness-110"
              />
            </div>
            
            {/* Hero Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Automatiza tu generación<br />de leads B2B
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl">
              <span className="font-semibold text-blue-600 dark:text-blue-400">LeadGen by Robotice.io</span> crea y ejecuta campañas de contacto en frío personalizadas con IA, desde tu propia cuenta de e-mail.
            </p>
            
            <div className="flex items-center gap-6 text-lg text-gray-700 dark:text-gray-300 mb-12">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Leads reales
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Mensajes inteligentes
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Resultados medibles
              </span>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Link
                href="#planes"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Ver planes
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg font-semibold border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-all"
              >
                <Calendar className="mr-2 w-5 h-5" />
                Agenda una demo
              </Link>
            </div>
            
            {/* Hero Visual/Mockup */}
            <div className="relative w-full max-w-4xl">
              <div className="aspect-video rounded-2xl border-4 border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden bg-white dark:bg-gray-800">
                <div className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">3.2K</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Leads enviados</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">72%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Tasa apertura</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">156</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Respuestas</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">8</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Reuniones</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Un sistema de prospección inteligente que trabaja 24/7 por ti
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              No vendemos listas. Construimos pipelines automatizados que contactan a las personas correctas, con el mensaje correcto, desde tu propio correo.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-8 h-full border border-blue-200 dark:border-blue-800">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center mb-4 text-white font-bold text-xl">1</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Conecta tu cuenta</h3>
                <p className="text-gray-600 dark:text-gray-400">Autoriza Gmail/Workspace con un clic. Seguridad total, sin contraseñas.</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-8 h-full border border-green-200 dark:border-green-800">
                <div className="w-12 h-12 bg-green-600 dark:bg-green-500 rounded-lg flex items-center justify-center mb-4 text-white font-bold text-xl">2</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Definimos tu ICP</h3>
                <p className="text-gray-600 dark:text-gray-400">Industria, cargo, país y segmento: identificamos a tus decisores.</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-8 h-full border border-purple-200 dark:border-purple-800">
                <div className="w-12 h-12 bg-purple-600 dark:bg-purple-500 rounded-lg flex items-center justify-center mb-4 text-white font-bold text-xl">3</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">IA personaliza</h3>
                <p className="text-gray-600 dark:text-gray-400">Generamos icebreakers y plantillas dinámicas para cada prospecto.</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl p-8 h-full border border-orange-200 dark:border-orange-800">
                <div className="w-12 h-12 bg-orange-600 dark:bg-orange-500 rounded-lg flex items-center justify-center mb-4 text-white font-bold text-xl">4</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Dashboard en vivo</h3>
                <p className="text-gray-600 dark:text-gray-400">Aperturas, respuestas y ROI en tiempo real.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por que LeadGen Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Por qué LeadGen by Robotice
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Tecnología + Data + Estrategia = Resultados predecibles
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <Shield className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">100% automático y seguro</h3>
              <p className="text-gray-600 dark:text-gray-400">Envíos desde tu cuenta OAuth; nosotros solo gestionamos tokens.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <Bot className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">IA de personalización</h3>
              <p className="text-gray-600 dark:text-gray-400">Copys únicos para cada prospecto y marca.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <BarChart3 className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Métricas en tiempo real</h3>
              <p className="text-gray-600 dark:text-gray-400">Dashboard por cliente: aperturas, respuestas y tendencias.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <Zap className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Optimización continua</h3>
              <p className="text-gray-600 dark:text-gray-400">Mejoramos plantillas según resultados.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <Eye className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Transparencia total</h3>
              <p className="text-gray-600 dark:text-gray-400">Cada correo sale de tu bandeja; tú recibes todas las respuestas.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
              <Users className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Soporte dedicado</h3>
              <p className="text-gray-600 dark:text-gray-400">Equipo Robotice disponible para optimizar tus campañas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Que Entregamos Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-12 text-center">
              Qué entregamos cada mes
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700 dark:text-gray-300">Base nueva de leads verificados (3,000–12,000 según plan)</p>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700 dark:text-gray-300">Campañas de outreach personalizadas por IA</p>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700 dark:text-gray-300">Dashboard con KPIs y tendencias</p>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700 dark:text-gray-300">Soporte dedicado Robotice Team</p>
              </div>
              <div className="flex items-start gap-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700 dark:text-gray-300">Reporte mensual de rendimiento (Core / Pro)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planes Section */}
      <section id="planes" className="py-20 bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Planes y precios
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Elige el plan que mejor se adapte a tus necesidades
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Starter */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Starter</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">$390K</span>
                <span className="text-gray-600 dark:text-gray-400"> CLP/mes</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Para validar mercado</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">3,000 leads verificados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">3 plantillas IA</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Dashboard básico</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">1 ICP</span>
                </li>
              </ul>
              <Link href="/login" className="block w-full text-center px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Empezar
              </Link>
            </div>
            
            {/* Core */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-2 border-blue-500 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Core</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">$790K</span>
                <span className="text-gray-600 dark:text-gray-400"> CLP/mes</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Para mantener pipeline</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">5,000 leads verificados</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">5 plantillas IA</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Campañas + Contactos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Dashboard avanzado</span>
                </li>
              </ul>
              <Link href="/login" className="block w-full text-center px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
                Empezar
              </Link>
            </div>
            
            {/* Pro */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border-2 border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pro</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">$1.49M</span>
                <span className="text-gray-600 dark:text-gray-400"> CLP/mes</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Para equipos en escala</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">8,000-12,000 leads</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">App completa</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Reporting PDF</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Integraciones CRM</span>
                </li>
              </ul>
              <Link href="/login" className="block w-full text-center px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Hablar con ventas
              </Link>
            </div>
            
            {/* Enterprise */}
            <div className="bg-gradient-to-br from-gray-900 to-blue-900 dark:from-gray-800 dark:to-blue-800 rounded-2xl p-8 shadow-xl text-white">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">A medida</span>
              </div>
              <p className="text-gray-300 mb-6">Grandes equipos</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Multicanal</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">SLA garantizado</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">Soporte dedicado</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">APIs personalizadas</span>
                </li>
              </ul>
              <Link href="/login" className="block w-full text-center px-6 py-3 rounded-lg bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors">
                Contactar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Resultados Esperados Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Resultados esperados
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-8 text-center border border-blue-200 dark:border-blue-800">
              <TrendingUp className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">65-80%</div>
              <div className="text-gray-700 dark:text-gray-300 font-medium">Open Rate promedio</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-8 text-center border border-green-200 dark:border-green-800">
              <Mail className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">4-7%</div>
              <div className="text-gray-700 dark:text-gray-300 font-medium">Reply Rate</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-8 text-center border border-purple-200 dark:border-purple-800">
              <Calendar className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">6-12</div>
              <div className="text-gray-700 dark:text-gray-300 font-medium">Reuniones mensuales</div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-8 text-center border border-orange-200 dark:border-orange-800">
              <TrendingUp className="w-12 h-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">×6</div>
              <div className="text-gray-700 dark:text-gray-300 font-medium">ROI estimado</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            ¿Listo para multiplicar tus reuniones B2B?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Conecta tu cuenta, activa LeadGen y empieza a ver respuestas esta semana.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-white text-blue-600 text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
              Probar LeadGen ahora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-blue-700 text-white text-lg font-semibold border-2 border-white hover:bg-blue-600 transition-all"
            >
              <Calendar className="mr-2 w-5 h-5" />
              Agenda una demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-300 py-12">
        <div className="container mx-auto px-6 text-center">
          <Image
            src="/landing_logo.png"
            alt="Robotice.io"
            width={120}
            height={40}
            className="mx-auto mb-4 brightness-200"
          />
          <p className="mb-4">© 2025 Robotice.io - LeadGen. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="#planes" className="hover:text-white transition-colors">Planes</Link>
            <Link href="/onboarding" className="hover:text-white transition-colors">Onboarding</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
