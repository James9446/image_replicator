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
    const randomImageURL = data.urls.raw;
    loadImageFromUrl(randomImageURL);
  } catch (error) {
    console.error(error);
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
      // modifyElementClass('original-image-link', 'enabled', 'disabled');
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
}

// GET DESCRIPTION
// handle description generation request from client
async function getImageDescription() {
  const imageURL = document.getElementById('original-image').src;
  const temperature = Number(document.getElementById('temp-value').textContent);

  // update vision output title
  updateTextElement('vision-output-title', "Description"); // it defaults to the title Description

  // client-side error handling
  if (!imageURL) {
    updateTextElement('original-image-error-message', "You must provide an image before a description can be generated.");
    displayElement('original-image-error-message');
    return;
  } 
  
  // Clear previous description
  updateTextElement('vision-output', "");

  // Create placeholder text while description is being generated
  updateTextElement('vision-output-placeholder', "generating description...");

  // Call server to generate image description
  const body = { imageURL, temperature };
  const data = await generateImageDescription(body)
  
  // Update client with server response data
  updateTextElement('vision-output-placeholder', ""); // without a distinct placeholder an image can be generated before the description
  updateTextElement('vision-output', data.description);
  updateRadioForNaturalImages(data.description);
};

// GET IMAGE COMPARISON
async function getImageComparson() {
  const orignalImageURL = document.getElementById('original-image').src;
  const generatedImageURL = document.getElementById('generated-image').src;
  const temperature = Number(document.getElementById('temp-value').textContent);

  // client-side error handling
  if (!orignalImageURL && !generatedImageURL) {
    updateTextElement('original-image-error-message', "You must have an original image and a generated image to compare.");
    displayElement('original-image-error-message');
    return;
  }
  if (!orignalImageURL) {
    updateTextElement('original-image-error-message', "You must have an original image to compare.");
    displayElement('original-image-error-message');
    return;
  }
  if (!generatedImageURL) {
    hideElement('original-image');
    updateTextElement('original-image-error-message', "Generate an image to compare.");
    displayElement('original-image-error-message');
    setTimeout(() => {
      hideElement('original-image-error-message');
      displayImage('original-image', orignalImageURL);
    }, 2000);
    return;
  }

  // update box title
  updateTextElement('vision-output-title', "Comparison");

  // Clear previous description
  updateTextElement('vision-output', "");

  // Create placeholder text while description is being generated
  updateTextElement('vision-output-placeholder', "generating comparison...");

  // Call server to generate image description
  const body = { orignalImageURL, generatedImageURL, temperature };
  const data = await generateImageComparison(body)
  
  // Update client with server response data
  updateTextElement('vision-output-placeholder', ""); // without a distinct placeholder an image can be generated before the description
  updateTextElement('vision-output', data.comparison);
  updateRadioForNaturalImages(data.comparison);

}


// GET IMAGE
// handle image generation request from client
async function getImage(id, isVivid) {
  // clear previous image
  hideElement('generated-image');

  // determine which prompt to use
  let prompt;
  if (id === 'use-description-btn') {
    prompt = document.getElementById('vision-output').textContent;
    if (!prompt) {
      // client-side error handling
      updateTextElement('new-image-placeholder-message', "You must generate an image description first.");
      return;
    }
  } 
  if (id === 'use-prompt-btn') {
    prompt = document.getElementById('prompt-input').value;
    if (!prompt) {
      // client-side error handling
      updateTextElement('new-image-placeholder-message', "You must generate enter a prompt first.");
      return;
    }
  };

  // determine which style to use
  const style = isVivid ? 'vivid' : 'natural';
  
  // show placeholder message
  displayElement('new-image-placeholder-message');
  updateTextElement('new-image-placeholder-message', "generating image...");

  // cleanup revised prompt
  updateTextElement('revised-prompt', "");

  // call server to generate image
  const body = { prompt, style };
  const data = await generateImage(body);

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

// downloadImage() function is a possible todo 
// function downloadImage(id) {};


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