// src/components/VoiceJournal.jsx
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";

const VoiceJournal = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [status, setStatus] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);
  const blobsRef = useRef({});  // Store actual blobs for transcription
  const { currentUser } = useAuth();

  useEffect(() => {
    // Voice recordings are now stored in local state only
    // They will be cleared on page refresh
  }, [currentUser]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" });
      audioChunks.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) audioChunks.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(audioChunks.current, { type: "audio/webm" });
        audioChunks.current = [];

        setStatus("Saving recording...");
        const downloadURL = URL.createObjectURL(blob);
        const timestamp = Date.now();
        const recordingId = `local_${timestamp}`;

        // Store blob for transcription
        blobsRef.current[recordingId] = blob;

        const newRecording = {
          id: recordingId,
          userId: currentUser.uid,
          downloadURL,
          createdAt: new Date().toISOString(),
          transcription: null,
          isTranscribing: false,
        };

        setRecordings((s) => [newRecording, ...s]);
        setStatus("Recording saved ✅");
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatus("Recording... 🎤");
    } catch (err) {
      console.error("Failed to start recording", err);
      setStatus("Could not start recording — check microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const deleteRecording = async (id, downloadURL) => {
    try {
      if (downloadURL && downloadURL.startsWith('blob:')) {
        URL.revokeObjectURL(downloadURL);
      }
      // Remove blob from storage
      delete blobsRef.current[id];
      setRecordings((s) => s.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting recording: ", error);
    }
  };

  const handleTranscribe = async (id) => {
    setRecordings((s) =>
      s.map((r) => (r.id === id ? { ...r, isTranscribing: true } : r))
    );

    try {
      // Get the blob from our storage
      const blob = blobsRef.current[id];
      if (!blob) {
        throw new Error("Recording not found");
      }

      const file = new File([blob], "recording.webm", { type: "audio/webm" });

      const formData = new FormData();
      formData.append("audio", file);

      const response = await fetch("http://localhost:3001/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Transcription failed");

      const { transcriptId } = await response.json();

      const poll = async () => {
        const pollResponse = await fetch(`http://localhost:3001/transcription/${transcriptId}`);
        const data = await pollResponse.json();

        if (data.status === "completed") {
          setRecordings((s) =>
            s.map((r) =>
              r.id === id
                ? { ...r, transcription: data.text, isTranscribing: false }
                : r
            )
          );
        } else if (data.status === "failed") {
          setRecordings((s) =>
            s.map((r) => (r.id === id ? { ...r, isTranscribing: false } : r))
          );
          console.error("Transcription failed");
          alert("Transcription failed. Please try again.");
        } else {
          setTimeout(poll, 3000);
        }
      };
      poll();
    } catch (error) {
      console.error("Error transcribing:", error);
      setRecordings((s) =>
        s.map((r) => (r.id === id ? { ...r, isTranscribing: false } : r))
      );
      alert(`Transcription error: ${error.message}`);
    }
  };

  const filenameFor = (createdAtIso = null) => {
    const d = createdAtIso ? new Date(createdAtIso) : new Date();
    const y = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `mindease-recording-${y}${mm}${dd}-${hh}${min}${ss}.webm`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">🎙️ Voice Journal</h2>
      <p className="text-gray-700 mb-4">Tap the button to record your thoughts 💭</p>
      <div className="flex justify-center gap-4 mb-4">
        <Button
          onClick={startRecording}
          disabled={isRecording}
          aria-label="Start recording"
          className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition"
        >
          Start Recording
        </Button>
        <Button
          onClick={stopRecording}
          disabled={!isRecording}
          aria-label="Stop recording"
          className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
        >
          Stop Recording
        </Button>
      </div>

      {status && <p className="mt-4 text-green-600 font-medium">{status}</p>}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Saved Recordings</h3>
        {recordings.length === 0 && <p className="text-gray-500">No recordings yet.</p>}
        <ul className="space-y-4">
          {recordings.map((r) => (
            <li key={r.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <audio controls src={r.downloadURL} className="flex-1" aria-label={`Recording from ${r.createdAt}`} />
                <a
                  href={r.downloadURL}
                  download={filenameFor(r.createdAt)}
                  className="text-sm text-blue-600 hover:underline"
                  aria-label={`Download recording from ${r.createdAt}`}
                >
                  💾 Download
                </a>
                <button
                  onClick={() => deleteRecording(r.id, r.downloadURL)}
                  className="ml-2 text-red-600"
                  aria-label={`Delete recording from ${r.createdAt}`}
                >
                  🗑️
                </button>
              </div>
              <div className="mt-3">
                {r.transcription ? (
                  <p className="text-gray-700 italic">"{r.transcription}"</p>
                ) : (
                  <Button
                    onClick={() => handleTranscribe(r.id)}
                    disabled={r.isTranscribing}
                    className="bg-green-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-green-700 transition"
                  >
                    {r.isTranscribing ? "Transcribing..." : "Transcribe"}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VoiceJournal;
