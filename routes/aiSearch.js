const express = require('express');
const Groq = require('groq-sdk');


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { query } = req.body;
    console.log('Received AI query:', query);

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
content: `You are a helpful assistant that converts natural language into MongoDB query filter objects. Your response must be a valid JSON object. For example, if the user asks for "Beach houses in Goa under ₹4000 with wifi", you should return:
{
  "location": "Goa",
  "price": { "$lt": 4000 },
  "amenities": "wifi", // Or an array if multiple amenities
  "propertyType": "house" // Or based on your schema
}
Do not include any other text or explanation, only the JSON object.`,
        },
        {
          role: 'user',
          content: query,
        },
      ],
      model: 'llama-3.3-70b-versatile',
    });
    let groqContent = completion.choices[0].message.content;
    let parsedContent;
    try {
        parsedContent = JSON.parse(groqContent);
    } catch (parseError) {
        console.error('Groq returned non-JSON content:', groqContent);
        // Decide how to handle: send an empty object, an error, or the raw string
        return res.status(500).json({ error: 'AI did not return valid filter JSON.' });
    }
    res.json({ message: parsedContent }); // Send the parsed object
  } catch (error) {
    console.error('❌ AI Search Error:', error); // 🔥 This line is key
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
