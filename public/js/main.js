
function displayImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var image = document.getElementById('displayedImage');
      image.src = e.target.result;
      image.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  }
  // next step convert to base64
}

async function loadImageFromUrl(imageURL) {
  let image = document.getElementById('displayedImage');
  image.src = imageURL;
  image.style.display = 'block';
  updateDescription("generating description...", 'imageDescription');
  const data = await generateImageDescription(imageURL)
  // console.log(description);
  updateDescription(data.description, 'imageDescription');
}

async function getImage(id, prompt) {
  let useDescription = false;
  if (id === 'get-image-btn') {
    useDescription = true;
    prompt = document.getElementById('imageDescription').textContent;
  }
  updateDescription("generating image...", 'image-placeholder-message');

  const data = await generateImage(useDescription, prompt);
  if (data) {
    updateDescription("", 'image-placeholder-message');
  };
  const imageURL = data.imageData.data[0].url;
  const revisedPrompt = data.imageData.data[0].revised_prompt;
  // console.log(data.imageData.data[0].revised_prompt);
  // console.log(data.imageData.data[0].url);
  let image = document.getElementById('generatedImage');
  image.src = imageURL;
  image.style.display = 'block';
  updateDescription(revisedPrompt, 'revisedPrompt');
}

function updateDescription(text, id) {
  document.getElementById(id).textContent = text;
}

const copyToClipboard = (id) => {
  console.log("id", id);
  let text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text);
};

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

async function generateImage(useDescription=true, prompt) {
  if (useDescription) {
    prompt = document.getElementById('imageDescription').textContent;
  }
  try {
    const response = await fetch('/dall-e', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({prompt}),
    });

    const data = await response.json();
    // console.log("image data: ", data);
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}