document.getElementById('summarizeBtn').addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const summaryElem = document.getElementById('summary');
    // Show loading animation
    summaryElem.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
      <div class="loader" style="
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3498db;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        animation: spin 1s linear infinite;
      "></div>
      <span style="font-size: 1.1em;">Summarizing...</span>
      </div>
      <style>
      @keyframes spin {
        0% { transform: rotate(0deg);}
        100% { transform: rotate(360deg);}
      }
      </style>
    `;

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.body.innerText
    }, async (results) => {
      if (!results || !results[0] || !results[0].result) {
      summaryElem.innerText = 'Failed to read content from the webpage.';
      console.error('executeScript failed or returned empty:', results);
      return;
      }

      const pageText = results[0].result.slice(0, 2000); // truncate input to fit model limit
      const summary = await getSummary(pageText);
      summaryElem.innerHTML = summary
      .split('\n')
      .map(line => `<p style="margin: 0.5em 0; font-size: 1.1em; line-height: 1.5;">${line.trim()}</p>`)
      .join('');
      summaryElem.style.padding = '12px';
      summaryElem.style.background = '#f8f9fa';
      summaryElem.style.borderRadius = '8px';
      summaryElem.style.fontFamily = 'Segoe UI, Arial, sans-serif';
    });
  } catch (err) {
    console.error('Error during summarize process:', err);
    document.getElementById('summary').innerText = 'Error: ' + err.message;
  }
});

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
              text: `You are an expert summarizer. Summarize this in 3-4 safe sentences:\n\n${text.slice(0, 3000)}`
            }]
          }],
          safetySettings: [
                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                { category: "HARM_CATEGORY_CIVIC_INTEGRITY", threshold: "BLOCK_NONE" }
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
