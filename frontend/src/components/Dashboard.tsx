"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard({ businessData }: { businessData: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Content Generation State
  const [contentPlan, setContentPlan] = useState<any>(null);
  const [bundleBusinessType, setBundleBusinessType] = useState(businessData?.industry || businessData?.niche || "Local Bakery");
  const [bundleGoal, setBundleGoal] = useState(businessData?.primary_goal || "Drive Sales");
  const [bundleOffer, setBundleOffer] = useState("");
  const [bundleTopic, setBundleTopic] = useState("");

  // Content Calendar State
  const [calendar, setCalendar] = useState<any>(null);

  // Image Generation State
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Lead Generation State
  const [leadGen, setLeadGen] = useState<any>(null);
  
  // Modal State
  const [selectedContent, setSelectedContent] = useState<any>(null);

  // Video State
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
  const [videoStatus, setVideoStatus] = useState("");

  const handleLogout = () => {
    window.location.reload();
  };

  const generateContent = async () => {
    setLoading(true);
    try {
      const payload = {
        ...businessData,
        niche: bundleBusinessType,
        goal: bundleGoal,
        offer: bundleOffer || bundleTopic || businessData.offer
      };
      
      const res = await fetch("http://localhost:4000/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setContentPlan(data.data || data);
    } catch (err) {
      console.error(err);
      alert("Error generating content");
    } finally {
      setLoading(false);
    }
  };

  const generateCalendar = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/content/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(businessData),
      });
      const data = await res.json();
      setCalendar(data.calendar);
    } catch (err) {
      console.error(err);
      alert("Error generating calendar");
    } finally {
      setLoading(false);
    }
  };

  const generateLeadGen = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/content/lead-gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(businessData),
      });
      const data = await res.json();
      setLeadGen(data.data);
    } catch (err) {
      console.error(err);
      alert("Error generating lead gen strategies");
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/content/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      const data = await res.json();
      setGeneratedImage(data.imageUrl);
    } catch (err) {
      console.error(err);
      alert("Error generating image");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (e: any) => {
    if (e.target.files) {
      setSelectedVideos(Array.from(e.target.files));
    }
  };

  const handleVideoUpload = async () => {
    if (selectedVideos.length === 0) return;
    setUploading(true);
    setVideoStatus("Uploading and processing video...");
    setTimeout(() => {
      setVideoStatus("Video edited and scheduled successfully!");
      setUploading(false);
    }, 4000);
  };

  const navItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'video', icon: 'video_call', label: 'Video Engine' },
    { id: 'content', icon: 'magic_button', label: 'Generate' },
    { id: 'calendar', icon: 'calendar_month', label: 'Calendar' },
    { id: 'image', icon: 'image', label: 'Image Gen' },
    { id: 'leadgen', icon: 'campaign', label: 'Lead Gen' },
    { id: 'billing', icon: 'payments', label: 'Pricing' },
  ];

  return (
    <div className="bg-background text-on-surface min-h-screen font-body-md flex relative overflow-hidden">
      
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col gap-4 p-6 w-[280px] h-screen fixed left-0 top-0 bg-surface border-r border-outline-variant z-40 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <span className="font-h3 text-h3 font-bold text-primary">LocalBiz</span>
        </div>
        <button className="bg-primary-container text-on-primary-container h-12 rounded-[20px] font-body-md font-bold flex items-center justify-center gap-2 mb-6 hover:opacity-90 transition-all">
          <span className="material-symbols-outlined">add</span>
          New Post
        </button>
        <nav className="flex flex-col gap-2 flex-grow">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl transition-colors ${activeTab === item.id ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-body-md">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-outline-variant">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-error transition-all rounded-xl hover:bg-[rgba(186,26,26,0.1)]">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-caps tracking-widest uppercase text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-0 md:ml-[280px] flex-1 z-10 flex flex-col min-h-screen">
        
        {/* TopAppBar */}
        <header className="flex justify-between items-center h-16 px-8 sticky top-0 bg-surface/80 backdrop-blur-md shadow-sm z-30 border-b border-outline-variant">
          <h1 className="font-h4 text-h4 font-bold text-primary capitalize">{activeTab.replace('_', ' ')}</h1>
          <div className="flex items-center gap-4">
            <button className="h-10 px-4 bg-tertiary/10 text-tertiary rounded-full font-label-caps uppercase tracking-wider flex items-center gap-2 font-bold hover:bg-tertiary/20 transition-all">
              <span className="material-symbols-outlined text-[18px]">star</span> Upgrade
            </button>
            <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant">
              <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-on-surface-variant">person</span>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="p-8 max-w-[1400px] w-full mx-auto flex-1 pb-16">
          
          {activeTab === "dashboard" && (
            <div className="animate-fade-in">
              {/* Welcome Header */}
              <div className="mb-8">
                <h2 className="font-h2 text-h2 font-bold text-on-surface mb-2">Good Morning, {businessData.business_name || 'Business'}</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Here is your AI-generated content strategy for today.</p>
              </div>

              {/* Today's Content Grid */}
              <section className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-h4 text-h4 font-bold text-on-surface">Today's Content</h3>
                  <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-caps uppercase tracking-widest text-xs font-bold">3 READY TO POST</span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Card 1: Feed Post */}
                  <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-[16px] shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="bg-primary/10 text-primary p-2 rounded-lg">
                        <span className="material-symbols-outlined">grid_view</span>
                      </div>
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">content_copy</span>
                      </button>
                    </div>
                    <div>
                      <h4 className="font-h4 text-h4 font-bold text-on-surface mb-1">Feed Post</h4>
                      <p className="font-body-sm text-tertiary font-bold">Instagram & Facebook</p>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                      <span className="font-label-caps text-xs font-bold text-on-surface-variant block mb-2 uppercase">Caption</span>
                      <p className="font-body-md text-on-surface line-clamp-4">
                        Small businesses are the heartbeat of our community! ❤️ Supporting local isn't just a trend, it's a lifestyle. Come visit us this weekend and see what's new. #SupportLocal #CommunityFirst
                      </p>
                    </div>
                    <div className="mt-auto pt-2 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-[18px]">link</span>
                        <span className="font-body-sm font-bold">CTA: Book Your Slot Now</span>
                      </div>
                      <button className="w-full bg-primary text-white h-12 rounded-[20px] font-body-md font-bold hover:brightness-110 active:scale-95 transition-all mt-2 shadow-sm">
                        Publish Now
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Story */}
                  <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-[16px] shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="bg-secondary/10 text-secondary p-2 rounded-lg">
                        <span className="material-symbols-outlined">history_toggle_off</span>
                      </div>
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">content_copy</span>
                      </button>
                    </div>
                    <div>
                      <h4 className="font-h4 text-h4 font-bold text-on-surface mb-1">Story Text</h4>
                      <p className="font-body-sm text-secondary font-bold">Flash Updates</p>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 grow">
                      <span className="font-label-caps text-xs font-bold text-on-surface-variant block mb-2 uppercase">Overlay Text</span>
                      <div className="space-y-4">
                        <p className="font-h3 text-h3 text-primary text-center font-bold">SALE ENDS TONIGHT!</p>
                        <p className="font-body-md text-center">Don't miss out on 20% off all marketing services. Tap the link in bio to secure your spot.</p>
                      </div>
                    </div>
                    <button className="w-full border-2 border-primary text-primary h-12 rounded-[20px] font-body-md font-bold hover:bg-primary/5 active:scale-95 transition-all mt-2">
                      Send to Phone
                    </button>
                  </div>

                  {/* Card 3: Reel Script */}
                  <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-[16px] shadow-sm flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="bg-tertiary/10 text-tertiary p-2 rounded-lg">
                        <span className="material-symbols-outlined">movie</span>
                      </div>
                      <button className="text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">content_copy</span>
                      </button>
                    </div>
                    <div>
                      <h4 className="font-h4 text-h4 font-bold text-on-surface mb-1">Reel Script</h4>
                      <p className="font-body-sm text-tertiary-container font-bold">Short Form Video</p>
                    </div>
                    <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 overflow-y-auto max-h-[160px] scrollbar-hide">
                      <div className="space-y-3">
                        <div>
                          <span className="font-label-caps text-xs font-bold text-tertiary block uppercase">Hook</span>
                          <p className="font-body-md font-bold italic">"Stop scrolling if you want to grow your local business in 30 days!"</p>
                        </div>
                        <div>
                          <span className="font-label-caps text-xs font-bold text-on-surface-variant block uppercase">Script</span>
                          <p className="font-body-md">Start with a POV shot of your storefront. Cut to three quick tips on engagement. End with a smile and a point towards the caption.</p>
                        </div>
                        <div>
                          <span className="font-label-caps text-xs font-bold text-on-surface-variant block uppercase">Caption</span>
                          <p className="font-body-sm">3 Secrets to local growth 🚀 #SmallBizTips #GrowthHacking</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-auto pt-2">
                      <button className="flex-1 bg-surface-variant text-on-surface h-12 rounded-[20px] font-body-sm font-bold hover:bg-surface-container-high transition-all">
                        Teleprompter
                      </button>
                      <button className="flex-1 bg-primary text-white h-12 rounded-[20px] font-body-sm font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm">
                        Record
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Insights Banner */}
              <section className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 bg-inverse-surface text-inverse-on-surface p-8 rounded-[24px] relative overflow-hidden group shadow-md">
                  <div className="relative z-10 flex flex-col h-full justify-center">
                    <h3 className="font-h3 text-h3 font-bold mb-4">Your brand visibility is up 14% this week</h3>
                    <p className="font-body-md opacity-80 max-w-md">Our AI analysis suggests your audience is most active at 7:00 PM. We've scheduled your Reel for that peak time.</p>
                    <div className="mt-6">
                      <button className="bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-full font-bold hover:brightness-110 transition-all shadow-sm">
                        View Detailed Analytics
                      </button>
                    </div>
                  </div>
                  <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                    <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNWDPzpGlVmHcnCq9Mukm9iKXOVQQy5pF7Q7jNmKjZXW0RYEMOt54Gqzjrx1msDQwMnvMR_nvb2sNjwY18hHftaf6TW-nY9_rYg5qYgV3KOZIai0qW_3nlouNvHEVZVn5NboNn2DkYDZ1jZ31ef4s9r6zAP9cYyucopNlDk-cdwA0vpuAX_afX4m6R1fq18h2LjBbCr4rd1xbbGwvSNDTFjDATnHmSSkw0-ZaYvMQxTO5cLRS_6N43ZYi72A1mWuPrfAPyAe3ZjQ" alt="Analytics Graphic" />
                  </div>
                </div>
                
                <div className="md:col-span-4 bg-primary-fixed text-on-primary-fixed p-8 rounded-[24px] flex flex-col justify-between shadow-md">
                  <span className="material-symbols-outlined text-[48px] text-primary">auto_awesome</span>
                  <div className="mt-4">
                    <h4 className="font-h4 text-h4 font-bold mb-2 text-primary">Assistant Tip</h4>
                    <p className="font-body-sm text-on-primary-fixed/80 italic">"Try using more 'Behind the Scenes' footage. Your audience reacts 40% more to personal stories than product photos."</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === "video" && (
            <div className="animate-fade-in">
              <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-[24px] p-8 md:p-12 mb-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-[20px] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-4xl">movie</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-h3 text-h3 font-bold mb-2">Auto-Stitch Video Engine</h3>
                    <p className="font-body-md text-on-surface-variant mb-6">Upload your raw footage. We will automatically edit, trim, and stitch them together with trending audio based on your brand preferences.</p>
                    
                    <div className="bg-surface-container p-6 rounded-[16px] border border-outline-variant border-dashed flex flex-col items-center justify-center gap-4">
                      <label className="cursor-pointer bg-primary text-white h-12 px-6 rounded-full font-body-md font-bold inline-flex items-center gap-2 hover:bg-primary-container transition-all shadow-sm">
                        <span className="material-symbols-outlined text-[20px]">upload_file</span>
                        Select Video Files
                        <input type="file" multiple accept="video/*" className="hidden" onChange={handleVideoSelect} />
                      </label>

                      {selectedVideos.length > 0 && (
                        <div className="w-full mt-2">
                          <p className="font-body-sm font-bold text-on-surface mb-2 text-center">{selectedVideos.length} file(s) selected:</p>
                          <ul className="text-sm space-y-1 mb-6 text-on-surface-variant text-center">
                            {selectedVideos.map((f, i) => <li key={i} className="truncate">- {f.name}</li>)}
                          </ul>
                          <div className="flex justify-center">
                            <button 
                              onClick={handleVideoUpload} 
                              disabled={uploading}
                              className="h-12 px-8 bg-secondary text-white rounded-full font-bold hover:bg-[rgba(0,110,45,0.9)] transition-all shadow-sm disabled:opacity-50"
                            >
                              {uploading ? "Processing..." : "Generate Final Video"}
                            </button>
                          </div>
                        </div>
                      )}

                      {videoStatus && (
                        <div className="mt-4 p-4 bg-secondary/10 text-secondary rounded-xl w-full text-center font-bold">
                          {videoStatus}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: The Form */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
                    <div className="mb-6">
                      <h3 className="font-h4 text-h4 font-bold mb-1">Bundle Creator</h3>
                      <p className="font-body-sm text-on-surface-variant">Fill in the details below to generate a coordinated marketing campaign.</p>
                    </div>
                    <form className="flex flex-col gap-6">
                      {/* Business Type */}
                      <div className="flex flex-col gap-2">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Business Type</label>
                        <select 
                          className="h-[48px] rounded-[14px] border border-outline-variant px-4 bg-surface focus:ring-2 focus:ring-primary-container focus:border-primary outline-none transition-all font-body-md"
                          value={bundleBusinessType}
                          onChange={(e) => setBundleBusinessType(e.target.value)}
                        >
                          <option>Local Bakery</option>
                          <option>Real Estate Agency</option>
                          <option>Fitness Studio</option>
                          <option>Coffee Shop</option>
                          <option>Plumbing Service</option>
                          <option>{businessData?.niche}</option>
                        </select>
                      </div>

                      {/* Goal */}
                      <div className="flex flex-col gap-2">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Primary Goal</label>
                        <div className="grid grid-cols-2 gap-2">
                          {["Drive Sales", "Brand Awareness", "Lead Generation", "Community Engagement"].map((goal) => (
                            <label key={goal} className="cursor-pointer">
                              <input 
                                type="radio" name="goal" className="hidden peer" 
                                checked={bundleGoal === goal}
                                onChange={() => setBundleGoal(goal)}
                              />
                              <div className="p-3 border border-outline-variant rounded-xl text-center font-body-sm peer-checked:bg-primary/5 peer-checked:border-primary peer-checked:text-primary transition-all flex items-center justify-center h-full">
                                {goal}
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Offer */}
                      <div className="flex flex-col gap-2">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Special Offer <span className="text-on-surface-variant/50 font-normal lowercase">(optional)</span></label>
                        <input 
                          type="text" 
                          className="h-[48px] rounded-[14px] border border-outline-variant px-4 bg-surface focus:ring-2 focus:ring-primary-container focus:border-primary outline-none transition-all font-body-md" 
                          placeholder="e.g., 20% off all pastries this Friday"
                          value={bundleOffer}
                          onChange={(e) => setBundleOffer(e.target.value)}
                        />
                      </div>

                      {/* Topic */}
                      <div className="flex flex-col gap-2">
                        <label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Specific Topic <span className="text-on-surface-variant/50 font-normal lowercase">(optional)</span></label>
                        <textarea 
                          className="rounded-[14px] border border-outline-variant p-4 bg-surface focus:ring-2 focus:ring-primary-container focus:border-primary outline-none transition-all font-body-md resize-none" 
                          placeholder="What should we talk about today?" 
                          rows={3}
                          value={bundleTopic}
                          onChange={(e) => setBundleTopic(e.target.value)}
                        />
                      </div>

                      {/* Generate Button */}
                      <button 
                        type="button" 
                        onClick={generateContent}
                        disabled={loading}
                        className="mt-2 bg-[#2563EB] text-white h-[48px] rounded-[20px] font-bold text-body-md hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                          {loading ? 'progress_activity' : 'magic_button'}
                        </span>
                        {loading ? 'Generating...' : 'Generate Marketing Bundle'}
                      </button>
                    </form>
                  </div>

                  {/* Quick Tips Card */}
                  <div className="bg-surface-container border border-outline-variant/50 rounded-2xl p-6 flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container shrink-0">
                      <span className="material-symbols-outlined">lightbulb</span>
                    </div>
                    <div>
                      <h4 className="font-body-md font-bold text-on-surface">Pro Tip</h4>
                      <p className="font-body-sm text-on-surface-variant mt-1">Include a deadline or specific date in your offer to create urgency and increase conversion rates by up to 30%.</p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Results Placeholder */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {contentPlan ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-[24px] p-6">
                          <h4 className="font-h4 text-primary font-bold mb-6 flex items-center gap-2"><span className="material-symbols-outlined">grid_view</span> Feed Posts</h4>
                          <div className="space-y-4">
                            {contentPlan.feedPosts?.map((post: any, i: number) => (
                              <div key={i} className="p-5 bg-surface rounded-[16px] border border-outline-variant hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedContent({ type: 'Feed Post', title: post.idea, content: post.caption, tags: post.hashtags })}>
                                <p className="font-body-sm text-on-surface-variant mb-3">{post.idea}</p>
                                <p className="font-body-md text-on-surface mb-4 leading-relaxed line-clamp-3">{post.caption}</p>
                                <div className="flex flex-wrap gap-2">
                                  {post.hashtags?.map((tag: string, j: number) => (
                                    <span key={j} className="px-3 py-1 bg-primary/10 text-primary rounded-full font-label-caps text-xs font-bold lowercase">{tag}</span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-[24px] p-6">
                          <h4 className="font-h4 text-primary font-bold mb-6 flex items-center gap-2"><span className="material-symbols-outlined">movie</span> Reel Scripts</h4>
                          <div className="space-y-4">
                            {contentPlan.reelScripts?.map((reel: any, i: number) => (
                              <div key={i} className="p-5 bg-surface rounded-[16px] border border-outline-variant hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedContent({ type: 'Reel Script', title: reel.hook, content: reel.script, footer: reel.cta })}>
                                <p className="font-body-md text-secondary font-bold mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">play_arrow</span> Hook: {reel.hook}</p>
                                <p className="font-body-sm mb-4 text-on-surface-variant leading-relaxed line-clamp-3">{reel.script}</p>
                                <div className="pt-3 border-t border-outline-variant mt-2">
                                  <p className="font-label-caps text-on-surface font-bold">CTA: {reel.cta}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-[24px] p-6">
                        <h4 className="font-h4 text-primary font-bold mb-4 flex items-center gap-2"><span className="material-symbols-outlined">history</span> Story Content</h4>
                        <div className="space-y-3">
                          {contentPlan.storyIdeas?.map((story: any, i: number) => (
                            <div key={i} className="p-4 bg-surface rounded-xl border border-outline-variant cursor-pointer hover:shadow-md transition-all" onClick={() => setSelectedContent({ type: 'Story Content', title: 'Story Idea', content: story.idea })}>
                              <p className="font-body-sm text-on-surface-variant">{story.idea}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 min-h-[500px] border-2 border-dashed border-outline-variant rounded-3xl flex flex-col items-center justify-center text-center p-6 bg-surface-container-low/30">
                      <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-full bg-surface flex items-center justify-center shadow-sm">
                          <span className="material-symbols-outlined text-[48px] text-primary/40 animate-pulse">auto_awesome</span>
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
                          <span className="material-symbols-outlined text-sm">prompt_suggestion</span>
                        </div>
                      </div>
                      <h3 className="font-h4 text-h4 font-bold text-on-surface">Ready to Create?</h3>
                      <p className="font-body-lg text-on-surface-variant max-w-md mt-2 mb-8">
                        Describe your offer to generate your first post. Our AI will craft captions, hashtags, and visual suggestions.
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-xl opacity-40 grayscale">
                        <div className="aspect-square bg-surface-container-highest rounded-xl border border-outline-variant"></div>
                        <div className="aspect-square bg-surface-container-highest rounded-xl border border-outline-variant"></div>
                        <div className="aspect-square bg-surface-container-highest rounded-xl border border-outline-variant"></div>
                        <div className="hidden md:block aspect-square bg-surface-container-highest rounded-xl border border-outline-variant"></div>
                        <div className="hidden md:block aspect-square bg-surface-container-highest rounded-xl border border-outline-variant"></div>
                        <div className="hidden md:block aspect-square bg-surface-container-highest rounded-xl border border-outline-variant"></div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {activeTab === "calendar" && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-h4 text-h4 font-bold text-on-surface">30-Day Calendar</h3>
                <button 
                  onClick={generateCalendar} 
                  disabled={loading}
                  className="h-10 px-6 bg-primary text-white rounded-full font-bold hover:bg-primary-container transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">event</span>
                  {loading ? "Planning..." : "Generate 30-Day Plan"}
                </button>
              </div>

              {calendar ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {calendar.map((day: any, i: number) => {
                    const pillColor = day.type === "Educational" ? "bg-[#e0f2fe] text-[#0369a1]" : 
                                      day.type === "Promotional" ? "bg-[#dcfce7] text-[#166534]" : 
                                      day.type === "Engagement" ? "bg-[#ffedd5] text-[#c2410c]" : 
                                      day.type === "Testimonial" ? "bg-[#fee2e2] text-[#b91c1c]" : 
                                      "bg-[#f3e8ff] text-[#6b21a8]";
                    return (
                      <div key={i} className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-[16px] p-4 flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedContent({ type: 'Calendar', title: `Day ${day.day} - ${day.type}`, content: day.topic, footer: day.format })}>
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-label-caps text-on-surface font-bold uppercase tracking-wider">Day {day.day}</span>
                          <span className={`font-label-caps px-2 py-1 rounded-full uppercase ${pillColor}`}>{day.type}</span>
                        </div>
                        <p className="font-body-sm text-on-surface-variant flex-grow mb-4">{day.topic}</p>
                        <div className="pt-2 border-t border-outline-variant">
                          <span className="font-label-caps text-primary flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">sell</span> {day.format}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-surface-container-lowest border border-outline-variant border-dashed shadow-sm rounded-[24px] p-16 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                    <span className="material-symbols-outlined text-4xl">calendar_month</span>
                  </div>
                  <h3 className="font-h3 text-h3 font-bold mb-2">Plan your month</h3>
                  <p className="font-body-md text-on-surface-variant max-w-md mx-auto">Generate your personalized 30-day posting schedule engineered for maximum engagement.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "image" && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-h4 text-h4 font-bold text-on-surface">AI Image Generator</h3>
                <button 
                  onClick={generateImage} 
                  disabled={loading || !imagePrompt}
                  className="h-10 px-6 bg-primary text-white rounded-full font-bold hover:bg-primary-container transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">brush</span>
                  {loading ? "Generating..." : "Generate Image"}
                </button>
              </div>

              <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-[24px] p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div>
                    <h4 className="font-h4 text-on-surface font-bold mb-2">Describe the graphic</h4>
                    <p className="font-body-sm text-on-surface-variant mb-4">What kind of promotional image do you want to create?</p>
                    <textarea 
                      className="w-full p-4 rounded-[16px] border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-body-md h-32 mb-6 resize-none bg-surface"
                      placeholder="e.g. A sleek membership offer poster with bold typography, showing a modern cafe interior..."
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                    />
                    
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => setImagePrompt("A high energy Gym promotional poster for a summer membership offer with bold typography")} className="px-4 py-2 bg-surface-container hover:bg-surface-dim text-on-surface font-bold text-sm rounded-full transition-colors border border-outline-variant">Gym Promotion</button>
                      <button onClick={() => setImagePrompt("A luxurious Salon offer graphic with elegant script text and glowing aesthetic")} className="px-4 py-2 bg-surface-container hover:bg-surface-dim text-on-surface font-bold text-sm rounded-full transition-colors border border-outline-variant">Salon Offer</button>
                      <button onClick={() => setImagePrompt("A cozy Café special deal image with a warm coffee cup, croissants, and aesthetic lighting")} className="px-4 py-2 bg-surface-container hover:bg-surface-dim text-on-surface font-bold text-sm rounded-full transition-colors border border-outline-variant">Café Special</button>
                      <button onClick={() => setImagePrompt("A sleek VIP Membership offer poster with an exclusive dark theme and gold accents")} className="px-4 py-2 bg-surface-container hover:bg-surface-dim text-on-surface font-bold text-sm rounded-full transition-colors border border-outline-variant">Membership Offer</button>
                    </div>
                  </div>

                  <div className="bg-surface border border-outline-variant rounded-[16px] flex items-center justify-center min-h-[350px] overflow-hidden p-2 relative">
                    {generatedImage ? (
                      <img src={generatedImage} alt="Generated promo" className="w-full h-full object-cover rounded-[12px] shadow-sm" />
                    ) : (
                      <div className="text-center p-8 opacity-60 flex flex-col items-center">
                        <div className="w-16 h-16 bg-surface-container-highest rounded-full flex items-center justify-center mb-4">
                          <span className="material-symbols-outlined text-3xl">image</span>
                        </div>
                        <p className="font-body-sm text-on-surface-variant font-bold">Generated image will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "leadgen" && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-h4 text-h4 font-bold text-on-surface">Lead Generation Ideas</h3>
                <button 
                  onClick={generateLeadGen} 
                  disabled={loading}
                  className="h-10 px-6 bg-primary text-white rounded-full font-bold hover:bg-primary-container transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">lightbulb</span>
                  {loading ? "Brainstorming..." : "Generate Campaigns"}
                </button>
              </div>

              {leadGen ? (
                <div className="space-y-4">
                  <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-[24px] p-6 flex gap-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedContent({ type: 'Giveaway Campaign', title: leadGen.giveaway?.title, content: leadGen.giveaway?.mechanics })}>
                    <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-[16px] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-3xl">redeem</span>
                    </div>
                    <div>
                      <h4 className="font-h4 text-on-surface font-bold mb-1">{leadGen.giveaway?.title}</h4>
                      <p className="font-body-md text-on-surface-variant line-clamp-2">{leadGen.giveaway?.mechanics}</p>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-[24px] p-6 flex gap-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedContent({ type: 'Referral Program', title: leadGen.referral?.title, content: leadGen.referral?.reward })}>
                    <div className="w-14 h-14 bg-[#dbeafe] text-[#1d4ed8] rounded-[16px] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-3xl">group_add</span>
                    </div>
                    <div>
                      <h4 className="font-h4 text-on-surface font-bold mb-1">{leadGen.referral?.title}</h4>
                      <p className="font-body-md text-on-surface-variant line-clamp-2">{leadGen.referral?.reward}</p>
                    </div>
                  </div>

                  <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-[24px] p-6 flex gap-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedContent({ type: 'Local Event', title: leadGen.localEvent?.title, content: leadGen.localEvent?.idea })}>
                    <div className="w-14 h-14 bg-[#fae8ff] text-[#a21caf] rounded-[16px] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-3xl">local_activity</span>
                    </div>
                    <div>
                      <h4 className="font-h4 text-on-surface font-bold mb-1">{leadGen.localEvent?.title}</h4>
                      <p className="font-body-md text-on-surface-variant line-clamp-2">{leadGen.localEvent?.idea}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-container-lowest border border-outline-variant border-dashed shadow-sm rounded-[24px] p-16 text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                    <span className="material-symbols-outlined text-4xl">campaign</span>
                  </div>
                  <h3 className="font-h3 text-h3 font-bold mb-2">Growth Strategies</h3>
                  <p className="font-body-md text-on-surface-variant max-w-md mx-auto">Generate hyper-local promotion ideas, giveaways, and referral campaigns tailored to your niche.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "billing" && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h3 className="font-h4 text-h4 font-bold text-on-surface">Pricing</h3>
                <p className="font-body-md text-on-surface-variant">Upgrade to unlock full AI automation capabilities.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Starter Plan */}
                <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-[24px] p-8 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                  <div>
                    <h2 className="font-h2 text-h2 text-on-surface">Starter</h2>
                    <div className="mt-4 mb-6">
                      <span className="text-4xl font-bold font-h2">₹299</span>
                      <span className="text-on-surface-variant font-body-md">/month</span>
                    </div>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <span className="text-on-surface-variant">Generate up to 10 Posts/month</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <span className="text-on-surface-variant">Basic Image Templates</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <span className="text-on-surface-variant">Content Calendar (7 Days)</span>
                      </div>
                    </div>
                  </div>
                  <button className="h-12 w-full bg-primary/10 text-primary font-bold rounded-[20px] hover:bg-primary/20 transition-all">Select Starter</button>
                </div>

                {/* Pro Plan */}
                <div className="bg-surface-container-lowest border-2 border-primary shadow-[0_4px_20px_rgba(37,99,235,0.15)] rounded-[24px] p-8 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-6 right-6 bg-primary/10 text-primary px-3 py-1 rounded-full font-label-caps font-bold">MOST POPULAR</div>
                  <div>
                    <h2 className="font-h2 text-h2 text-on-surface">Business Pro</h2>
                    <div className="mt-4 mb-6">
                      <span className="text-4xl font-bold font-h2 text-primary">₹699</span>
                      <span className="text-on-surface-variant font-body-md">/month</span>
                    </div>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <span className="text-on-surface-variant font-bold">Unlimited AI Post Generation</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <span className="text-on-surface-variant">Premium Auto-Stitch Video Engine</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <span className="text-on-surface-variant">Full 30-Day Automated Calendar</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <span className="text-on-surface-variant">High-Quality Image Generator</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        <span className="text-on-surface-variant">Hyper-local Lead Gen Campaigns</span>
                      </div>
                    </div>
                  </div>
                  <button className="h-12 w-full bg-primary text-white font-bold rounded-[20px] hover:bg-[rgba(0,74,198,1)] shadow-md hover:shadow-lg transition-all">Upgrade to Pro</button>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      {/* Global Details Modal */}
      {selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4" onClick={() => setSelectedContent(null)}>
          <div className="bg-surface-container-lowest rounded-[32px] w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedContent(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-container-highest hover:bg-outline-variant flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">close</span>
            </button>
            <div className="p-10 flex-grow overflow-y-auto">
              <span className="font-label-caps text-primary mb-3 block tracking-widest uppercase">{selectedContent.type}</span>
              <h2 className="font-h2 text-h2 font-bold text-on-surface mb-6">{selectedContent.title}</h2>
              <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/50">
                <p className="font-body-lg text-on-surface-variant whitespace-pre-wrap">{selectedContent.content}</p>
              </div>
              
              {selectedContent.tags && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {selectedContent.tags.map((tag: string, i: number) => (
                    <span key={i} className="px-4 py-2 bg-primary/10 text-primary rounded-full font-label-caps text-xs font-bold lowercase">{tag}</span>
                  ))}
                </div>
              )}

              {selectedContent.footer && (
                <div className="mt-6 p-4 bg-secondary/10 text-secondary rounded-2xl border border-secondary/20">
                  <p className="font-body-md font-bold text-center">{selectedContent.footer}</p>
                </div>
              )}
            </div>
            <div className="p-6 bg-surface-container-lowest border-t border-outline-variant flex justify-end gap-4 shrink-0">
              <button className="h-12 px-6 border-2 border-outline-variant text-on-surface rounded-full font-bold hover:bg-surface-container transition-colors" onClick={() => setSelectedContent(null)}>Close</button>
              <button 
                className="h-12 px-8 bg-primary text-white rounded-full font-bold hover:bg-primary-container transition-all shadow-sm flex items-center gap-2"
                onClick={() => {
                  navigator.clipboard.writeText(`${selectedContent.title}\n\n${selectedContent.content}${selectedContent.footer ? '\n\n' + selectedContent.footer : ''}`);
                  alert("Copied to clipboard!");
                }}
              >
                <span className="material-symbols-outlined">content_copy</span> Copy
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
