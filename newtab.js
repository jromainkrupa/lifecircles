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

function updateCircles(birthdate, lifespan, circleColor) {
  const container = document.getElementById('circlesContainer');
  container.innerHTML = ''; // Clear previous circles

  const exactAge = calculateExactAge(birthdate);
  const fullYears = Math.floor(exactAge);
  const fractionYear = exactAge - fullYears;

  for (let i = 0; i < lifespan; i++) {
    const circle = document.createElement('div');
    circle.classList.add('circle');
    circle.style.setProperty('--circle-color', circleColor); // Set the circle color


    if (i < fullYears) {
      circle.classList.add('filled');
      circle.style.backgroundColor = circleColor; // Apply circle color
    } else if (i === fullYears) {
      circle.classList.add('partial-fill');
      circle.style.backgroundColor = circleColor;
      circle.style.setProperty('--fill-percentage', fractionYear * 100 + '%');
    }

    container.appendChild(circle);
  }
}

chrome.storage.sync.get(['birthdate', 'lifespan', 'bgColor', 'circleColor'], function(data) {
  const birthdate = data.birthdate || '1990-01-01';
  const lifespan = parseInt(data.lifespan || 90, 10);
  const bgColor = data.bgColor || '#F5F4EB';
  const circleColor = data.circleColor || '#375323';

  document.getElementById('body').style.backgroundColor = bgColor;

  if (birthdate) {
    updateAgeDisplay(birthdate); // Start updating the age counter
    updateCircles(birthdate, lifespan, circleColor); // Update circles based on the age
    setInterval(() => updateCircles(birthdate, lifespan, circleColor), 1000); // Update circles every second
  }
});