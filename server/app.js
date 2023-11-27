require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// base64 images require a larger limit
app.use(bodyParser.json({ limit: '10mb' }));

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
            "text": "Describe what’s in this image. Inlcude style, composition, colors, shapes, textures, lighting and any other details that would help someone understand what’s in the image. At the end of the descrption always provide a imageType catorization where the image is categorized as either 'vivid' or 'natural', vivid means the image looks hyper-real, while natural means the image looks less hyper-real."
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
        'Authorization': `Bearer ${key}`, 
        'Content-Type': 'application/json' 
      }
    });

    const description = await apiResponse.data.choices[0].message.content;

    // Handle the API response as needed
    res.status(200).json({description});
  } catch (error) {
    // Handle errors if the API request fails
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
  }
});

// Genrate an image 
app.post('/dall-e', async (req, res) => {
  console.log(req.body);
  const {prompt, style} = req.body;
  const key = process.env.OPEN_API_KEY;
  const imageGenerationURL = 'https://api.openai.com/v1/images/generations'; 
  const imageGenerationBody = {
    "model": "dall-e-3",
    "prompt": prompt,
    "n": 1,
    "size": "1024x1024",
    "style": style,
    "response_format": "url"
  };
  try {
    // Make a POST request to the API endpoint
    const apiResponse = await axios.post(imageGenerationURL, imageGenerationBody, {
      headers: {
        'Authorization': `Bearer ${key}`, 
        'Content-Type': 'application/json' 
      }
    });

    const imageData = await apiResponse.data.data[0];
    res.status(200).json({imageData});
  } catch (error) {
    // Handle errors if the API request fails
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      res.status(error.response.status).json({ error: error.response.data });
    } else {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running at PORT:${port}`);
});