// server/server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

// A simple in-memory store for transcription results
const transcriptionStore = {};

const ASSEMBLYAI_API_KEY = "9d272100f1404538b551d6e0a43c075e"; // Replace with your actual key

app.post("/transcribe", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No audio file uploaded.");
  }

  const filePath = req.file.path;

  try {
    // 1. Upload the audio file to AssemblyAI
    const uploadResponse = await axios.post(
      "https://api.assemblyai.com/v2/upload",
      fs.createReadStream(filePath),
      {
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
          "content-type": "application/octet-stream",
        },
      }
    );

    const uploadUrl = uploadResponse.data.upload_url;

    // 2. Request transcription
    const transcribeResponse = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      {
        audio_url: uploadUrl,
      },
      {
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    const transcriptId = transcribeResponse.data.id;
    transcriptionStore[transcriptId] = { status: "submitted" };

    res.status(202).json({ transcriptId });
  } catch (error) {
    console.error("Error with AssemblyAI:", error.response ? error.response.data : error.message);
    res.status(500).send("Error with transcription service.");
  } finally {
    // Clean up the uploaded file
    fs.unlinkSync(filePath);
  }
});

app.get("/transcription/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const pollResponse = await axios.get(
      `https://api.assemblyai.com/v2/transcript/${id}`,
      {
        headers: {
          authorization: ASSEMBLYAI_API_KEY,
        },
      }
    );

    const { status, text } = pollResponse.data;
    transcriptionStore[id] = { status, text };

    res.json({ status, text });
  } catch (error) {
    console.error("Error polling for transcription:", error.response ? error.response.data : error.message);
    res.status(500).send("Error retrieving transcription.");
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
