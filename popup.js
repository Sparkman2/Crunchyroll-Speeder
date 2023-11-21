document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('speedSlider');
    const display = document.getElementById('speedDisplay');
    const speedButtons = document.querySelectorAll('.speedButton');

    // Update display and send message when the slider is moved
    slider.oninput = function() {
        display.textContent = this.value + 'x';
        sendMessage(this.value);
    };

    // Set up click events for each speed button
    speedButtons.forEach(button => {
        button.addEventListener('click', function() {
            const speed = this.getAttribute('data-speed');
            slider.value = speed;
            display.textContent = speed + 'x';
            sendMessage(speed);
        });
    });

    function sendMessage(speed) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {playbackRate: parseFloat(speed)});
        });
    }
});
