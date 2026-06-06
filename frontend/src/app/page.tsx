"use client";

import { useState } from "react";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [businessData, setBusinessData] = useState({
    business_name: "",
    industry: "",
    target_audience: "",
    brand_tone: "professional",
    primary_goal: "Drive Sales",
  });

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else handleComplete();
  };

  const handleComplete = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCompleted(true);
    }, 1500);
  };

  if (completed) {
    return <Dashboard businessData={businessData} />;
  }

  const toneExamples: any = {
    professional: "Our team is dedicated to your success. Visit our facility to start your personalized training program today.",
    friendly: "Hey there! We're so excited to help you hit your goals this week. Come on in and let's make magic happen!",
    luxury: "Experience a level of service curated exclusively for you. We invite you to explore our premium amenities at your leisure.",
    energetic: "Let's go! No more excuses – today is the day we crush your personal best. Are you ready to level up?!"
  };

  return (
    <div className="min-h-screen bg-background text-on-background py-12 px-4">
      <main className="max-w-[700px] mx-auto bg-surface-container-lowest rounded-3xl p-8 md:p-12 shadow-sm border border-outline-variant">
        
        {/* Header & Progress */}
        <header className="mb-12">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="font-label-caps text-label-caps text-primary mb-2 block tracking-widest uppercase">Getting Started</span>
              <h1 className="font-h2 text-h2 text-on-background">Business Profile</h1>
            </div>
            <div className="text-right">
              <span className="font-label-caps text-label-caps text-on-surface-variant">Step {step} of 3</span>
              <div className="font-body-sm text-body-sm text-on-surface font-bold mt-1">{Math.round((step / 3) * 100)}% Complete</div>
            </div>
          </div>
          <div className="h-2 bg-surface-variant w-full rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" 
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </header>

        {/* Step 1: Basics */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="font-h3 text-h3 mb-2">Let's start with the basics</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">This information helps our AI tailor content specifically to your niche and audience.</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block font-body-sm text-body-sm font-bold mb-2">Business Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. FitZone Downtown"
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-on-surface"
                  value={businessData.business_name}
                  onChange={(e) => setBusinessData({ ...businessData, business_name: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-body-sm text-body-sm font-bold mb-2">Industry / Niche</label>
                <select 
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-on-surface bg-white"
                  value={businessData.industry}
                  onChange={(e) => setBusinessData({ ...businessData, industry: e.target.value })}
                >
                  <option value="" disabled>Select your industry</option>
                  <option value="fitness">Fitness & Gym</option>
                  <option value="restaurant">Restaurant & Cafe</option>
                  <option value="retail">Local Retail</option>
                  <option value="salon">Salon & Spa</option>
                  <option value="other">Other Local Business</option>
                </select>
              </div>

              <div>
                <label className="block font-body-sm text-body-sm font-bold mb-2">Target Audience</label>
                <input 
                  type="text" 
                  placeholder="e.g. Young professionals looking to stay active"
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-on-surface"
                  value={businessData.target_audience}
                  onChange={(e) => setBusinessData({ ...businessData, target_audience: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-body-sm text-body-sm font-bold mb-2">Primary Goal</label>
                <select 
                  className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md text-on-surface bg-white"
                  value={businessData.primary_goal}
                  onChange={(e) => setBusinessData({ ...businessData, primary_goal: e.target.value })}
                >
                  <option value="Drive Sales">Drive Sales</option>
                  <option value="Brand Awareness">Brand Awareness</option>
                  <option value="Lead Generation">Lead Generation</option>
                  <option value="Community Engagement">Community Engagement</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Brand Tone */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="font-h3 text-h3 mb-2">Choose your brand voice</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">How do you want to sound when speaking to your customers online?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {['professional', 'friendly', 'luxury', 'energetic'].map((tone) => (
                <label key={tone} className="block cursor-pointer">
                  <input 
                    type="radio" 
                    name="tone" 
                    value={tone} 
                    checked={businessData.brand_tone === tone}
                    onChange={(e) => setBusinessData({ ...businessData, brand_tone: e.target.value })}
                    className="sr-only peer" 
                  />
                  <div className="p-5 rounded-2xl border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-[rgba(37,99,235,0.05)] transition-all">
                    <h4 className="font-body-md font-bold capitalize mb-1">{tone}</h4>
                  </div>
                </label>
              ))}
            </div>

            <div className="bg-surface-container p-6 rounded-2xl border border-outline-variant">
              <span className="font-label-caps text-label-caps text-primary mb-2 block tracking-widest uppercase">Preview</span>
              <p className="font-body-md italic text-on-surface-variant">"{toneExamples[businessData.brand_tone]}"</p>
            </div>
          </div>
        )}

        {/* Step 3: Raw Materials */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <h2 className="font-h3 text-h3 mb-2">Upload Raw Footage</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">We'll stitch these together into high-performing Reels and TikToks.</p>
            </div>

            <div className="border-2 border-dashed border-outline-variant rounded-3xl p-12 text-center bg-surface-container-lowest hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-[rgba(37,99,235,0.1)] text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[32px]">cloud_upload</span>
              </div>
              <h3 className="font-h4 text-h4 mb-2">Drag & drop your videos</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">MP4, MOV up to 500MB</p>
              
              <button className="px-6 h-12 bg-surface-container text-on-surface font-bold rounded-full hover:bg-surface-dim transition-colors">
                Browse Files
              </button>
            </div>

            <div className="mt-8 p-4 bg-[rgba(16,185,129,0.1)] rounded-2xl flex items-start gap-4">
              <span className="material-symbols-outlined text-secondary mt-1">auto_awesome</span>
              <div>
                <h4 className="font-body-md font-bold text-on-surface">AI Magic Enabled</h4>
                <p className="font-body-sm text-on-surface-variant mt-1">We'll automatically cut silence, add trending music, and generate captions.</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-12 flex items-center justify-between pt-6 border-t border-outline-variant">
          <button 
            onClick={() => setStep(step - 1)}
            disabled={step === 1 || loading}
            className={`h-12 px-8 rounded-full font-body-md font-bold transition-colors ${step === 1 ? 'invisible' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}`}
          >
            Back
          </button>
          
          <button 
            onClick={nextStep}
            disabled={loading}
            className="h-12 px-10 rounded-full bg-primary text-white font-bold hover:bg-[rgba(0,74,198,1)] active:scale-95 transition-all shadow-sm flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                Personalizing...
              </>
            ) : (
              step === 3 ? "Complete Setup" : "Next Step"
            )}
          </button>
        </div>

      </main>
    </div>
  );
}
