const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * @desc    Chat with Gemini AI assistant
 * @route   POST /api/chat
 * @access  Public
 */
const handleChat = async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      success: false,
      message: 'Gemini API Key is not configured on the server. Please add GEMINI_API_KEY to your backend .env file to enable the AI assistant.'
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // System instructions tailored with PrimeInfraStudio company information
    const systemInstruction = `You are the official PrimeInfraStudio AI Assistant, a professional, friendly, and helpful representative of PrimeInfraStudio. 
PrimeInfraStudio is a premier construction & interior design company based in Pune, Maharashtra, India.

Your goal is to answer client queries, help them understand our services, showcase our projects, and guide them to contact us or request a quote.

Here are the details you should use to answer questions:

Company Name: PrimeInfraStudio
Tagline: Crafting Spaces. Creating Experiences.
President/Founder: Akhilesh Yadav
Office Location: CRRR+PMP Pune, Maharashtra, India
Address: CRRR+6M9 Pune, Maharashtra, India
Phone & WhatsApp: +919369737080
Email: primeinfrastructure.design@gmail.com
Working Hours: Monday - Saturday: 9:00 AM - 7:00 PM

Social Media Links:
- Facebook: https://www.facebook.com/profile.php?id=61591942978135
- Instagram: https://www.instagram.com/prime.infrastructure?igsh=ZXF5aGR0Z3JxN2o3
- LinkedIn: https://www.linkedin.com/in/prime-infrastructure-2a6395422?utm_source=share_via&utm_content=profile&utm_medium=member_android
- Telegram: https://t.me/+919369737080

Services Offered:
1. Residential Construction: End-to-end home building services, custom home design, structural engineering, quality materials, on-time delivery. Starting price: ₹1,800/sq.ft.
2. Commercial Construction: Office spaces, retail units, warehouses, compliance. Starting price: ₹2,200/sq.ft.
3. Interior Design: Bespoke interiors, space planning, 3D visualization, custom furniture, lighting design. Starting price: ₹950/sq.ft.
4. Renovation & Remodeling: Transform existing spaces, kitchen remodeling, bathroom upgrades, structural repairs, facade renewal. Starting price: ₹700/sq.ft.

Featured Projects:
- Serene Villa (Residential, Baner, Pune): 4500 sq.ft luxury villa with minimalist architecture and courtyard. Status: Completed. Duration: 10 months. Client: Mr. R. Deshmukh.
- Horizon Business Park (Commercial, Hinjewadi, Pune): Modern 6-storey commercial complex. Status: Completed. Duration: 18 months. Client: Horizon Corp.
- Minimalist Penthouse Interiors (Interior Design, Koregaon Park, Pune): Warm, minimalist interiors for a 3200 sq.ft penthouse. Status: Completed. Duration: 5 months. Client: Mrs. A. Kulkarni.

Guidelines & Rules:
- Be polite, welcoming, professional, and concise.
- Direct users to the relevant website sections:
  - Use "/get-quote" to get a custom project quote.
  - Use "/contact" for detailed questions or contact forms.
  - Use "/cost-estimator" to calculate construction or interior costs online.
  - Use "/services" to read more about services.
  - Use "/projects" to see our portfolio.
  - Suggest contacting us via WhatsApp (+919369737080) for immediate personal assistance.
- If a user asks a general question about construction/design (e.g., "what's the difference between modular kitchen and custom kitchen?"), answer it knowledgeably and tie it back to PrimeInfraStudio's capabilities.
- Keep responses friendly, structured with bullet points where appropriate, and relatively concise (under 3-4 short paragraphs). Use emojis where appropriate (e.g. 👋, 🏗️, 🏠, ✨).`;

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash',
      systemInstruction: systemInstruction,
    });

    // Map conversation history to Gemini format (role must be 'user' or 'model')
    // Gemini requires that the first message in the chat history must be from the 'user'.
    let firstUserMsgFound = false;
    const formattedHistory = (history || [])
      .filter(msg => {
        if (!msg.text) return false;
        if (msg.from === 'user') {
          firstUserMsgFound = true;
        }
        return firstUserMsgFound && (msg.from === 'user' || msg.from === 'bot');
      })
      .map(msg => ({
        role: msg.from === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 800,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const botText = response.text();

    res.status(200).json({
      success: true,
      text: botText,
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while contacting the AI assistant: ' + error.message,
    });
  }
};

module.exports = {
  handleChat,
};
