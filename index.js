require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const onboardingRoute = require("./routes/onboarding");
app.use("/onboarding", onboardingRoute);

const videoRoute = require("./routes/video");
app.use("/video", videoRoute);

const contentRoute = require("./routes/content");
app.use("/content", contentRoute);

app.get("/", (req, res) => {
  res.send("Growzee engine running ✅");
});

app.listen(process.env.PORT, () => {
  console.log(`Growzee running on port ${process.env.PORT}`);
});
