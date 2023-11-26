// HANDLE CLIENT-SIDE ACTIONS

// handle images uploaded from local machine and generate description
function loadImageFromFile(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = async function (e) {
      const base64Image = e.target.result;
      console.log("e.target.result", base64Image);
      displayImage('original-image', base64Image);

      // Create placeholder text while description is being generated
      updateTextElement("generating description...", 'image-description');
    
      // Call server to generate image description
      const data = await generateImageDescription(base64Image)
      updateTextElement(data.description, 'image-description');
      updateRadioForNaturalImages(data.description);
    };
    reader.readAsDataURL(input.files[0]);
  }
}


// handle images uploaded from url and generate description
async function loadImageFromUrl(imageURL) {
  displayImage('original-image', imageURL);

  // Create placeholder text while description is being generated
  updateTextElement("generating description...", 'image-description');

  // Call server to generate image description
  const data = await generateImageDescription(imageURL)
  updateTextElement(data.description, 'image-description');

  updateRadioForNaturalImages(data.description);
}


// handle image generation request from client
async function getImage(id, isVivid) {
  hideImage('generatedImage');

  // determine which prompt to use
  let prompt;
  if (id === 'use-description-btn') {
    prompt = document.getElementById('image-description').textContent;
  } 
  if (id === 'use-prompt-btn') {
    prompt = document.getElementById('prompt-input').value;
  };

  // determine which style to use
  let style;
  if (isVivid) {
    style = 'vivid';
  } else {
    style = 'natural';
  };
  
  // show placeholder message
  updateTextElement("generating image...", 'image-placeholder-message');

  // Call server to generate image
  const requestBody = { prompt, style };
  const data = await generateImage(requestBody);

  // hide the placeholder message
  if (data) {
    updateTextElement("", 'image-placeholder-message');
  };
  const imageURL = data.imageData.url;
  const revisedPrompt = data.imageData.revised_prompt;
  displayImage('generatedImage', imageURL);
  updateTextElement(revisedPrompt, 'revised-prompt');
}




// CLIENT-SIDE UTILITY FUNCTIONS
function displayImage(id, imageURL) {
  let image = document.getElementById(id);
  image.src = imageURL;
  image.style.display = 'block';
}

function hideImage(id) {
  let image = document.getElementById(id);
  image.style.display = 'none';
}

function updateTextElement(text, id) {
  document.getElementById(id).textContent = text;
}

function copyToClipboard(id) {
  console.log("id", id);
  let text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text);
};

function downloadImage(id) {
  // var image = document.getElementById(id);
  //   var imageUrl = image.getAttribute('src');
  //   var imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
  //   var link = document.createElement('a');
  //   link.href = imageUrl;
  //   link.download = imageName;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // let image = document.getElementById(id);
  // let link = document.createElement('a');
  // link.href = image.src;
  // link.download = 'image.png';
  // link.click();
};

// DATA UTILITY FUNCTIONS
function updateRadioForNaturalImages(imageDescription) {
  const isNatural = imageDescription.includes("'natural'");
  if (isNatural) {
    const naturalRadio = document.getElementById('natural-radio')
    naturalRadio.checked = true;
  }
}





// BACKEND REQUESTS
async function generateImageDescription(imageURL) {
  try {
    const response = await fetch('/vision', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({imageURL}),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function generateImage(requestBody) {
  try {
    const response = await fetch('/dall-e', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}