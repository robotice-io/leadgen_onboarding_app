"use client";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "¿Qué incluye el servicio cada mes?",
    a: "Cada plan entrega una nueva base de leads B2B verificados, campañas de outreach personalizadas por IA, dashboard con métricas, soporte de nuestro equipo y un reporte mensual con los resultados. Todo se ejecuta desde tu propia cuenta de correo, con total transparencia.",
  },
  {
    q: "¿Puedo usar mi cuenta personal de Gmail o necesito Workspace?",
    a: "Puedes usar cualquier cuenta con autenticación OAuth: Gmail personal, Gmail corporativo o Microsoft 365. No pedimos contraseñas; gestionamos los tokens de acceso de forma 100% segura.",
  },
  {
    q: "¿Cómo sé que esto va a funcionar para mi negocio?",
    a: "El contacto en frío B2B es el modelo más predecible para escalar ventas: piensa en LeadGen by Robotice como en contratar un equipo de ventas aumentado por IA. Mientras una persona puede enviar 30 correos de calidad por día, nuestro sistema puede enviar 300 o 500 con el mismo nivel de personalización. Más volumen + precisión = más reuniones.",
  },
  {
    q: "¿Necesito tener experiencia en marketing o ventas para usarlo?",
    a: "No. Nuestro equipo diseña las plantillas, segmenta tus audiencias y ejecuta las campañas. Tú solo defines el tipo de cliente que quieres y apruebas los mensajes antes de comenzar.",
  },
  {
    q: "¿Qué pasa si quiero cambiar de plan o cancelar?",
    a: "Puedes escalar o pausar tu plan en cualquier momento. Todos los datos y campañas quedan guardados y pueden reactivarse sin costo adicional.",
  },
  {
    q: "¿Qué tipo de resultados puedo esperar?",
    a: "En promedio, nuestros clientes obtienen tasas de apertura entre 65–80% y tasas de respuesta de 4–7%, con 6–12 reuniones mensuales en promedio, dependiendo del volumen de envíos.",
  },
];

export function FAQGrowthSection() {
  return (
    <section className="py-20 px-6 md:px-0 bg-[#0b1120] text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center tracking-tight">Preguntas frecuentes</h2>
        <p className="text-slate-400 text-center mt-2">
          Todo lo que necesitas saber antes de automatizar tu prospección.
        </p>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, idx) => (
            <motion.details
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="group border border-slate-700/40 rounded-2xl bg-slate-800/30 backdrop-blur-md p-5 cursor-pointer hover:border-blue-500/40 transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)]"
            >
              <summary className="flex items-center justify-between font-medium text-lg text-white list-none">
                {faq.q}
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="text-slate-400 text-sm mt-3 leading-relaxed">{faq.a}</p>
            </motion.details>
          ))}
        </div>

        {/* CTA opcional */}
        {/* <div className="text-center mt-10">
          <a href="#comparison" className="inline-block px-6 py-3 bg-blue-600 rounded-xl font-semibold hover:bg-blue-500 transition">Ver planes disponibles</a>
        </div> */}
      </div>
    </section>
  );
}
