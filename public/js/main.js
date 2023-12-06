// HANDLE CLIENT-SIDE ACTIONS

// GET A RANDOM IMAGE 
async function getRandomImage() {
  // https://unsplash.com/documentation#get-a-random-photo
  // to limit result to square images, add the parameter orientation=squarish to the request url

  try {
    const response = await fetch('https://api.unsplash.com/photos/random?client_id=A5OLU2o5jboQIVT3EPJnvPiiUPtGlAwhnyKCkYujeXE', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    // handle errors
    if (data.error || !data.urls.raw) {
      throw new Error(data.error || "Unknown error");
    }

    const randomImageURL = data.urls.raw;
    loadImageFromUrl(randomImageURL);

    // google analytics custom event
    gtag('event', 'random_seed_image_created', {
      'image_url': randomImageURL
    });
  } catch (error) {
    console.error(error);
    updateTextElement('original-image-error-message', "Sorry, there was an error retrieving a random image. Please try again.");
  }
}

// ADD IMAGE FROM UPLOAD
function loadImageFromFile(input) {
  hideElement('original-image-error-message')
  removeImageLink('original-image-link')
  displayElement('original-image-link', 'contents');
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = async function (e) {
      const base64Image = e.target.result;
      
      displayImage('original-image', base64Image);

      // google analytics custom event
      gtag('event', 'image_loaded_from_file', {
        'image_url': base64Image
      });
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// ADD IMAGE FROM URL INPUT
async function loadImageFromUrl(imageURL) {
  hideElement('original-image-error-message');
  displayImage('original-image', imageURL);
  createImageLink('original-image-link', imageURL);
  clearInputField('image-url');

  // google analytics custom event
  gtag('event', 'image_loaded_from_url', {
    'image_url': imageURL
  });
}

// GET DESCRIPTION
// handle description generation request from client
async function getImageDescription() {
  const imageURL = document.getElementById('original-image').src;
  const temperature = Number(document.getElementById('temp-value').textContent);
  let placeholderMessage = document.getElementById('vision-output-placeholder').textContent;
  
  // error handling - user error: check if there is no image
  if (!imageURL) {
    updateTextElement('original-image-error-message', "You must provide an image before a description can be generated.");
    displayElement('original-image-error-message');
    
    // google analytics custom event
    gtag('event', 'user_error', {
      'error_message': 'You must provide an image before a description can be generated.'
    });
    return;
  } 

  // error handling - user error: check if generation is in progress
  if (placeholderMessage === "Generating description..." || placeholderMessage === "Generating comparison..." || placeholderMessage === "Already in progress...") {
    console.log(placeholderMessage);
    placeholderMessage = placeholderMessage === "Already in progress..." ? "Generating description..." : placeholderMessage; // placeholderMessage could be "Generating comparison..." and we want to keep that
    updateTextElement('vision-output-placeholder', "Already in progress...");
    displayElement('vision-output-placeholder');
    setTimeout(() => {
      updateTextElement('vision-output-placeholder', placeholderMessage);
    }, 1000);
    return;
  }

  // update vision output title
  updateTextElement('vision-output-title', "Description"); // it defaults to the title Description
  
  // Clear previous description
  updateTextElement('vision-output', "");

  // Create placeholder text while description is being generated
  updateTextElement('vision-output-placeholder', "Generating description...");
  displayElement('vision-output-placeholder');

  
  try {
    // call server to generate image description
    const body = { imageURL, temperature };
    const data = await generateImageDescription(body)
    
    // test error handling
    // const data = await errorTest(body);

    // error handling
    if (data.error || !data.description) {
      throw new Error(data.error || "Unknown error");
    }

    // Update client with server response data
    updateTextElement('vision-output-placeholder', ""); // without a distinct placeholder an image can be generated before the description
    hideElement('vision-output-placeholder');
    updateTextElement('vision-output', data.description);
    updateRadioForNaturalImages(data.description);

    // google analytics custom event
    gtag('event', 'description_generated', {
      'description': data.description,
      'image_url': imageURL,
      'temperature': temperature
    });
  } catch (error) {
    console.error(error);
    updateTextElement('vision-output-placeholder', "Sorry, there was an error generating the description. Please try again.");
  }
};

// GET IMAGE COMPARISON
async function getImageComparson() {
  const orignalImageURL = document.getElementById('original-image').src;
  const generatedImageURL = document.getElementById('generated-image').src;
  const temperature = Number(document.getElementById('temp-value').textContent);
  let placeholderMessage = document.getElementById('vision-output-placeholder').textContent;

  
  // error handling - user error
  if (!orignalImageURL && !generatedImageURL) {
    updateTextElement('original-image-error-message', "You must have an original image and a generated image to compare.");
    displayElement('original-image-error-message');
    
    // google analytics custom event
    gtag('event', 'user_error', {
      'error_message': 'You must have an original image and a generated image to compare.'
    });
    return;
  }
  // error handling - user error
  if (!orignalImageURL) {
    updateTextElement('original-image-error-message', "You must have an original image to compare.");
    displayElement('original-image-error-message');
    
    // google analytics custom event
    gtag('event', 'user_error', {
      'error_message': 'You must have an original image to compare.'
    });
    return;
  }
  // error handling - user error
  if (!generatedImageURL) {
    hideElement('original-image');
    updateTextElement('original-image-error-message', "Generate an image to compare.");
    displayElement('original-image-error-message');
    setTimeout(() => {
      hideElement('original-image-error-message');
      displayImage('original-image', orignalImageURL);
    }, 2000);
    
    // google analytics custom event
    gtag('event', 'user_error', {
      'error_message': 'Generate an image to compare.'
    });
    return;
  }

  // error handling - user error: check if generation is in progress
  if (placeholderMessage === "Generating comparison..." || placeholderMessage === "Generating description..." || placeholderMessage === "Already in progress...") {
    placeholderMessage = placeholderMessage === "Already in progress..." ? "Generating comparison..." : placeholderMessage; // placeholderMessage could be "Generating description..." and we want to keep that
    console.log(placeholderMessage);
    updateTextElement('vision-output-placeholder', "Already in progress...");
    displayElement('vision-output-placeholder');
    setTimeout(() => {
      updateTextElement('vision-output-placeholder', placeholderMessage);
    }, 1000);
    return;
  }

  // update box title
  updateTextElement('vision-output-title', "Comparison");

  // clear previous description
  updateTextElement('vision-output', "");

  // create placeholder text while description is being generated
  updateTextElement('vision-output-placeholder', "Generating comparison...");
  displayElement('vision-output-placeholder');

  try {
    // call server to generate image description
    const body = { orignalImageURL, generatedImageURL, temperature };
    const data = await generateImageComparison(body);

    // error handling
    if (data.error || !data.comparison) {
      throw new Error(data.error || "Unknown error");
    }
    
    // update client with server response data
    updateTextElement('vision-output-placeholder', ""); // without a distinct placeholder an image can be generated before the description
    hideElement('vision-output-placeholder');
    updateTextElement('vision-output', data.comparison);
    updateRadioForNaturalImages(data.comparison);
  
    // google analytics custom event
    gtag('event', 'comparison_generated', {
      'comparison': data.comparison,
      'original_image_url': orignalImageURL,
      'generated_image_url': generatedImageURL,
      'temperature': temperature
    });

  } catch (error) {
    console.error(error);
    updateTextElement('vision-output-placeholder', "Sorry, there was an error generating the comparison. Please try again.");
  }
}


// GET IMAGE
// handle image generation request from client
async function getImage(id, isVivid) {
  const placeholderMessage = document.getElementById('new-image-placeholder-message').textContent;
  
  // error handling - user error: check if generation is in progress
  if (placeholderMessage === "Generating image..." || placeholderMessage === "Already in progress...") {
    updateTextElement('new-image-placeholder-message', "Already in progress...");
    setTimeout(() => {
      updateTextElement('new-image-placeholder-message', "Generating image...");
    }, 1000);
    return;
  }
  
  // determine which prompt to use
  // description 
  let prompt;
  if (id === 'use-description-btn') {
    prompt = document.getElementById('vision-output').textContent;

    // error handling - user error: confirm that a description has been generated
    if (!prompt) {
      // if an image exists, only show the placeholder message for 2 seconds
      if (document.getElementById('generated-image').src) {
        hideElement('generated-image');
        updateTextElement('new-image-placeholder-message', "You must generate an image description first.");
        displayElement('new-image-placeholder-message');
        setTimeout(() => {
          hideElement('new-image-placeholder-message');
          displayElement('generated-image');
        }, 2000);
      } else {
        updateTextElement('new-image-placeholder-message', "You must generate an image description first.");
        displayElement('new-image-placeholder-message');
      }

      // google analytics custom event
      gtag('event', 'user_error', {
        'error_message': 'You must generate an image description first.'
      });
      return;
    }
  } 

  // prompt 
  if (id === 'use-prompt-btn') {
    prompt = document.getElementById('prompt-input').value;

    // error handling - user error: confirm that a prompt has been entered
    if (!prompt) {
      // if an image exists, only show the placeholder message for 2 seconds
      if (document.getElementById('generated-image').src) {
        hideElement('generated-image');
        updateTextElement('new-image-placeholder-message', "You must enter a prompt first.");
        displayElement('new-image-placeholder-message');
        setTimeout(() => {
          hideElement('new-image-placeholder-message');
          displayElement('generated-image');
        }, 2000);
      } else {
        updateTextElement('new-image-placeholder-message', "You must enter a prompt first.");
        displayElement('new-image-placeholder-message');
      }

      // google analytics custom event
      gtag('event', 'user_error', {
        'error_message': 'You must enter a prompt first.'
      });
      return;
    }
  };


  // determine which style to use
  const style = isVivid ? 'vivid' : 'natural';
  
  // clear previous image
  hideElement('generated-image');

  // show placeholder message
  updateTextElement('new-image-placeholder-message', "Generating image...");
  displayElement('new-image-placeholder-message');

  // cleanup revised prompt
  updateTextElement('revised-prompt', "");

  try {
    // call server to generate image
    const body = { prompt, style };
    const data = await generateImage(body);

    // error handling
    if (data.error || !data.imageData || !data.imageData.url || !data.imageData.revised_prompt) {
      throw new Error(data.error || "Unknown error");
    }
  
    // hide the placeholder message once image is generated
    if (data) {
      updateTextElement('new-image-placeholder-message', "");
      hideElement('new-image-placeholder-message');
    };
    
    // update client with server response data
    const imageURL = data.imageData.url;
    const revisedPrompt = data.imageData.revised_prompt;
    displayImage('generated-image', imageURL);
    createImageLink('generated-image-link', imageURL);
    updateTextElement('revised-prompt', revisedPrompt);
  
    // google analytics custom event
    gtag('event', 'image_generated', {
      'image_url': imageURL,
      'prompt': prompt,
      'prompt_type': id === 'use-description-btn' ? 'description' : 'prompt',
      'style': style,
      'revised_prompt': revisedPrompt
    });
  } catch (error) {
    console.error(error);
    updateTextElement('new-image-placeholder-message', "Sorry, there was an error generating the image. Please try again.");
  }
}


// TEMPERATURE SLIDER
const slider = document.getElementById("temp-slider");
const output = document.getElementById("temp-value");

output.innerHTML = slider.value / 100;

slider.oninput = function() {
  output.innerHTML = this.value / 100;
}



// CLIENT-SIDE UTILITY FUNCTIONS
function modifyElementClass(id, oldClass, newClass) {
  const element = document.getElementById(id);
  element.classList.remove(oldClass);
  element.classList.add(newClass);
}

function displayImage(id, imageURL) {
  let image = document.getElementById(id);
  image.src = '';
  image.src = imageURL;
  image.style.display = 'block';
}

function displayElement(id, style='block') {
  let image = document.getElementById(id);
  image.style.display = style;
}

function hideElement(id) {
  let image = document.getElementById(id);
  image.style.display = 'none';
}

function clearInputField(id) {
  const input = document.getElementById(id);
  input.value = '';
};

function createImageLink(id, imageURL) {
  let link = document.getElementById(id);
  link.style.display = 'contents';
  link.href = imageURL;
  link.target = '_blank';
};

function removeImageLink(id) {
  let link = document.getElementById(id);
  link.href = 'javascript:void(0)';
  link.target = '';
};

function updateTextElement(id, text) {
  document.getElementById(id).textContent = text;
}

function copyToClipboard(id) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text);

  // google analytics custom event
  gtag('event', 'text_copied', {
    'text': text
  });
};

function copyImageURL(id) {
  const link = document.getElementById(id).src;
  navigator.clipboard.writeText(link);
};

function updateRadioForNaturalImages(imageDescription) {
  const vividRadio = document.getElementById('vivid-radio');
  const naturalRadio = document.getElementById('natural-radio');
  const isNatural = imageDescription.includes("'natural'");
  if (isNatural) {
    naturalRadio.checked = true;
  } else {
    vividRadio.checked = true;
  }
}


// BACKEND REQUESTS
async function generateImageDescription(body) {
  try {
    const response = await fetch('/vision', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Server Error:', error);
  }
}

async function generateImage(body) {
  try {
    const response = await fetch('/dall-e', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Server Error:', error);
  }
}

async function generateImageComparison(body) {
  try {
    const response = await fetch('/vision-comparison', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Server Error:', error);
  }
}

async function errorTest(body) {
  try {
    const response = await fetch('/error-test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Server Error:', error);
  }
}