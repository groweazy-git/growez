"use client";

import { useState } from "react";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState("Calculating Brand Position...");
  
  const [analysisData, setAnalysisData] = useState<any>(null);

  const [businessData, setBusinessData] = useState({
    business_name: "",
    city: "",
    industry: "",
    years_in_business: "",
    business_stage: "",
    primary_goal: [] as string[],
    followers: "",
    posting_frequency: "",
    brand_tone: [] as string[],
    usp: ""
  });

  const nextStep = () => {
    if (step < 8) setStep(step + 1);
    else handleComplete();
  };

  const handleComplete = async () => {
    setAnalyzing(true);
    
    // Cycle through messages
    setTimeout(() => setAnalysisMessage("Generating Content Calendar..."), 2000);
    setTimeout(() => setAnalysisMessage("Optimizing Lead Generation..."), 4000);

    try {
      const res = await fetch("http://localhost:4000/content/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(businessData),
      });
      const data = await res.json();
      setAnalysisData(data.data);
    } catch (err) {
      console.error(err);
      alert("Error analyzing profile");
    } finally {
      setAnalyzing(false);
      setCompleted(true);
    }
  };

  if (completed) {
    return <Dashboard businessData={businessData} initialAnalysis={analysisData} />;
  }

  if (analyzing) {
    return (
      <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center shadow-lg relative mb-8">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
          <span className="material-symbols-outlined text-4xl text-primary animate-pulse">analytics</span>
        </div>
        <h2 className="font-h3 text-h3 text-on-background mb-2">Building Your Marketing Engine</h2>
        <p className="font-body-lg text-primary font-bold animate-pulse">{analysisMessage}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background py-12 px-4">
      <main className="max-w-[700px] mx-auto bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-sm border border-outline-variant">
        
        {/* Header & Progress */}
        <header className="mb-12">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="font-label-caps text-label-caps text-primary mb-2 block tracking-widest uppercase">Marketing Profile</span>
              <h1 className="font-h2 text-h2 text-on-background">Step {step} of 8</h1>
            </div>
            <div className="text-right">
              <div className="font-body-sm text-body-sm text-on-surface font-bold mt-1">{Math.round((step / 8) * 100)}% Complete</div>
            </div>
          </div>
          <div className="h-2 bg-surface-variant w-full rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${(step / 8) * 100}%` }}
            ></div>
          </div>
        </header>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="animate-fade-in text-center py-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <span className="material-symbols-outlined text-4xl">rocket_launch</span>
            </div>
            <h2 className="font-h2 text-h2 mb-4">Let's build your marketing engine.</h2>
            <p className="font-body-lg text-on-surface-variant max-w-md mx-auto">
              Answer a few questions like a fitness assessment, and we'll create your first month of content and marketing strategy.
            </p>
          </div>
        )}

        {/* Step 2: Business Type */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="font-h3 text-h3 mb-6">What type of business are you?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Gym', 'Salon', 'Café', 'Dental Clinic', 'Real Estate', 'Yoga Studio'].map((type) => (
                <label key={type} className="block cursor-pointer">
                  <input type="radio" name="industry" value={type} checked={businessData.industry === type} onChange={(e) => setBusinessData({ ...businessData, industry: e.target.value })} className="sr-only peer" />
                  <div className="p-5 rounded-2xl border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-[rgba(37,99,235,0.05)] transition-all">
                    <h4 className="font-body-md font-bold">{type}</h4>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Business Info */}
        {step === 3 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="font-h3 text-h3 mb-6">Tell us about your business</h2>
            <div>
              <label className="block font-body-sm font-bold mb-2">Business Name</label>
              <input type="text" placeholder="e.g. Iron Arena" className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary outline-none transition-all font-body-md text-on-surface" value={businessData.business_name} onChange={(e) => setBusinessData({ ...businessData, business_name: e.target.value })} />
            </div>
            <div>
              <label className="block font-body-sm font-bold mb-2">City</label>
              <input type="text" placeholder="e.g. Kochi" className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary outline-none transition-all font-body-md text-on-surface" value={businessData.city} onChange={(e) => setBusinessData({ ...businessData, city: e.target.value })} />
            </div>
            <div>
              <label className="block font-body-sm font-bold mb-2">Years In Business</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['0–1', '1–3', '3–5', '5+'].map((yrs) => (
                  <label key={yrs} className="block cursor-pointer">
                    <input type="radio" name="years" value={yrs} checked={businessData.years_in_business === yrs} onChange={(e) => setBusinessData({ ...businessData, years_in_business: e.target.value })} className="sr-only peer" />
                    <div className="p-3 text-center rounded-xl border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary/5 transition-all font-bold text-sm">
                      {yrs}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Business Stage */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className="font-h3 text-h3 mb-6">What best describes your business?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Just Started', 'Growing', 'Established', 'Well Known'].map((stage) => (
                <label key={stage} className="block cursor-pointer">
                  <input type="radio" name="stage" value={stage} checked={businessData.business_stage === stage} onChange={(e) => setBusinessData({ ...businessData, business_stage: e.target.value })} className="sr-only peer" />
                  <div className="p-5 rounded-2xl border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-[rgba(37,99,235,0.05)] transition-all">
                    <h4 className="font-body-md font-bold">{stage}</h4>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Primary Goal */}
        {step === 5 && (
          <div className="animate-fade-in">
            <h2 className="font-h3 text-h3 mb-6">What is your primary goal right now?</h2>
            <div className="grid grid-cols-1 gap-3">
              {['More Leads', 'More Bookings', 'More Memberships', 'More Walk-ins', 'Better Brand Awareness'].map((goal) => (
                <label key={goal} className="block cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="goal" 
                    value={goal} 
                    checked={(businessData.primary_goal || []).includes(goal)} 
                    onChange={() => {
                      const current = businessData.primary_goal || [];
                      const updated = current.includes(goal) ? current.filter(g => g !== goal) : [...current, goal];
                      setBusinessData({ ...businessData, primary_goal: updated });
                    }} 
                    className="sr-only peer" 
                  />
                  <div className="p-4 rounded-xl border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary/5 transition-all flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${(businessData.primary_goal || []).includes(goal) ? 'border-primary bg-primary' : 'border-outline-variant'}`}>
                      {(businessData.primary_goal || []).includes(goal) && <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>}
                    </div>
                    <span className="font-body-md font-bold">{goal}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Current Social Presence */}
        {step === 6 && (
          <div className="animate-fade-in space-y-8">
            <h2 className="font-h3 text-h3 mb-2">Current Social Presence</h2>
            
            <div>
              <label className="block font-body-sm font-bold mb-4">Instagram Followers</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['0–100', '100–500', '500–2000', '2000+'].map((f) => (
                  <label key={f} className="block cursor-pointer">
                    <input type="radio" name="followers" value={f} checked={businessData.followers === f} onChange={(e) => setBusinessData({ ...businessData, followers: e.target.value })} className="sr-only peer" />
                    <div className="p-3 text-center rounded-xl border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary/5 transition-all font-bold text-sm">
                      {f}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-body-sm font-bold mb-4">Posting Frequency</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Never', 'Sometimes', 'Weekly', 'Daily'].map((freq) => (
                  <label key={freq} className="block cursor-pointer">
                    <input type="radio" name="freq" value={freq} checked={businessData.posting_frequency === freq} onChange={(e) => setBusinessData({ ...businessData, posting_frequency: e.target.value })} className="sr-only peer" />
                    <div className="p-3 text-center rounded-xl border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary/5 transition-all font-bold text-sm">
                      {freq}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Content Style */}
        {step === 7 && (
          <div className="animate-fade-in">
            <h2 className="font-h3 text-h3 mb-6">Select your content style</h2>
            <div className="flex flex-wrap gap-3">
              {['Professional', 'Friendly', 'Premium', 'Luxury', 'Energetic'].map((tone) => (
                <label key={tone} className="block cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="tone" 
                    value={tone} 
                    checked={(businessData.brand_tone || []).includes(tone)} 
                    onChange={() => {
                      const current = businessData.brand_tone || [];
                      const updated = current.includes(tone) ? current.filter(t => t !== tone) : [...current, tone];
                      setBusinessData({ ...businessData, brand_tone: updated });
                    }} 
                    className="sr-only peer" 
                  />
                  <div className="px-6 py-3 rounded-full border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:text-primary transition-all font-bold">
                    {tone}
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: USP */}
        {step === 8 && (
          <div className="animate-fade-in">
            <h2 className="font-h3 text-h3 mb-2">What is your Unique Selling Point?</h2>
            <p className="font-body-md text-on-surface-variant mb-6">What makes you stand out from the competition?</p>
            
            <textarea 
              className="w-full p-4 rounded-xl border border-outline-variant focus:border-primary outline-none transition-all font-body-md text-on-surface h-32 resize-none mb-4"
              placeholder="e.g. Certified trainers, ladies only section, transformation focused..."
              value={businessData.usp}
              onChange={(e) => setBusinessData({ ...businessData, usp: e.target.value })}
            ></textarea>
            
            <div className="p-4 bg-surface-container rounded-xl text-sm">
              <p className="font-bold mb-2">Examples:</p>
              <ul className="text-on-surface-variant space-y-1 list-disc list-inside">
                <li><strong>Gym:</strong> Ladies only, 24/7 access</li>
                <li><strong>Salon:</strong> Bridal specialist, organic products</li>
                <li><strong>Café:</strong> Specialty coffee, vegan pastries</li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-12 flex items-center justify-between pt-6 border-t border-outline-variant">
          <button 
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className={`h-12 px-8 rounded-full font-body-md font-bold transition-colors ${step === 1 ? 'invisible' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
          >
            Back
          </button>
          
          <button 
            onClick={nextStep}
            className="h-12 px-8 bg-primary text-white rounded-full font-body-md font-bold hover:bg-primary-container transition-colors shadow-sm flex items-center gap-2"
          >
            {step === 8 ? (
              <>Analyze My Business <span className="material-symbols-outlined text-[20px]">analytics</span></>
            ) : step === 1 ? (
              <>Start Assessment <span className="material-symbols-outlined text-[20px]">arrow_forward</span></>
            ) : (
              "Continue"
            )}
          </button>
        </div>

      </main>
    </div>
  );
}
