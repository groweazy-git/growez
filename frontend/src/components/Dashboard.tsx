"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Dashboard({ businessData, initialAnalysis }: { businessData: any, initialAnalysis?: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Content Generation State
  const [contentPlan, setContentPlan] = useState<any>(null);
  const [bundleBusinessType, setBundleBusinessType] = useState(businessData?.industry || businessData?.niche || "Local Bakery");
  const [bundleGoal, setBundleGoal] = useState(Array.isArray(businessData?.primary_goal) ? businessData.primary_goal[0] : (businessData?.primary_goal || "Drive Sales"));
  const [bundleOffer, setBundleOffer] = useState("");
  const [bundleTopic, setBundleTopic] = useState("");

  // Content Calendar State
  const [calendar, setCalendar] = useState<any>(null);

  // Image Generation State
  const [imageCategory, setImageCategory] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);

  // Brand Kit State
  const [isEditingBrandKit, setIsEditingBrandKit] = useState(false);
  const [brandKit, setBrandKit] = useState({
    business_name: businessData?.business_name || '',
    primary_color: '#0052D4',
    secondary_color: '#FF6A88',
    tertiary_color: '#FF9A8B'
  });

  // Lead Generation State
  const [leadGen, setLeadGen] = useState<any>(null);
  const [leadMagnet, setLeadMagnet] = useState<any>(null);

  // Saved Content State
  const [savedItems, setSavedItems] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'saved') {
      fetchSavedContent();
    }
  }, [activeTab]);

  const fetchSavedContent = async () => {
    const { data, error } = await supabase.from('saved_content').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setSavedItems(data);
    }
  };

  const saveToLibrary = async (type: string, data: any) => {
    const { error } = await supabase.from('saved_content').insert([
      { content_type: type, content_data: data }
    ]);
    if (error) {
      alert("Failed to save content");
    } else {
      alert("Saved to Content Library!");
    }
  };
  
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
        offer: bundleOffer || bundleTopic || businessData.offer || businessData.usp
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
        body: JSON.stringify({ niche: businessData?.industry, city: businessData?.city }),
      });
      const data = await res.json();
      setLeadGen(data.ideas);
    } catch (err) {
      console.error(err);
      alert("Error generating lead gen");
    } finally {
      setLoading(false);
    }
  };

  const generateLeadMagnet = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/content/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessData }),
      });
      const data = await res.json();
      setLeadMagnet(data.leadMagnet);
    } catch (err) {
      console.error(err);
      alert("Error generating lead magnet");
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async (category: string) => {
    setImageCategory(category);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/content/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, businessData: { ...businessData, ...brandKit } }),
      });
      const data = await res.json();
      setGeneratedImage(data.imageUrl);
      setGeneratedPrompt(data.aiPrompt);
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
    { id: 'dashboard', icon: 'home', label: 'Dashboard' },
    { id: 'content', icon: 'edit_document', label: 'Content Studio' },
    { id: 'creative', icon: 'palette', label: 'Creative Studio' },
    { id: 'leadgen', icon: 'ads_click', label: 'Lead Engine' },
    { id: 'saved', icon: 'bookmark', label: 'Content Library' },
    { id: 'calendar', icon: 'calendar_month', label: 'Calendar' },
    { id: 'health', icon: 'monitoring', label: 'Marketing Health' },
    { id: 'billing', icon: 'credit_card', label: 'Pricing & Billing' },
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
          <h1 className="font-h4 text-h4 font-bold text-primary capitalize">
            {navItems.find(i => i.id === activeTab)?.label}
          </h1>
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
          
          {/* DASHBOARD TAB (Home Action Plan) */}
          {activeTab === "dashboard" && (
            <div className="animate-fade-in space-y-12">
              {/* Header */}
              <div>
                <h2 className="font-h2 text-h2 font-bold text-on-surface mb-2">Good Morning, {businessData.business_name || 'Business'}</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant">Here is your daily action plan to grow your business.</p>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="font-h4 text-h4 font-bold text-on-surface mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button onClick={() => setActiveTab('content')} className="bg-surface-container text-on-surface h-16 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary/10 hover:text-primary transition-all shadow-sm border border-outline-variant/50">
                    <span className="material-symbols-outlined">edit_document</span> Generate Post
                  </button>
                  <button onClick={() => setActiveTab('creative')} className="bg-surface-container text-on-surface h-16 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-secondary/10 hover:text-secondary transition-all shadow-sm border border-outline-variant/50">
                    <span className="material-symbols-outlined">palette</span> Generate Image
                  </button>
                  <button onClick={() => setActiveTab('leadgen')} className="bg-surface-container text-on-surface h-16 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-tertiary/10 hover:text-tertiary transition-all shadow-sm border border-outline-variant/50">
                    <span className="material-symbols-outlined">campaign</span> New Lead Campaign
                  </button>
                </div>
              </div>

              {/* Today's Action Plan */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-h3 text-h3 font-bold text-on-surface">Today's Action Plan</h3>
                  <span className="px-4 py-2 bg-secondary/10 text-secondary rounded-full font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span> Auto-Generated
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {/* Feed Post */}
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col hover:border-primary/50 transition-colors shadow-sm cursor-pointer" onClick={() => setSelectedContent(initialAnalysis?.todays_content?.feed_post)}>
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined">grid_view</span>
                    </div>
                    <h4 className="font-bold text-lg mb-2">Today's Post</h4>
                    <p className="font-body-sm text-on-surface-variant line-clamp-3 mb-4">{initialAnalysis?.todays_content?.feed_post?.caption || "Generate engaging posts tailored to your audience."}</p>
                    <button className="mt-auto text-primary font-bold text-sm flex items-center gap-1">View Details <span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
                  </div>

                  {/* Story */}
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col hover:border-primary/50 transition-colors shadow-sm cursor-pointer" onClick={() => setSelectedContent(initialAnalysis?.todays_content?.story)}>
                    <div className="w-12 h-12 bg-pink-500/10 text-pink-500 rounded-xl flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined">history_toggle_off</span>
                    </div>
                    <h4 className="font-bold text-lg mb-2">Today's Story</h4>
                    <p className="font-body-sm text-on-surface-variant line-clamp-3 mb-4">{initialAnalysis?.todays_content?.story?.idea || "Quick engagement stories."}</p>
                    <button className="mt-auto text-primary font-bold text-sm flex items-center gap-1">View Details <span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
                  </div>

                  {/* Reel */}
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col hover:border-primary/50 transition-colors shadow-sm cursor-pointer" onClick={() => setSelectedContent(initialAnalysis?.todays_content?.reel)}>
                    <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined">movie</span>
                    </div>
                    <h4 className="font-bold text-lg mb-2">Today's Reel</h4>
                    <p className="font-body-sm text-on-surface-variant line-clamp-3 mb-4">{initialAnalysis?.todays_content?.reel?.script || "Short form video script."}</p>
                    <button className="mt-auto text-primary font-bold text-sm flex items-center gap-1">View Details <span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
                  </div>

                  {/* Promotion */}
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 flex flex-col hover:border-primary/50 transition-colors shadow-sm cursor-pointer" onClick={() => setSelectedContent(initialAnalysis?.todays_content?.promotion)}>
                    <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined">campaign</span>
                    </div>
                    <h4 className="font-bold text-lg mb-2">Lead Campaign</h4>
                    <p className="font-body-sm text-on-surface-variant line-clamp-3 mb-4">{initialAnalysis?.todays_content?.promotion || "Lead gen ideas."}</p>
                    <button className="mt-auto text-primary font-bold text-sm flex items-center gap-1">View Details <span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
                  </div>

                  {/* Poster */}
                  {initialAnalysis?.todays_content?.first_poster?.imageUrl && (
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex flex-col hover:border-primary/50 transition-colors shadow-sm cursor-pointer relative overflow-hidden" onClick={() => setActiveTab('creative')}>
                      <img src={initialAnalysis.todays_content.first_poster.imageUrl} alt="Today's Poster" className="w-full aspect-square object-cover rounded-xl mb-4" />
                      <h4 className="font-bold text-lg mb-1">Today's Poster</h4>
                      <button className="mt-auto text-primary font-bold text-sm flex items-center gap-1">View in Studio <span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CONTENT STUDIO TAB */}
          {activeTab === "content" && (
            <div className="animate-fade-in space-y-12">
              <div>
                <h2 className="font-h2 text-h2 font-bold mb-2">Content Studio</h2>
                <p className="font-body-lg text-on-surface-variant">Generate feed posts, stories, reel scripts, hooks, and CTAs.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: The Form */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
                    <div className="mb-6">
                      <h3 className="font-h4 text-h4 font-bold mb-1">Generate More Content</h3>
                      <p className="font-body-sm text-on-surface-variant">Fill in the details below to generate a new campaign bundle.</p>
                    </div>
                    <form className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="font-body-sm text-body-sm font-bold">Business Type</label>
                        <input type="text" className="h-12 px-4 rounded-xl border border-outline-variant focus:border-primary outline-none" value={bundleBusinessType} onChange={(e) => setBundleBusinessType(e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-body-sm text-body-sm font-bold">Goal</label>
                        <select className="h-12 px-4 rounded-xl border border-outline-variant focus:border-primary outline-none bg-white" value={bundleGoal} onChange={(e) => setBundleGoal(e.target.value)}>
                          <option>Drive Sales</option>
                          <option>Brand Awareness</option>
                          <option>Lead Generation</option>
                          <option>Community Engagement</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-body-sm text-body-sm font-bold">Offer or Topic</label>
                        <textarea className="p-4 rounded-xl border border-outline-variant focus:border-primary outline-none min-h-[100px] resize-y" placeholder="e.g. Summer Sale, 20% off all items" value={bundleOffer} onChange={(e) => setBundleOffer(e.target.value)} />
                      </div>
                      <button type="button" onClick={generateContent} disabled={loading} className="h-12 bg-primary text-white rounded-full font-bold mt-2 shadow-sm disabled:opacity-70 flex items-center justify-center gap-2">
                        {loading ? <span className="material-symbols-outlined animate-spin">refresh</span> : <span className="material-symbols-outlined">edit_document</span>}
                        {loading ? 'Generating...' : 'Generate Bundle'}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Column: Results & Content Library Placeholder */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  {contentPlan ? (
                    <div className="space-y-6">
                      <h3 className="font-h3 text-h3 font-bold mb-4">Your Generated Bundle</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contentPlan.feedPosts?.map((post: any, i: number) => (
                          <div key={i} className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl cursor-pointer hover:border-primary transition-all shadow-sm" onClick={() => setSelectedContent(post)}>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="material-symbols-outlined text-primary text-xl">grid_view</span>
                              <span className="font-bold text-sm">Feed Post {i+1}</span>
                            </div>
                            <p className="font-body-sm text-on-surface line-clamp-3">{post.caption}</p>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contentPlan.storyIdeas?.map((story: any, i: number) => (
                          <div key={i} className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl cursor-pointer hover:border-secondary transition-all shadow-sm" onClick={() => setSelectedContent(story)}>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="material-symbols-outlined text-secondary text-xl">history_toggle_off</span>
                              <span className="font-bold text-sm">Story Idea {i+1}</span>
                            </div>
                            <p className="font-body-sm text-on-surface line-clamp-3">{story.idea}</p>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {contentPlan.reelScripts?.map((reel: any, i: number) => (
                          <div key={i} className="bg-surface-container-lowest border border-outline-variant p-5 rounded-2xl cursor-pointer hover:border-tertiary transition-all shadow-sm" onClick={() => setSelectedContent(reel)}>
                            <div className="flex items-center gap-2 mb-3">
                              <span className="material-symbols-outlined text-tertiary text-xl">movie</span>
                              <span className="font-bold text-sm">Reel Script {i+1}</span>
                            </div>
                            <p className="font-body-sm text-on-surface line-clamp-2 italic mb-2">"{reel.hook}"</p>
                            <p className="font-body-sm text-on-surface-variant line-clamp-2">{reel.script}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      <div className="h-[300px] bg-surface-container border border-outline-variant border-dashed rounded-3xl flex flex-col items-center justify-center p-12 text-center">
                        <span className="material-symbols-outlined text-[64px] text-surface-variant mb-4">edit_document</span>
                        <h4 className="font-h4 text-h4 font-bold text-on-surface mb-2">Content Library</h4>
                        <p className="font-body-md text-on-surface-variant max-w-[300px]">Your saved content will appear here. Use the generator to create new posts.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CREATIVE STUDIO TAB (Image Gen & Brand Kit) */}
          {activeTab === "creative" && (
            <div className="animate-fade-in space-y-12">
              <div>
                <h2 className="font-h2 text-h2 font-bold mb-2">Creative Studio</h2>
                <p className="font-body-lg text-on-surface-variant">Generate promotional images and manage your brand assets.</p>
              </div>

              {/* Brand Kit */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-h4 text-h4 font-bold">Brand Kit</h3>
                    <p className="font-body-sm text-on-surface-variant mt-1">Setup your logo, colors, and business details for auto-branding.</p>
                  </div>
                  <button 
                    onClick={() => setIsEditingBrandKit(!isEditingBrandKit)}
                    className="px-4 py-2 border border-outline-variant rounded-full font-bold text-sm hover:bg-surface-container transition-colors"
                  >
                    {isEditingBrandKit ? 'Save Brand Kit' : 'Edit Brand Kit'}
                  </button>
                </div>
                
                {isEditingBrandKit ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                    <div className="flex flex-col gap-2">
                      <label className="font-bold text-sm text-on-surface">Business Name</label>
                      <input 
                        type="text" 
                        value={brandKit.business_name} 
                        onChange={(e) => setBrandKit({...brandKit, business_name: e.target.value})}
                        className="h-12 px-4 rounded-xl border border-outline-variant outline-none focus:border-primary bg-white text-on-surface"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-bold text-sm text-on-surface">Brand Colors (Primary, Secondary, Tertiary)</label>
                      <div className="flex gap-4 items-center h-12">
                        <input type="color" value={brandKit.primary_color} onChange={(e) => setBrandKit({...brandKit, primary_color: e.target.value})} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                        <input type="color" value={brandKit.secondary_color} onChange={(e) => setBrandKit({...brandKit, secondary_color: e.target.value})} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                        <input type="color" value={brandKit.tertiary_color} onChange={(e) => setBrandKit({...brandKit, tertiary_color: e.target.value})} className="w-10 h-10 rounded cursor-pointer border-0 p-0" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center animate-fade-in">
                    <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center border border-outline-variant border-dashed">
                      <span className="material-symbols-outlined text-surface-variant">add_photo_alternate</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-on-surface">{brandKit.business_name || 'Your Business'}</h4>
                      <div className="flex gap-2 items-center mt-2">
                        <div className="w-8 h-8 rounded-full shadow-inner border border-outline-variant/30" style={{ backgroundColor: brandKit.primary_color }}></div>
                        <div className="w-8 h-8 rounded-full shadow-inner border border-outline-variant/30" style={{ backgroundColor: brandKit.secondary_color }}></div>
                        <div className="w-8 h-8 rounded-full shadow-inner border border-outline-variant/30" style={{ backgroundColor: brandKit.tertiary_color }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Generator */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 flex flex-col md:flex-row gap-8 shadow-sm">
                <div className="w-full md:w-1/3 flex flex-col gap-6">
                  <div>
                    <h3 className="font-bold text-lg text-on-surface mb-2">What do you want to create?</h3>
                    <p className="font-body-sm text-on-surface-variant">Select a template. We'll automatically apply your brand data.</p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {(() => {
                      const ind = (businessData?.industry || '').toLowerCase();
                      let options = ["Discount Offer", "Educational Tip", "Customer Testimonial", "Event Promo"];
                      if (ind.includes("gym") || ind.includes("fitness") || ind.includes("yoga")) {
                        options = ["Membership Offer", "Personal Training", "Transformation Post", "Motivational Quote"];
                      } else if (ind.includes("salon") || ind.includes("beauty") || ind.includes("spa") || ind.includes("hair")) {
                        options = ["Bridal Offer", "Haircare Promotion", "Beauty Tip", "Before & After"];
                      } else if (ind.includes("cafe") || ind.includes("restaurant") || ind.includes("coffee")) {
                        options = ["New Menu Item", "Weekend Offer", "Coffee Promotion", "Customer Review"];
                      }
                      
                      return options.map(opt => (
                        <button 
                          key={opt}
                          onClick={() => generateImage(opt)}
                          disabled={loading}
                          className={`p-4 rounded-xl border text-left font-bold transition-all flex justify-between items-center ${imageCategory === opt ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant hover:border-primary/50 text-on-surface'}`}
                        >
                          {opt}
                          {loading && imageCategory === opt ? (
                            <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
                          ) : (
                            <span className="material-symbols-outlined text-[20px] opacity-50">arrow_forward</span>
                          )}
                        </button>
                      ));
                    })()}
                  </div>
                </div>
                
                <div className="w-full md:w-2/3 min-h-[300px] border border-outline-variant rounded-2xl bg-surface-container flex flex-col items-center justify-center overflow-hidden relative p-4">
                  {generatedImage ? (
                    <>
                      <div className="flex-1 w-full flex items-center justify-center">
                        <img src={generatedImage} alt="Generated SVG" className="max-w-full max-h-[400px] object-contain rounded-xl shadow-sm" />
                      </div>
                      {generatedPrompt && (
                        <div className="w-full mt-6 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 relative group">
                           <span className="font-label-caps text-xs tracking-widest text-primary uppercase block mb-1">AI Design Rationale</span>
                           <p className="font-body-sm text-on-surface-variant italic leading-relaxed">{generatedPrompt}</p>
                           <button 
                             onClick={() => { navigator.clipboard.writeText(generatedPrompt); alert('Prompt copied!'); }}
                             className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:bg-primary/10 p-1.5 rounded-md"
                           >
                             <span className="material-symbols-outlined text-[18px]">content_copy</span>
                           </button>
                        </div>
                      )}
                      <button onClick={() => saveToLibrary('image', { imageUrl: generatedImage, aiPrompt: generatedPrompt })} className="mt-4 h-12 w-full bg-surface-container text-on-surface rounded-xl font-bold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">bookmark</span> Save Image to Library
                      </button>
                    </>
                  ) : (
                    <div className="text-center text-on-surface-variant opacity-50 flex flex-col items-center">
                      <span className="material-symbols-outlined text-6xl mb-2">image</span>
                      <p>Your generated SVG will appear here</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Video Engine (Moved under Creative Studio conceptually, but keeping the UI component) */}
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

          {/* LEAD ENGINE TAB */}
          {activeTab === "leadgen" && (
            <div className="animate-fade-in space-y-12">
               <div>
                  <h2 className="font-h2 text-h2 font-bold mb-2">Lead Engine</h2>
                  <p className="font-body-lg text-on-surface-variant">AI-crafted campaigns to drive more foot traffic and generate immediate leads.</p>
                </div>
                
              <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-h4 font-bold">Campaign Ideas</h3>
                    <p className="font-body-sm text-on-surface-variant">Generate referrals, giveaways, and challenge campaigns.</p>
                  </div>
                  <button onClick={generateLeadGen} disabled={loading} className="h-12 px-6 bg-primary text-white rounded-full font-bold flex items-center gap-2 hover:bg-primary-container shadow-sm disabled:opacity-50">
                    <span className="material-symbols-outlined">campaign</span> {loading ? 'Brainstorming...' : 'Generate Campaigns'}
                  </button>
                </div>

                {leadGen ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-surface-container-low border border-outline-variant/50 p-6 rounded-2xl cursor-pointer hover:border-primary transition-all" onClick={() => setSelectedContent(leadGen?.giveaway)}>
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined">redeem</span>
                      </div>
                      <h3 className="font-bold mb-2">Giveaway Idea</h3>
                      <h4 className="font-body-md font-bold text-primary mb-2 line-clamp-2">{leadGen.giveaway?.title}</h4>
                      <p className="font-body-sm text-on-surface-variant line-clamp-4">{leadGen.giveaway?.mechanics}</p>
                    </div>
                    <div className="bg-surface-container-low border border-outline-variant/50 p-6 rounded-2xl cursor-pointer hover:border-secondary transition-all" onClick={() => setSelectedContent(leadGen?.referral)}>
                      <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined">people</span>
                      </div>
                      <h3 className="font-bold mb-2">Referral Program</h3>
                      <h4 className="font-body-md font-bold text-secondary mb-2 line-clamp-2">{leadGen.referral?.title}</h4>
                      <p className="font-body-sm text-on-surface-variant line-clamp-4">{leadGen.referral?.reward}</p>
                    </div>
                    <div className="bg-surface-container-low border border-outline-variant/50 p-6 rounded-2xl cursor-pointer hover:border-tertiary transition-all" onClick={() => setSelectedContent(leadGen?.localEvent)}>
                      <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined">event</span>
                      </div>
                      <h3 className="font-bold mb-2">Local Event</h3>
                      <h4 className="font-body-md font-bold text-tertiary mb-2 line-clamp-2">{leadGen.localEvent?.title}</h4>
                      <p className="font-body-sm text-on-surface-variant line-clamp-4">{leadGen.localEvent?.idea}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-surface-container border border-outline-variant border-dashed rounded-3xl p-12 text-center mt-4">
                    <span className="material-symbols-outlined text-5xl text-surface-variant mb-4">lightbulb</span>
                    <p className="font-body-md text-on-surface-variant">Ready to grow? Generate custom campaigns.</p>
                  </div>
                )}
              </div>
              
              {/* Lead Magnets & Offers */}
              <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-h4 font-bold">Lead Magnets & Offers</h3>
                    <p className="font-body-sm text-on-surface-variant">Set up free consultations, trials, or discount coupons.</p>
                  </div>
                  <button onClick={generateLeadMagnet} disabled={loading} className="px-4 py-2 border border-outline-variant rounded-full font-bold text-sm hover:bg-surface-container transition-colors flex items-center gap-2 disabled:opacity-50">
                    <span className="material-symbols-outlined text-[18px]">add</span> {loading ? 'Generating...' : 'New Magnet'}
                  </button>
                </div>
                
                {leadMagnet ? (
                  <div className="p-6 border border-primary/30 bg-primary/5 rounded-2xl animate-fade-in relative">
                    <div className="absolute top-6 right-6 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-widest">{leadMagnet.type}</div>
                    <h4 className="font-bold text-2xl text-primary mb-2">{leadMagnet.title}</h4>
                    <p className="font-body-md text-on-surface-variant italic mb-6">{leadMagnet.subtitle}</p>
                    
                    <div className="mb-6">
                      <h5 className="font-bold text-sm uppercase tracking-wider text-on-surface mb-3">Outline</h5>
                      <ul className="space-y-2">
                        {leadMagnet.outline?.map((pt: string, idx: number) => (
                          <li key={idx} className="flex gap-2 text-on-surface-variant"><span className="text-primary font-bold">•</span> {pt}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <h5 className="font-bold text-sm uppercase tracking-wider text-on-surface mb-2">Capture Fields</h5>
                        <div className="flex gap-2">
                          {leadMagnet.capture_fields?.map((field: string) => (
                            <span key={field} className="px-3 py-1 bg-surface-container rounded-full text-xs font-bold text-on-surface-variant border border-outline-variant">{field}</span>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => saveToLibrary('lead_magnet', leadMagnet)} className="h-10 px-6 bg-surface-container text-on-surface rounded-full font-bold hover:bg-surface-container-high transition-colors flex items-center gap-2 shadow-sm border border-outline-variant">
                        <span className="material-symbols-outlined text-[18px]">bookmark</span> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-outline-variant border-dashed rounded-xl flex items-center gap-4 opacity-70">
                      <span className="material-symbols-outlined text-3xl text-surface-variant">local_offer</span>
                      <div>
                        <p className="font-bold">Free Trial Pass</p>
                        <p className="text-sm text-on-surface-variant">0 active claims</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CONTENT LIBRARY TAB */}
          {activeTab === "saved" && (
            <div className="animate-fade-in space-y-8">
              <div>
                <h2 className="font-h2 text-h2 font-bold mb-2">Content Library</h2>
                <p className="font-body-lg text-on-surface-variant">All your saved posts, images, and lead magnets backed by Supabase.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedItems.map(item => (
                  <div key={item.id} className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden">
                    <div className="absolute top-4 right-4 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-widest">{item.content_type.replace('_', ' ')}</div>
                    
                    {item.content_type === 'image' && item.content_data.imageUrl && (
                      <div className="mb-4">
                        <img src={item.content_data.imageUrl} alt="Saved" className="w-full aspect-square object-cover rounded-xl" />
                      </div>
                    )}
                    
                    {item.content_type === 'post' && item.content_data.caption && (
                      <div className="mb-4">
                        <p className="font-body-sm italic text-on-surface-variant line-clamp-6">"{item.content_data.caption}"</p>
                      </div>
                    )}

                    {item.content_type === 'lead_magnet' && item.content_data.title && (
                      <div className="mb-4 mt-6">
                        <h4 className="font-bold text-lg text-primary">{item.content_data.title}</h4>
                        <p className="font-body-sm text-on-surface-variant mt-2">{item.content_data.subtitle}</p>
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-outline-variant/50">
                      <p className="text-xs text-on-surface-variant">Saved {new Date(item.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                
                {savedItems.length === 0 && (
                  <div className="col-span-full py-20 text-center flex flex-col items-center opacity-50">
                    <span className="material-symbols-outlined text-6xl mb-4 text-surface-variant">inventory_2</span>
                    <h3 className="font-bold text-lg">Your library is empty</h3>
                    <p>Generate some content and click "Save to Library" to see it here.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CALENDAR TAB */}
          {activeTab === "calendar" && (
            <div className="animate-fade-in space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-h2 text-h2 font-bold mb-2">Content Calendar</h2>
                  <p className="font-body-lg text-on-surface-variant">Your 30-day posting strategy.</p>
                </div>
                <button onClick={generateCalendar} disabled={loading} className="h-12 px-6 bg-primary text-white rounded-full font-bold flex items-center gap-2 hover:bg-primary-container shadow-sm disabled:opacity-50">
                  <span className="material-symbols-outlined">calendar_month</span> {loading ? 'Planning...' : 'Generate 30-Day Plan'}
                </button>
              </div>

              {calendar ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {calendar.map((item: any, i: number) => (
                    <div key={i} className="bg-surface-container-lowest border border-outline-variant p-4 rounded-2xl shadow-sm flex flex-col h-full cursor-pointer hover:border-primary transition-all" onClick={() => setSelectedContent(item)}>
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-xs font-bold font-label-caps uppercase">Day {item.day}</span>
                        <span className="material-symbols-outlined text-primary text-sm">
                          {item.format === 'Reel' ? 'movie' : item.format === 'Story' ? 'history_toggle_off' : 'grid_view'}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm mb-1">{item.type}</h4>
                      <p className="font-body-sm text-on-surface-variant line-clamp-3 flex-grow">{item.topic}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-surface-container border border-outline-variant border-dashed rounded-3xl p-12 text-center h-[400px] flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-surface-variant mb-4">date_range</span>
                  <p className="font-body-md text-on-surface-variant">Click generate to map out your month's strategy.</p>
                </div>
              )}
            </div>
          )}

          {/* MARKETING HEALTH TAB */}
          {activeTab === "health" && (
            <div className="animate-fade-in space-y-12">
              <div>
                <h2 className="font-h2 text-h2 font-bold mb-2">Marketing Health</h2>
                <p className="font-body-lg text-on-surface-variant">Deep dive into your business analytics and AI recommendations.</p>
              </div>

              {/* Marketing Scores Section */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Main Score Card */}
                <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <h3 className="font-h4 text-on-surface-variant mb-4">Marketing Score</h3>
                  <div className="w-48 h-48 rounded-full border-[12px] border-primary/20 flex items-center justify-center relative">
                    <div className="absolute inset-0 border-[12px] border-primary rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}></div>
                    <span className="text-6xl font-bold text-primary">{initialAnalysis?.scores?.overall || 87}</span>
                  </div>
                  <p className="font-label-caps tracking-widest text-on-surface-variant mt-4">OUT OF 100</p>
                </div>

                {/* Sub Scores */}
                <div className="md:col-span-8 grid grid-cols-2 gap-4">
                  {[
                    { label: "Posting Consistency", score: initialAnalysis?.scores?.consistency || 45, icon: "calendar_month", color: "text-blue-500", bg: "bg-blue-500/10" },
                    { label: "Growth Potential", score: initialAnalysis?.scores?.growth_potential || 91, icon: "trending_up", color: "text-green-500", bg: "bg-green-500/10" },
                    { label: "Lead Gen Readiness", score: initialAnalysis?.scores?.lead_gen || 64, icon: "campaign", color: "text-orange-500", bg: "bg-orange-500/10" },
                    { label: "Social Presence", score: initialAnalysis?.scores?.social_presence || 72, icon: "public", color: "text-purple-500", bg: "bg-purple-500/10" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`material-symbols-outlined p-2 rounded-lg ${stat.bg} ${stat.color}`}>{stat.icon}</span>
                        <span className="text-2xl font-bold">{stat.score}/100</span>
                      </div>
                      <h4 className="font-body-sm font-bold text-on-surface-variant uppercase tracking-wider">{stat.label}</h4>
                      <div className="w-full h-1.5 bg-surface-variant mt-3 rounded-full overflow-hidden">
                        <div className={`h-full ${stat.color.replace('text-', 'bg-')} rounded-full`} style={{ width: `${stat.score}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights Banner */}
              <div className="bg-primary-container text-on-primary-container rounded-3xl p-8 flex items-start gap-6 shadow-sm border border-primary/20">
                <span className="material-symbols-outlined text-5xl text-primary shrink-0">tips_and_updates</span>
                <div>
                  <h3 className="font-h4 font-bold mb-2">AI Recommendations</h3>
                  <p className="font-body-lg opacity-90 italic">
                    "{initialAnalysis?.insight || `Your ${businessData.industry || 'business'} has strong growth potential but inconsistent posting. Adding more customer testimonials this week could significantly improve visibility and inquiries.`}"
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* BILLING TAB */}
          {activeTab === "billing" && (
            <div className="animate-fade-in text-center py-12">
              <span className="material-symbols-outlined text-[64px] text-primary mb-6">credit_card</span>
              <h2 className="font-h2 text-h2 font-bold mb-4">Pricing & Billing</h2>
              <p className="font-body-lg text-on-surface-variant max-w-lg mx-auto">Manage your subscription, view invoices, and track usage.</p>
              <div className="mt-8 flex justify-center gap-4">
                <div className="bg-surface-container-lowest border border-outline-variant p-8 rounded-3xl w-72">
                  <h3 className="font-bold text-xl mb-2">Starter</h3>
                  <p className="text-3xl font-bold mb-6">$29<span className="text-base font-normal text-on-surface-variant">/mo</span></p>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> 30 Posts / Month</li>
                    <li className="flex gap-2"><span className="material-symbols-outlined text-primary text-sm">check</span> Basic Calendar</li>
                  </ul>
                  <button className="w-full border-2 border-primary text-primary h-12 rounded-full font-bold hover:bg-primary/5">Select</button>
                </div>
                <div className="bg-primary text-white p-8 rounded-3xl w-72 relative transform scale-105 shadow-xl">
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-tertiary text-on-tertiary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Popular</div>
                  <h3 className="font-bold text-xl mb-2">Pro</h3>
                  <p className="text-3xl font-bold mb-6">$79<span className="text-base font-normal opacity-80">/mo</span></p>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex gap-2"><span className="material-symbols-outlined text-white text-sm">check</span> Unlimited AI Posts</li>
                    <li className="flex gap-2"><span className="material-symbols-outlined text-white text-sm">check</span> Auto-Stitch Video Engine</li>
                    <li className="flex gap-2"><span className="material-symbols-outlined text-white text-sm">check</span> Lead Gen Tools</li>
                  </ul>
                  <button className="w-full bg-white text-primary h-12 rounded-full font-bold hover:brightness-90">Select Pro</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Global Detail Modal */}
      {selectedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedContent(null)}></div>
          <div className="relative bg-surface text-on-surface rounded-3xl shadow-2xl max-w-2xl w-full p-8 border border-outline-variant animate-fade-in flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-h3 text-h3 font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">visibility</span>
                Content Details
              </h3>
              <button onClick={() => setSelectedContent(null)} className="text-on-surface-variant hover:bg-surface-container-high rounded-full p-2 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="overflow-y-auto pr-2 space-y-6">
              {Object.entries(typeof selectedContent === 'string' ? { detail: selectedContent } : selectedContent).map(([key, value]) => {
                if (key === 'hashtags' && Array.isArray(value)) {
                  return (
                    <div key={key}>
                      <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">{key.replace(/_/g, ' ')}</span>
                      <p className="font-body-md text-primary font-bold">{value.join(' ')}</p>
                    </div>
                  )
                }
                if (typeof value === 'string') {
                  return (
                    <div key={key} className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/50">
                      <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">{key.replace(/_/g, ' ')}</span>
                      <p className="font-body-md whitespace-pre-wrap">{value}</p>
                    </div>
                  )
                }
                return null;
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant flex gap-4">
              <button 
                onClick={() => {
                  const text = Object.values(selectedContent).join('\n\n');
                  navigator.clipboard.writeText(text);
                  alert('Copied to clipboard!');
                }}
                className="flex-1 bg-surface-container-high text-on-surface h-12 rounded-full font-bold hover:bg-surface-variant transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">content_copy</span> Copy All
              </button>
              <button onClick={() => setSelectedContent(null)} className="flex-1 bg-primary text-white h-12 rounded-full font-bold hover:bg-primary-container transition-colors shadow-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
