document.getElementById('save').addEventListener('click', function() {
  const birthdate = document.getElementById('birthdate').value;
  const lifespan = document.getElementById('lifespan').value;
  const bgColor = document.getElementById('bgColor').value;
  const circleColor = document.getElementById('circleColor').value;

  chrome.storage.sync.set({
      birthdate: birthdate,
      lifespan: lifespan,
      bgColor: bgColor,
      circleColor: circleColor
  }, function() {
      alert('Your details have been saved!');
  });
});

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.sync.get(['birthdate', 'lifespan', 'bgColor', 'circleColor'], function(data) {
      document.getElementById('birthdate').value = data.birthdate || '1990-04-13';
      document.getElementById('lifespan').value = data.lifespan || 90;
      document.getElementById('bgColor').value = data.bgColor || '#F5F4EB';
      document.getElementById('circleColor').value = data.circleColor || '#375323';
  });
});