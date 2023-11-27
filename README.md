# Image Replicator

Image Replicator is a web application powered by OpenAI’s GPT-4V(ision) and DALL-E-3 AI models that generates a detailed description of an uploaded image and generates a new image based on that description or a given prompt.

## Features

1. Upload image or provide image URL to generate a detailed description of the image.
2. Generate a new image based on the description or a provide a custom prompt. 
3. When generating an image you can opt for the generated image to be in a "vivid" or "natural" style. The selected style defaults to "vivid" but will be updated based on the description generated. You can always change the selection to whichever style you prefer. Vivid causes the model to lean towards generating hyper-real and dramatic images. Natural causes the model to produce more natural, less hyper-real looking images.
4. Copy to clipboard: the description text; the revised prompt text; a temporary link to the generated image. 
5. Click on the generated image to open it in a new tab. 

## Get Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed.

### Installation

Clone this repository:
```
git clone https://github.com/James9446/image_replicator.git
```

Go into the repository folder:
```
cd image_replicator
```

Install necessary dependencies:
```
npm install
```

### Environment Variables

You need to set up environment variables in a `.env` file for the project to run correctly. Create a `.env` file in the project root and set the necessary variables:

```
OPEN_API_KEY=<YOUR_OPEN_AI_KEY>
PORT=<YOUR_PORT>
```

### Running the application locally

To start the application run:

```
npm start
```

The application will start on `http://localhost:YOUR_PORT` if port is specified in the environment variable else it will default to `http://localhost:3000`.

## How the website works

Upon running the website, you will find two sections:

1. "Generate Image Description": Upload an image or provide an image URL and click the 'Submit' button. The AI then analyses the image and generates a detailed description which will be visible under the 'Description' section. You can use 'Copy Text' button to copy the description to clipboard.

2. "Generate New Image": This section creates a new image based off the description provided in the previous step or by entering your own prompt. Additionally, you can choose between a 'Vivid' or 'Natural' image generation style. Click the 'Use Description' or 'Use Prompt' button to generate the image. The new image will be visible under 'New Image' section, you can use 'Copy Temporary Link' button to copy the image URL to clipboard. The revised prompt used for generating image is shown under 'Revised Prompt', this can also be copied using the 'Copy Text' button.

## Utilized APIs

1. OpenAI GPT-4V(ision) API: To generate description of an uploaded image or image URL.
2. OpenAI DALL-E-3 API: To generate new image based on a provided prompt or description.

## Dependencies

- **axios:** To make HTTP requests.
- **dotenv:** To load environment variables from a `.env` file.
- **express:** Web application framework for Node.js, used to setup the server.
- **nodemon (dev):** Utility that will monitor for any changes in the source and automatically restart the server, used for development.

## Contributing

I appreciate any contributions you might want to make. If you would like to contribute to the project, feel free to fork the repository, create a branch, add commits, and then open a pull request.