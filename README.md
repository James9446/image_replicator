# Image Replicator

Image Replicator is a web application powered by OpenAI’s GPT-4V(ision) and DALL-E-3 AI models that generates a detailed description of an uploaded image and generates a new image based on that description or a given prompt.

## Features

1. Generate a detailed description of a provided image.
2. Adjust the temperature to control the output.
3. Generate a new image based on the description or a provide a custom prompt.
4. Manually set the desried image style "vivid" or "natural"; defaults to the style categorized by the 5. description.
6. Copy the image description or the revised prompt, for use in a creating a custom prompt for DALL-E 3.
7. Click on the generated image to open it in a new tab.

## Overview

There are two main sections:

1. **Generate Image Description**: Start with a random or provide one by uploading an image or pasting an image URL into the inout field. Then click the 'Generate Description' button. The AI then analyses the image and generates a detailed description which will be visible under the 'Description' section. You can use 'Copy Text' button to copy the description to clipboard.

2. **Generate New Image**: This section creates a new image based off the description provided in the previous step or by entering your own prompt. Additionally, you can choose between a 'Vivid' or 'Natural' image generation style. Click the 'Use Description' or 'Use Prompt' button to generate the image. The new image will be visible under 'New Image' section. The revised prompt used for generating image is shown under 'Revised Prompt', this can also be copied using the 'Copy Text' button.

## APIs Utilized

1. [GPT-4V(ision)](https://platform.openai.com/docs/guides/vision): To generate description of an uploaded image or image URL.
2. [DALL-E-3](https://platform.openai.com/docs/guides/images/example-dall-e-3-generations?context=node): To generate new image based on a provided prompt or description.
3. [Unsplash Image API](https://unsplash.com/documentation#get-a-random-photo): Get a random seed image to use for GPT-4V(ision)

## GPT-4V(ision)
OpenAI's GPT-4V(ision) model generates a detailed description by analyzing the provided image. The prompt used to generate the image description is currently hard coded.

### Prompt:

Describe what’s in this image. Include style, composition, colors, shapes, textures, lighting, and any other details that would help someone fully understand all of the details of the image. At the end of the description always provide a style categorization where the image is categorized as either 'vivid' or 'natural'. 'vivid' means the image looks hyper-real and dramatic, emphasizing intense and vibrant visuals. 'natural' means the image has a more realistic appearance, that steers away from hyper-realism and has a natural, authentic aesthetic. When making this categorization always include single quotation marks around the word 'vivid' or 'natural'. Example 1: """The image style is 'vidid'.""" Example 2: """The image style is 'natural'."""

## DALL-E 3
OpenAI's DALL-E 3 model generates an image based on either the description generated or a custom prompt provided in the text field.

### Revised Prompt
DALL-E 3 will revise the prompt before generating an image. This is largely for safety reasons but can also serve to add more detail. This featue cannot be dissabled but the extent of the revision can be limitted via prompting.

### Limitting Revisions
To limit the prompt revisions that DALL-E 3 applies, add the following to the line to the prompt:

`I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS:`

Note: the degree to which prompts will be revised is not always consistent. Even when attempting to limit it through prompting.

### Style
The DALL-E-3 model also accepts a style parameter of either "vivid" or "natural". The vivid style directs the model to create hyper-real and dramatic images. Conversely, the natural style guides the model to generate images with a more realistic appearance. The default prompt for generating an image description asks GPT-4V(ision) to categorize which style the image falls into. This categorization will be reflected in the style configuraion option in the UI, thus the image generated should have the same style as the original image. This can be overwritten by simply toggling the style setting in the UI.

## Getting Started

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

The application will start on `http://localhost:YOUR_PORT` if port is specified in the environment variable else it will default to `http://localhost:8080`.

## Dependencies

- **axios:** To make HTTP requests.
- **dotenv:** To load environment variables from a `.env` file.
- **express:** Web application framework for Node.js, used to setup the server.
- **nodemon (dev):** Utility that will monitor for any changes in the source and automatically restart the server, used for development.

## Contributing

Any contributions you might want to make are appreciated. If you would like to contribute to the project, feel free to fork the repository, create a branch, add commits, and then open a pull request.