// HANDLE CLIENT-SIDE ACTIONS

// UPLOAD
// handle images uploaded from local machine 
function loadImageFromFile(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = async function (e) {
      const base64Image = e.target.result;

      displayImage('original-image', base64Image);

      // // Create placeholder text while description is being generated
      // updateTextElement('image-description', "generating description...");
    
      // // Call server to generate image description
      // const imageURL = base64Image;
      // const temperature = Number(document.getElementById("temp-value").textContent);
      // const body = { imageURL, temperature };
      // const data = await generateImageDescription(body)
      
      // // Update client with server response data
      // updateTextElement('image-description', data.description);
      // updateRadioForNaturalImages(data.description);
    };
    reader.readAsDataURL(input.files[0]);
  }
}

// URL
// handle images uploaded from url 
async function loadImageFromUrl(imageURL) {
  displayImage('original-image', imageURL);
  modifyElementClass('gen-desc-btn', 'hover:bg-gray-400', 'hover:bg-green-700');
  // updateTextElement('original-image-placeholder-message', "");
  hideImage('original-image-error-message')

  // // Create placeholder text while description is being generated
  // updateTextElement('image-description', "generating description...");

  // // Call server to generate image description
  // const temperature = Number(document.getElementById("temp-value").textContent);
  // const body = { imageURL, temperature };
  // const data = await generateImageDescription(body)
  
  // // Update client with server response data
  // updateTextElement('image-description', data.description);
  // updateRadioForNaturalImages(data.description);
}

// GENERATE DESCRIPTION
// handle description generation request from client
async function getImageDescription() {
  const imageURL = document.getElementById('original-image').src;
  const temperature = Number(document.getElementById('temp-value').textContent);

  if (!imageURL) {
    displayElement('original-image-error-message');
    return;
  } 

  // Clear input field
  const input = document.getElementById('image-url');
  input.value = '';
  
  // Create placeholder text while description is being generated
  updateTextElement('image-description', "generating description...");

  // Call server to generate image description
  const body = { imageURL, temperature };
  const data = await generateImageDescription(body)
  
  // Update client with server response data
  updateTextElement('image-description', data.description);
  updateRadioForNaturalImages(data.description);
};


// GET IMAGE
// handle image generation request from client
async function getImage(id, isVivid) {
  hideImage('generated-image');

  // determine which prompt to use
  let prompt;
  if (id === 'use-description-btn') {
    prompt = document.getElementById('image-description').textContent;
  } 
  if (id === 'use-prompt-btn') {
    prompt = document.getElementById('prompt-input').value;
  };

  // determine which style to use
  const style = isVivid ? 'vivid' : 'natural';
  
  // show placeholder message
  updateTextElement('new-image-placeholder-message', "generating image...");
  // cleanup revised prompt
  updateTextElement('revised-prompt', "");

  // Call server to generate image
  const body = { prompt, style };
  const data = await generateImage(body);

  // hide the placeholder message once image is generated
  if (data) {
    updateTextElement('new-image-placeholder-message', "");
  };
  
  // Update client with server response data
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
  image.src = imageURL;
  image.style.display = 'block';
}

function displayElement(id) {
  let image = document.getElementById(id);
  image.style.display = 'block';
}

function hideImage(id) {
  let image = document.getElementById(id);
  image.style.display = 'none';
}

function createImageLink(id, imageURL) {
  let link = document.getElementById(id);
  link.style.display = 'contents';
  link.href = imageURL;
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
  const isNatural = imageDescription.includes("'natural'");
  if (isNatural) {
    const naturalRadio = document.getElementById('natural-radio')
    naturalRadio.checked = true;
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