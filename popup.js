document.getElementById('summarizeBtn').addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Check if it's a YouTube video page
    if (!tab.url.includes('youtube.com/watch')) {
      document.getElementById('summary').innerHTML = `
        <p style="color: #e53935; font-weight: 500;">
          ❌ Please open a YouTube video first (URL must contain "youtube.com/watch").
        </p>
      `;
      return;
    }

    const summaryElem = document.getElementById('summary');
    // Show YouTube-specific loading animation
    summaryElem.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <div class="loader" style="
          border: 4px solid #ff0000;
          border-top: 4px solid #ffffff;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          animation: spin 1s linear infinite;
        "></div>
        <span style="font-size: 1.1em; color: #ff0000;">Analyzing YouTube video...</span>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    // Extract video title and transcript (simplified example)
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        return {
          title: document.querySelector('h1.ytd-watch-metadata > yt-formatted-string')?.innerText || 'Untitled Video',
          text: Array.from(document.querySelectorAll('#content #description')).map(el => el.innerText).join('\n\n')
        };
      }
    }, async (results) => {
      if (!results?.[0]?.result) {
        summaryElem.innerHTML = `
          <p style="color: #e53935;">
            Failed to extract video details. Try opening the video description section first.
          </p>
        `;
        return;
      }

      const { title, text } = results[0].result;
      const videoContext = `YouTube Video Title: "${title}"\n\nVideo Content/Description:\n${text.slice(0, 3000)}`;

      const summary = await getSummary(videoContext);
     // Process the summary text to remove markdown and display horizontally
summaryElem.innerHTML = `
  <div style="
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0.5em 0;
    font-size: 1.1em;
    line-height: 1.5;
  ">
    ${summary
      .replace(/\*\*/g, '') // Remove all ** markdown
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => `
        <div style="
          background: #ffffff;
          padding: 6px 12px;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        ">
          ${line.trim()}
        </div>
      `)
      .join('')}
  </div>
`;

// Container styling
summaryElem.style.padding = '12px';
summaryElem.style.background = '#f8f9fa';
summaryElem.style.borderRadius = '8px';
summaryElem.style.fontFamily = 'Segoe UI, Arial, sans-serif';
    });
  } catch (err) {
    console.error('Summarization error:', err);
    document.getElementById('summary').innerHTML = `
      <p style="color: #e53935;">
        Error: ${err.message || 'Check console for details'}
      </p>
    `;
  }
});

// Modified Gemini prompt for YouTube context
async function getSummary(text) {
  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD7zSHlSnK9z2LOp2VMjKsVtt3KgwXePIo',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a YouTube expert. Create a concise 3-4 point summary of this video content. Focus on key insights and omit promotional content:\n\n${text}`
            }]
          }],
          safetySettings: [
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("🔍 Gemini response:", JSON.stringify(data, null, 2));

    const parts = data?.candidates?.[0]?.content?.parts;
    if (parts?.length > 0 && parts[0].text) {
      return parts[0].text.trim();
    }

    return '⚠️ Gemini API call succeeded but no summary returned (no usable text).';
  } catch (err) {
    console.error('Gemini API error:', err);
    return 'Failed to get summary from Gemini.';
  }
}
