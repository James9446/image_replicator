# Image Replicator

Image Replicator is a web application powered by OpenAI’s GPT-4V(ision) and DALL-E-3 AI models that generates a detailed description of an uploaded image and generates a new image based on that description or a given prompt. It can also generate a comparison of the original image and the generated image.

## Features

1. Generate a detailed description of a provided image.
2. Adjust the temperature to control the output.
3. Generate a new image based on the description or provide a custom prompt.
4. Generate a comparison between the original image and the generated image.
5. Manually set the desired image style "vivid" or "natural"; defaults to the style categorized by the description.
6. Copy the image description or the revised prompt, for use in creating a custom prompt for DALL-E 3.
7. Click on the generated image to open it in a new tab.

## Overview

1. **Generate Image Description**: Start with a random image or provide one by uploading an image or pasting an image URL into the input field. Then click the 'Generate Description' button. The AI then analyzes the image and generates a detailed description which will be visible under the 'Description' section. You can use the 'Copy Text' button to copy the description to clipboard.

2. **Generate New Image**: This section creates a new image based off the description provided in the previous step or by entering your own prompt. Additionally, you can choose between a 'Vivid' or 'Natural' image generation style. Click the 'Use Description' or 'Use Prompt' button to generate the image. The new image will be visible under the 'New Image' section. The revised prompt used for generating images, is shown under 'Revised Prompt', this can also be copied using the 'Copy Text' button.

3. **Compare Images**: If an original image has been provided and an image has been generated, the two images can be compared and contrasted by pressing the 'Generate Comparison' button. 

## APIs Utilized

1. [GPT-4V(ision)](https://platform.openai.com/docs/guides/vision): Generates an image description or an image comparison
2. [DALL-E 3](https://platform.openai.com/docs/guides/images/example-dall-e-3-generations?context=node): Generates a new image based on the image description or a custom prompt
3. [Unsplash Image API](https://unsplash.com/documentation#get-a-random-photo): Gets a random seed image to use for GPT-4V(ision)

## GPT-4V(ision)
OpenAI's GPT-4V(ision) is able to answer questions about provided images. The Image Replicator app uses GPT-4V(ision) in two ways. To generate a detailed image description, and to generate a detailed image comparison.

### Prompts:
The prompts used by GTP-4V(ision) are currently hard coded.

#### Image Description Prompt:
Describe what’s in this image. Include style, composition, colors, shapes, textures, lighting, and any other details that would help someone fully understand all of the details of the image. At the end of the description always provide a style categorization where the image is categorized as either 'vivid' or 'natural'. 'vivid' means the image looks hyper-real and dramatic, emphasizing intense and vibrant visuals. 'natural' means the image has a more realistic appearance, that steers away from hyper-realism and has a natural, authentic aesthetic. When making this categorization always include single quotation marks around the word 'vivid' or 'natural'. Example 1: """The image style is 'vivid'.""" Example 2: """The image style is 'natural'."""

#### Image Comparison Prompt:
What are in these images? How are they similar? How do they differ?

### Temperature
GPT-4V(ision) accepts a temperate parameter. The temperature range is from 0 to 2. Lowerer temperatures will tend to have more consistent results, while higher temperatures will tend to have more creative results. Anything between 0 and 1 will create reasonable results. Taking the temperature all the way up to 2 tends to create nonsensical results. The recommended value for the Image Replicator app is 0.5 but this can be manually adjusted before generating an image description or an image comparison.

## DALL-E 3
OpenAI's DALL-E 3 model generates an image based on either the description generated or a custom prompt provided in the text field.

### Revised Prompt
DALL-E 3 will revise the prompt before generating an image. This is largely for safety reasons but can also serve to add more detail. This feature cannot be disabled but the extent of the revision can be limited via prompting.

### Limiting Revisions
To limit the prompt revisions that DALL-E 3 applies, add the following to the line to the prompt:

`I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS:`

Note: the degree to which prompts will be revised is not always consistent. Even when attempting to limit it through prompting.

### Style
The DALL-E-3 model also accepts a style parameter of either "vivid" or "natural". The vivid style directs the model to create hyper-real and dramatic images. Conversely, the natural style guides the model to generate images with a more realistic appearance. The default prompt for generating an image description asks GPT-4V(ision) to categorize which style the image falls into. This categorization will be reflected in the style configuration option in the UI, thus the image generated should have the same style as the original image. This can be overwritten by simply toggling the style setting in the UI.

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
- **express:** Web application framework for Node.js, used to set up the server.
- **nodemon (dev):** Utility that will monitor for any changes in the source and automatically restart the server, used for development.

## Contributing

All contributions are welcome. If you would like to contribute to the project, feel free to fork the repository, create a branch, add commits, and then open a pull request.