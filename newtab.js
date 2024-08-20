let currentPopover = null;

function calculateExactAge(birthdate) {
  const now = new Date();
  const birthDate = new Date(birthdate);
  const ageInMilliseconds = now - birthDate;
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25); // Convert milliseconds to years
  return ageInYears;
}

function updateAgeDisplay(birthdate) {
  const ageDisplay = document.getElementById('ageDisplay');

  function update() {
    const age = calculateExactAge(birthdate);
    ageDisplay.textContent = age.toFixed(8); // Display age with high precision
  }

  update(); // Initial call to display immediately
  setInterval(update, 100); // Update every 100 milliseconds
}

function getRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}

function showPopover(event, yearIndex) {
  const popover = document.getElementById('popover');
  const popoverText = document.getElementById('popoverText');
  
  const rect = event.target.getBoundingClientRect();
  const bodyRect = document.body.getBoundingClientRect();
  
  popover.style.top = `${rect.top - bodyRect.top}px`;
  popover.style.left = `${rect.left + rect.width + 10}px`;
  popover.classList.remove('hidden');

  // Set the title of the popover
  popoverTitle.textContent = `# ${yearIndex + 1}`; // Adjust the index display if needed

  // Load the note for the current circle
  chrome.storage.sync.get(['notes'], function(data) {
    const notes = data.notes || {};
    popoverText.value = notes[yearIndex] || '';
  });

  // Attach event listener for the "Save" button only once
  document.getElementById('saveNote').onclick = function() {
    const note = popoverText.value;
    chrome.storage.sync.get(['notes'], function(data) {
      const notes = data.notes || {};
      notes[yearIndex] = note;
      chrome.storage.sync.set({ notes }, function() {
        hidePopover(); // Close the popover after saving
      });
    });
  };
}

function hidePopover() {
  const popover = document.getElementById('popover');
  popover.classList.add('hidden');
  currentPopover = null; // Reset the current popover tracker
}

function togglePopover(event, yearIndex) {
  if (currentPopover === yearIndex) {
    hidePopover();
  } else {
    currentPopover = yearIndex;
    showPopover(event, yearIndex);
  }
}

function updateCircles(birthdate, lifespan, circleColor) {
  const container = document.getElementById('circlesContainer');
  container.innerHTML = '';

  const exactAge = calculateExactAge(birthdate);
  const fullYears = Math.floor(exactAge);
  const fractionYear = exactAge - fullYears;

  for (let i = 0; i < lifespan; i++) {
    const circle = document.createElement('div');
    circle.classList.add('circle');

    circle.style.setProperty('--circle-color', circleColor);

    if (i < fullYears) {
      circle.classList.add('filled');
    } else if (i === fullYears) {
      circle.classList.add('partial-fill');
      circle.style.setProperty('--fill-percentage', fractionYear * 100 + '%');
    }

    circle.onmouseover = function(event) {
      if (currentPopover === null) {
        showPopover(event, i);
      }
    };

    circle.onmouseout = function() {
      if (currentPopover === null) {
        hidePopover();
      }
    };

    circle.onclick = function(event) {
      togglePopover(event, i);
    };

    container.appendChild(circle);
  }
}

chrome.storage.sync.get(['birthdate', 'lifespan', 'bgColor', 'circleColor'], function(data) {
  const birthdate = data.birthdate || '1990-01-01';
  const lifespan = parseInt(data.lifespan || 90, 10);
  const bgColor = data.bgColor || '#F5F4EB';
  const circleColor = data.circleColor || '#D55B57';

  document.getElementById('body').style.backgroundColor = bgColor;

  if (birthdate) {
    updateAgeDisplay(birthdate); // Start updating the age counter
    updateCircles(birthdate, lifespan, circleColor); // Update circles based on the age
    setInterval(() => updateCircles(birthdate, lifespan, circleColor), 1000); // Update circles every second
  }
});