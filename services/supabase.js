const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

// Get all active businesses
const getActiveBusinesses = async () => {
  const { data, error } = await supabase
    .from("businesses")
    .select("*")
    .eq("active", true);
  if (error) throw error;
  return data;
};

// Add new business
const addBusiness = async (business) => {
  const { data, error } = await supabase
    .from("businesses")
    .insert([business])
    .select();
  if (error) throw error;
  return data[0];
};

// Log generated content
const logContent = async (business_id, post_text, image_url = null) => {
  const { error } = await supabase
    .from("content_log")
    .insert([{ business_id, post_text, image_url }]);
  if (error) throw error;
};

// Save feedback
const saveFeedback = async (business_id, feedback) => {
  const { error } = await supabase
    .from("content_log")
    .update({ feedback })
    .eq("business_id", business_id)
    .eq("date", new Date().toISOString().split("T")[0]);
  if (error) throw error;
};

module.exports = {
  getActiveBusinesses,
  addBusiness,
  logContent,
  saveFeedback,
};
