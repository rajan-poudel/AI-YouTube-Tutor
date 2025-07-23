chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "summarize") {
      // TODO: Fetch YouTube transcript or subtitles here
      // For demo, just send a dummy summary
      const summary = "This is a sample summary of the video content.";
      sendResponse({ result: summary });
    }
    else if (request.action === "quiz") {
      // TODO: Generate quiz questions from video content or transcript
      const quiz = "1. What is the main topic?\n2. Explain key points.";
      sendResponse({ result: quiz });
    }
    return true; // keep the message channel open for async response (if needed)
  });
  