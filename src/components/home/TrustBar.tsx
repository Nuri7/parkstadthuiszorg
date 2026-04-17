import { ShieldCheck, Heart, UserCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function TrustBar() {
  const trustItems = [
    { icon: ShieldCheck, text: "BIG-geregistreerd", subtext: "Gediplomeerd personeel" },
    { icon: Heart, text: "200+ Families", subtext: "Lokaal geholpen" },
    { icon: UserCheck, text: "Vast Gezicht", subtext: "Vertrouwde zorgverleners" },
    { icon: Clock, text: "Geen Wachtlijst", subtext: "Snel inzetbaar" },
  ];

  return (
    <section className="relative -mt-12 z-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="glass rounded-2xl p-6 md:p-8 shadow-xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-x divide-[#ede7db] dark:divide-[#344a3c] [&>div:first-child]:border-0 [&>div:nth-child(3)]:border-0 md:[&>div:nth-child(3)]:border-l">
          {trustItems.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center px-2">
              <div className="w-10 h-10 rounded-full bg-[#f0f5f1] dark:bg-[#1e2e25] flex items-center justify-center mb-3">
                <item.icon className="w-5 h-5 text-[#5b7f63] dark:text-[#7c9a82]" />
              </div>
              <h3 className="text-sm md:text-base font-bold text-[#2d3b2d] dark:text-[#fdfbf7]">{item.text}</h3>
              <p className="text-xs md:text-sm text-[#6B7B6B] dark:text-[#94ba9a] mt-1">{item.subtext}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
