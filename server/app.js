require('dotenv').config();
const path = require('path');
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Generate an image description
app.post('/vision', async (req, res) => {
  const {imageURL} = req.body;
  const key = process.env.OPEN_API_KEY;
  const completionsURL = 'https://api.openai.com/v1/chat/completions'; 
  const visionBody = {
      "model": "gpt-4-vision-preview",
      "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text", 
            "text": "Describe what’s in this image. Inlcude style, composition, colors, shapes, textures, lighting and any other details that would help someone understand what’s in the image."
          },
          {
            "type": "image_url",
            "image_url": {
              "url": imageURL
            }
          }
        ]
      }
    ],
    "max_tokens": 500
  }
  try {
    // Make a POST request to the API endpoint
    const apiResponse = await axios.post(completionsURL, visionBody, {
      headers: {
        'Authorization': `Bearer ${key}`, // Include any necessary headers (e.g., authorization)
        'Content-Type': 'application/json' // Adjust content type based on API requirements
      }
    });

    const description = await apiResponse.data.choices[0].message.content;

    console.log(description);

    // console.log(JSON.stringify(apiResponse.data));
    // Handle the API response as needed
    res.status(200).json({description});
  } catch (error) {
    // Handle errors if the API request fails
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

// Genrate an image 
app.post('/dall-e', async (req, res) => {
  const {prompt} = req.body;
  const key = process.env.OPEN_API_KEY;
  const imageGenerationURL = 'https://api.openai.com/v1/images/generations'; 
  const imageGenerationBody = {
    "model": "dall-e-3",
    "prompt": prompt,
    "n": 1,
    "size": "1024x1024",
    "style": "vivid",
    "response_format": "url"
  };
  try {
    // Make a POST request to the API endpoint
    const apiResponse = await axios.post(imageGenerationURL, imageGenerationBody, {
      headers: {
        'Authorization': `Bearer ${key}`, // Include any necessary headers (e.g., authorization)
        'Content-Type': 'application/json' // Adjust content type based on API requirements
      }
    });

    const imageData = await apiResponse.data;

    console.log(imageData);

    // console.log(JSON.stringify(apiResponse.data));
    // Handle the API response as needed
    res.status(200).json({imageData});
  } catch (error) {
    // Handle errors if the API request fails
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at PORT:${port}`);
});