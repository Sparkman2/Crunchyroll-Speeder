window.onload = function() {
    const videoPlayer = document.querySelector('video');
    if (videoPlayer != null) {
        videoPlayer.addEventListener('loadeddata', function() {
            getOrUpdatePlaybackValue(this, '');
        });
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    const videoPlayer = document.querySelector('video');
    if (videoPlayer && request.playbackRate !== undefined) {
        videoPlayer.playbackRate = checkLimit(request.playbackRate);
        getOrUpdatePlaybackValue(videoPlayer, request.playbackRate);
        DisplayPlayback(videoPlayer, request.playbackRate);
        sendResponse({status: 'Playback speed changed to ' + request.playbackRate});
    }
});

function DisplayPlayback(videoPlayer, playbackRate) {
    const container = document.createElement('div');
    container.id = 'cr-playback-speed';
    const text = document.createTextNode(`${playbackRate}x playback speed`);
    container.append(text);
    container.style.fontFamily= 'Helvetica, serif';
    container.style.fontSize = '15px';
    container.style.color = '#f47521';
    container.style.position = 'absolute';
    container.style.zIndex = 1;
    container.style.top = '0px';
    container.style.right = '0px';
    container.style.margin = '5px';
    videoPlayer.parentElement.append(container);
    setTimeout(function() {
        const playbackContainer = document.querySelector('#cr-playback-speed');
        playbackContainer.remove();
    }, 500);
}

function checkLimit(playbackRate) {
    playbackRate = playbackRate < 0 ? 1.0 : playbackRate;
    playbackRate = playbackRate > 2 ? 2.0 : playbackRate;
    return playbackRate;
}

function getOrUpdatePlaybackValue(videoPlayer, playbackValue) {
    if (playbackValue) {
        localStorage.setItem('cr_playback_speed', playbackValue);
    } else {
        let existingSpeed = localStorage.getItem('cr_playback_speed');
        videoPlayer.playbackRate = (existingSpeed) === null ? 1.0 : checkLimit(existingSpeed);
    }
    return;
};