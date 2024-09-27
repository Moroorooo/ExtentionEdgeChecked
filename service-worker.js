function injectedFunction() { 
  let element;

  if(document.querySelector(".css-1da2g7c") !== null) {
    element = document.querySelectorAll(".css-1da2g7c p span span");  
  } else {
    element = document.querySelectorAll(".rc-FormPartsQuestion p span span");
  }
  
  let text = "";
  for (let i = 0; i < element.length; i++) {
    text += element[i].innerHTML + "\n";
  } 
  
  const safeInput = text + "\n This is an exam, I emphasize that only send the question number and the text of the correct answer.";
  
  const data = {
    "prompt": safeInput,
    "stream": false,
    "botId": "llava-v1.5-7b-4096-preview" // Replace with your GroqCloud bot ID
  };
  
  const payload = JSON.stringify(data);
  
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer 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" // Replace with your GroqCloud API key
  };
  
  const url = "https://api.groq.com/openai/v1/models"; // Replace with actual GroqCloud API endpoint
  
  fetch(url, {
    method: 'POST',
    headers: headers,
    body: payload
  })
  .then(response => {
    if (response.ok) {
      return response.json(); 
    } else {
      throw new Error('Network response was not ok.');
    }
  })
  .then(response_json => {
    const oti = response_json['reply']; 
    console.log(oti);
    
    // Create a tooltip to display the answer
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerText = oti;
    document.body.appendChild(tooltip);

    // Position the tooltip below the cursor
    document.addEventListener('mousemove', function(event) {
      tooltip.style.left = event.pageX + 'px';
      tooltip.style.top = (event.pageY + 20) + 'px'; // Offset below the cursor
    });

    // Highlight the correct answer
    for (let i = 0; i < element.length; i++) {
      if (oti.toLowerCase().includes(element[i].innerHTML.toLowerCase())) {
        element[i].style = "border-style: solid; border-color: #0d7a0d;";
      }
    }

    // Remove the tooltip when mouse leaves
    tooltip.addEventListener('mouseleave', function() {
      document.body.removeChild(tooltip);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Execute the injected function when the extension button is clicked
chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: injectedFunction,
  });
});
