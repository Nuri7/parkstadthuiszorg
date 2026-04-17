import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, HeartPulse, Clock, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';

type Step = 1 | 2 | 3 | 4;

export function MultiStepForm() {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    postcode: '',
    careType: '',
    forWhom: 'myself',
    situation: '',
    preferredDays: [] as string[],
    preferredTime: ''
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 4) as Step);
  const prevStep = () => setStep((s) => Math.max(s - 1, 1) as Step);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://formspree.io/f/dummy-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setStep(4);
      } else {
        alert("Er ging iets mis bij het verzenden. Probeer het later opnieuw of bel ons.");
      }
    } catch (error) {
      alert("Er ging iets mis. Controleer uw internetverbinding.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleDay = (day: string) => {
    setFormData(prev => {
      const days = prev.preferredDays.includes(day)
        ? prev.preferredDays.filter(d => d !== day)
        : [...prev.preferredDays, day];
      return { ...prev, preferredDays: days };
    });
  };

  // Step Indicators
  const progressPercent = ((step - 1) / 3) * 100;

  return (
    <div className="bg-white dark:bg-[#243029] rounded-3xl p-6 md:p-10 shadow-xl border border-[#ede7db] dark:border-[#086370]">
      
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4 relative z-10">
           {[1, 2, 3, 4].map((s) => (
              <div 
                key={s} 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 
                  ${step >= s ? 'bg-[var(--color-sage-500)] text-white shadow-md' : 'bg-[var(--color-sage-50)] dark:bg-[#02191c] text-[#a0afa0]'}`}
              >
                {s === 1 && <User className="w-4 h-4" />}
                {s === 2 && <HeartPulse className="w-4 h-4" />}
                {s === 3 && <Clock className="w-4 h-4" />}
                {s === 4 && <CheckCircle2 className="w-4 h-4" />}
              </div>
           ))}
        </div>
        <div className="h-1.5 w-full bg-[var(--color-sage-50)] dark:bg-[#02191c] rounded-full relative -mt-9 z-0 overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-[var(--color-sage-500)] transition-all duration-500 ease-in-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs font-semibold mt-6 text-[#8a9a8a] hidden sm:flex">
          <span className={step >= 1 ? "text-[var(--color-sage-500)]" : ""}>Contact</span>
          <span className={step >= 2 ? "text-[var(--color-sage-500)]" : ""}>Zorgvraag</span>
          <span className={step >= 3 ? "text-[var(--color-sage-500)]" : ""}>Plannen</span>
          <span className={step >= 4 ? "text-[var(--color-sage-500)]" : ""}>Klaar</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="min-h-[350px] relative">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h4 className="text-2xl font-heading text-[var(--color-sage-800)] dark:text-[var(--color-beige-50)] mb-2">Wie bent u?</h4>
                <p className="text-[#4f6b6f] dark:text-[#5cb0bd] mb-6">Laat uw gegevens achter zodat we bereikbaar zijn.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[var(--color-sage-800)] dark:text-[var(--color-beige-300)] mb-1.5">Volledige naam</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-beige-50)] dark:bg-[#02191c] border border-[var(--color-beige-300)] dark:border-[#086370] focus:outline-none focus:border-[var(--color-sage-400)] focus:ring-2 focus:ring-[var(--color-sage-400)]/20 transition-all text-[var(--color-sage-800)] dark:text-white"
                    placeholder="Uw naam"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-[var(--color-sage-800)] dark:text-[var(--color-beige-300)] mb-1.5">Telefoonnummer</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--color-beige-50)] dark:bg-[#02191c] border border-[var(--color-beige-300)] dark:border-[#086370] focus:outline-none focus:border-[var(--color-sage-400)] focus:ring-2 focus:ring-[var(--color-sage-400)]/20 transition-all text-[var(--color-sage-800)] dark:text-white"
                      placeholder="06 1234 5678"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[var(--color-sage-800)] dark:text-[var(--color-beige-300)] mb-1.5">E-mailadres (optioneel)</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl bg-[var(--color-beige-50)] dark:bg-[#02191c] border border-[var(--color-beige-300)] dark:border-[#086370] focus:outline-none focus:border-[var(--color-sage-400)] focus:ring-2 focus:ring-[var(--color-sage-400)]/20 transition-all text-[var(--color-sage-800)] dark:text-white"
                      placeholder="naam@voorbeeld.nl"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="postcode" className="block text-sm font-semibold text-[var(--color-sage-800)] dark:text-[var(--color-beige-300)] mb-1.5">Postcode zorglocatie</label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    className="w-full md:w-1/2 px-4 py-3 rounded-xl bg-[var(--color-beige-50)] dark:bg-[#02191c] border border-[var(--color-beige-300)] dark:border-[#086370] focus:outline-none focus:border-[var(--color-sage-400)] focus:ring-2 focus:ring-[var(--color-sage-400)]/20 transition-all text-[var(--color-sage-800)] dark:text-white uppercase"
                    placeholder="1234 AB"
                    required
                  />
                  <p className="text-xs text-[#4f6b6f] mt-2">Wij bieden momenteel thuiszorg aan in Parkstad (Landgraaf, Heerlen, Kerkrade).</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Care Needs */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h4 className="text-2xl font-heading text-[var(--color-sage-800)] dark:text-[var(--color-beige-50)] mb-2">Waar bent u naar op zoek?</h4>
                <p className="text-[#4f6b6f] dark:text-[#5cb0bd] mb-6">Vertel ons kort over de benodigde zorg.</p>
              </div>

               <div>
                 <label className="block text-sm font-semibold text-[var(--color-sage-800)] dark:text-[var(--color-beige-300)] mb-3">Voor wie vraagt u de zorg aan?</label>
                 <div className="flex gap-4">
                   <label className={`flex-1 flex items-center justify-center border p-4 rounded-xl cursor-pointer transition-colors ${formData.forWhom === 'myself' ? 'border-[var(--color-sage-500)] bg-[var(--color-sage-50)] dark:bg-[#02191c] ring-1 ring-[var(--color-sage-500)]' : 'border-[var(--color-beige-300)] dark:border-[#086370] hover:bg-gray-50 dark:hover:bg-[#02191c]/50'}`}>
                     <input type="radio" name="forWhom" value="myself" checked={formData.forWhom === 'myself'} onChange={handleInputChange} className="hidden" />
                     <span className="font-medium text-[var(--color-sage-800)] dark:text-white">Voor mezelf</span>
                   </label>
                   <label className={`flex-1 flex items-center justify-center border p-4 rounded-xl cursor-pointer transition-colors ${formData.forWhom === 'other' ? 'border-[var(--color-sage-500)] bg-[var(--color-sage-50)] dark:bg-[#02191c] ring-1 ring-[var(--color-sage-500)]' : 'border-[var(--color-beige-300)] dark:border-[#086370] hover:bg-gray-50 dark:hover:bg-[#02191c]/50'}`}>
                     <input type="radio" name="forWhom" value="other" checked={formData.forWhom === 'other'} onChange={handleInputChange} className="hidden" />
                     <span className="font-medium text-[var(--color-sage-800)] dark:text-white">Voor een naaste</span>
                   </label>
                 </div>
               </div>

              <div>
                <label htmlFor="careType" className="block text-sm font-semibold text-[var(--color-sage-800)] dark:text-[var(--color-beige-300)] mb-1.5">Type Zorg (meerdere mogelijk bij intake)</label>
                <select
                  id="careType"
                  name="careType"
                  value={formData.careType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-beige-50)] dark:bg-[#02191c] border border-[var(--color-beige-300)] dark:border-[#086370] focus:outline-none focus:border-[var(--color-sage-400)] focus:ring-2 focus:ring-[var(--color-sage-400)]/20 transition-all text-[var(--color-sage-800)] dark:text-white appearance-none"
                  required
                >
                  <option value="" disabled>Selecteer een zorgvorm...</option>
                  <option value="verpleging">Wijkverpleging (injecties, wondzorg, etc.)</option>
                  <option value="verzorging">Persoonlijke verzorging (wassen, aankleden)</option>
                  <option value="palliatief">Palliatieve / Terminale zorg</option>
                  <option value="begeleiding">Individuele begeleiding</option>
                  <option value="nachtzorg">Nachtzorg</option>
                  <option value="weet-niet">Ik weet het niet / ander</option>
                </select>
              </div>

               <div>
                  <label htmlFor="situation" className="block text-sm font-semibold text-[var(--color-sage-800)] dark:text-[var(--color-beige-300)] mb-1.5">Huidige situatie (optioneel)</label>
                  <textarea
                    id="situation"
                    name="situation"
                    value={formData.situation}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-beige-50)] dark:bg-[#02191c] border border-[var(--color-beige-300)] dark:border-[#086370] focus:outline-none focus:border-[var(--color-sage-400)] focus:ring-2 focus:ring-[var(--color-sage-400)]/20 transition-all text-[var(--color-sage-800)] dark:text-white resize-none"
                    placeholder="Beschrijf kort waarom er zorg nodig is..."
                  ></textarea>
                </div>
            </motion.div>
          )}

          {/* STEP 3: Appointments */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h4 className="text-2xl font-heading text-[var(--color-sage-800)] dark:text-[var(--color-beige-50)] mb-2">Voorkeurstijden Intake</h4>
                <p className="text-[#4f6b6f] dark:text-[#5cb0bd] mb-6">Wanneer kunnen we het beste contact opnemen of langskomen?</p>
              </div>

               <div>
                 <label className="block text-sm font-semibold text-[var(--color-sage-800)] dark:text-[var(--color-beige-300)] mb-3">Welke dagen komen goed uit?</label>
                 <div className="flex flex-wrap gap-2">
                   {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'].map((day) => (
                      <button
                        type="button"
                        key={day}
                        onClick={() => toggleDay(day)}
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center font-medium transition-colors
                          ${formData.preferredDays.includes(day) 
                            ? 'bg-[var(--color-sage-500)] text-white border-[var(--color-sage-500)]' 
                            : 'bg-white dark:bg-[#02191c] text-[#4f6b6f] dark:text-[var(--color-beige-300)] border-[var(--color-beige-300)] dark:border-[#086370] hover:bg-gray-50'
                          }`}
                      >
                        {day}
                      </button>
                   ))}
                 </div>
               </div>

                <div>
                 <label className="block text-sm font-semibold text-[var(--color-sage-800)] dark:text-[var(--color-beige-300)] mb-3">Geprefereerd dagdeel</label>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                   {['Ochtend', 'Middag', 'Avond', 'Geen voorkeur'].map((time) => (
                     <label key={time} className={`flex items-center justify-center border p-3 rounded-xl cursor-pointer transition-colors text-sm ${formData.preferredTime === time ? 'border-[var(--color-sage-500)] bg-[var(--color-sage-50)] dark:bg-[#02191c] ring-1 ring-[var(--color-sage-500)]' : 'border-[var(--color-beige-300)] dark:border-[#086370] hover:bg-gray-50 dark:hover:bg-[#02191c]/50'}`}>
                       <input type="radio" name="preferredTime" value={time} checked={formData.preferredTime === time} onChange={handleInputChange} className="hidden" />
                       <span className="font-medium text-[var(--color-sage-800)] dark:text-white px-2 text-center">{time}</span>
                     </label>
                   ))}
                 </div>
               </div>
               
               <div className="bg-[#fffbeb] dark:bg-[#78350F]/20 border border-[#fef3c7] dark:border-[#78350F] rounded-xl p-4 mt-6">
                 <p className="text-sm text-[#92400e] dark:text-[#fcd34d] font-medium">Binnen 24 uur bellen wij u terug om de intake definitief in te plannen.</p>
               </div>
            </motion.div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
               <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                 <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
               </div>
               <h4 className="text-3xl font-heading text-[var(--color-sage-800)] dark:text-[var(--color-beige-50)] mb-4">Aanvraag Ontvangen</h4>
               <p className="text-[#4f6b6f] dark:text-[#5cb0bd] mb-8 max-w-md mx-auto">
                 Bedankt voor uw aanvraag, {formData.name}. Wij hebben uw gegevens goed ontvangen en nemen uiterlijk de volgende werkdag contact met u op.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button asChild variant="outline">
                   <a href="tel:+31612345678">Toch Direct Bellen</a>
                 </Button>
               </div>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Form Controls */}
        {step < 4 && (
          <div className="flex justify-between items-center mt-12 pt-6 border-t border-[#ede7db] dark:border-[#086370]">
            {step > 1 ? (
              <Button type="button" variant="ghost" onClick={prevStep}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Vorige
              </Button>
            ) : <div></div>}

            {step < 3 ? (
              <Button type="button" variant="primary" onClick={nextStep} disabled={step === 1 && (!formData.name || !formData.phone || !formData.postcode)}>
                Volgende stap
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Bezig met verzenden...' : 'Aanvraag Afronden'}
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
