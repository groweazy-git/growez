require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());

const onboardingRoute = require("./routes/onboarding");
app.use("/onboarding", onboardingRoute);

app.get("/", (req, res) => {
  res.send("Growzee engine running ✅");
});

app.listen(process.env.PORT, () => {
  console.log(`Growzee running on port ${process.env.PORT}`);
});
