import { useState, useCallback } from "react";
import LandingScreen from "./components/LandingScreen";
import FileUpload from "./components/FileUpload";
import ChatScreen from "./components/ChatScreen";
import ChatSkeleton from "./components/ChatSkeleton";
import { parseChat } from "./utils/parseChat";

/**
 * Root application component.
 * Manages a simple screen-based state machine: landing → upload → chat.
 */
function App() {
  const [screen, setScreen] = useState("landing"); // 'landing' | 'upload' | 'parsing' | 'chat'
  const [chatData, setChatData] = useState(null);
  const [parseError, setParseError] = useState("");

  const handleGetStarted = useCallback(() => {
    setScreen("upload");
  }, []);

  const handleFileSubmit = useCallback((rawText) => {
    // Show skeleton immediately while parsing runs on next tick
    setScreen("parsing");
    setParseError("");

    // Defer parsing so the skeleton has time to paint
    setTimeout(() => {
      try {
        const data = parseChat(rawText);

        if (!data.messages.length) {
          setParseError(
            "No messages found. Please make sure this is a valid WhatsApp chat export.",
          );
          setScreen("upload");
          return;
        }

        setChatData(data);
        setScreen("chat");
      } catch {
        setParseError(
          "Failed to parse the chat file. Please check the format.",
        );
        setScreen("upload");
      }
    }, 50);
  }, []);

  const handleBackToUpload = useCallback(() => {
    setScreen("upload");
    setChatData(null);
  }, []);

  const handleBackToLanding = useCallback(() => {
    setScreen("landing");
  }, []);

  return (
    <div className="h-dvh">
      {screen === "landing" && (
        <LandingScreen onGetStarted={handleGetStarted} />
      )}

      {screen === "upload" && (
        <FileUpload
          onFileSubmit={handleFileSubmit}
          onBack={handleBackToLanding}
          parseError={parseError}
        />
      )}

      {screen === "parsing" && <ChatSkeleton />}

      {screen === "chat" && chatData && (
        <ChatScreen chatData={chatData} onBack={handleBackToUpload} />
      )}
    </div>
  );
}

export default App;
