
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
  var image = document.getElementById('displayedImage');
  image.src = imageURL;
  image.style.display = 'block';
  updateDescription("generating description...");
  const data = await getImageDescription(imageURL)
  // console.log(description);
  updateDescription(data.description);
}

function updateDescription(text) {
  document.getElementById('imageDescription').textContent = text;
}

const copyToClipboard = () => {
  let text = document.getElementById("imageDescription").textContent;
  navigator.clipboard.writeText(text);
};

async function getImageDescription(imageURL) {

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

