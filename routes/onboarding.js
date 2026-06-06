const express = require("express");
const router = express.Router();
const { addBusiness } = require("../services/supabase");

router.post("/add", async (req, res) => {
  try {
    const { name, city, offer, tone, owner_or_manager_name, whatsapp_number, niche } = req.body;

    const business = await addBusiness({
      name,
      city,
      offer,
      tone,
      owner_or_manager_name,
      whatsapp_number,
      niche,
      active: true,
    });

    res.json({
      success: true,
      message: `${name} added successfully`,
      business,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
