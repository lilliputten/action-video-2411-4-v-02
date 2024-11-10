// @ts-check
/* eslint-disable no-console */
/* globals useLocalVideo, questions, comms, answers */
/* exported onYouTubePlayerAPIReady */

const buttons = /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.btn'));
const white = /** @type {HTMLElement} */ (document.querySelector('.white'));
const none = /** @type {HTMLElement} */ (document.querySelector('.none'));
const question = /** @type {HTMLElement} */ (document.querySelector('.que'));
const comm = /** @type {HTMLElement} */ (document.querySelector('.comm'));
const start = /** @type {HTMLElement} */ (document.querySelector('.start'));
const startButton = /** @type {HTMLElement} */ (document.querySelector('.start-button'));
const end = /** @type {HTMLElement} */ (document.querySelector('.end'));
const error = /** @type {HTMLElement} */ (document.querySelector('.error'));

const videoNode = /** @type {HTMLVideoElement} */ (document.querySelector('video.video'));
const videoSource = document.createElement('source');

let changed = 0;

/** Youtube video ids */
const ytVideos = [
  // prettier-ignore
  '3ZyiYJ1Ashc',
  'DtrK8e03Ri0',
  '6twkdANujAo',
  'JI1t4ocnceM',
];

/** Local video files */
const localVideos = [
  // Local videos,,,
  'videos/1.mp4',
  'videos/2.mp4',
  'videos/3.mp4',
  'videos/4.mp4',
];

let level = 0;

/** @type {InstanceType<typeof window.YT.Player>} */
let ytPlayer;

function pauseVideo() {
  console.log('[pauseVideo]');
  if (useLocalVideo) {
    videoNode.pause();
  } else {
    ytPlayer.pauseVideo();
  }
}

function playVideo() {
  console.log('[playVideo]');
  if (useLocalVideo) {
    videoNode.play();
  } else {
    ytPlayer.playVideo();
  }
}

function replayVideo() {
  console.log('[replayVideo]');
  if (useLocalVideo) {
    videoNode.pause();
    videoNode.currentTime = 0;
    videoNode.play();
  } else {
    ytPlayer.seekTo(0, true);
    ytPlayer.playVideo();
  }
}

function initPlayer() {
  console.log('[initPlayer]');
  changeVideo();
  pauseVideo();
  document.addEventListener('transitionstart', (ev) => {
    const { target, propertyName } = ev;
    if (propertyName == 'opacity') {
      if (target == white) {
        playVideo();
      }
    }
  });
  document.addEventListener('transitionend', (ev) => {
    const { propertyName } = ev;
    const eventTarget = /** @type {HTMLElement} */ (ev.target);
    if (propertyName == 'opacity') {
      hide(eventTarget);
      eventTarget.classList.remove('no-op');
      if (eventTarget == white) {
        changeTexts();
      }
    }
  });
}

/** @param {MouseEvent} ev */
function main(ev) {
  const eventTarget = /** @type {HTMLElement} */ (ev.target);
  console.log('[main]', {
    eventTarget,
  });
  if (eventTarget.classList.contains('start-button')) {
    console.log('[main] start-button');
    playVideo();
    noOp(start);
  } else if (eventTarget.classList.contains('end-button')) {
    console.log('[main] end (reload)');
    location.reload();
  } else if (findTarget(ev)) {
    console.log('[main] other');
    if (changed == 0) {
      changed = 1;
      changeLevel();
      changeVideo();
      playVideo();
    }
    replayVideo();
    noOp(white);
  } else {
    console.log('[main] else (???)');
    return false;
  }
}

/** @param {HTMLElement} tar */
function hide(tar) {
  tar.classList.add('hide');
}

/** @param {HTMLElement} tar */
function noOp(tar) {
  tar.classList.add('no-op');
}

/** @param {HTMLElement} tar */
function show(tar) {
  tar.classList.remove('hide');
}

function playerChange() {
  const state = ytPlayer.getPlayerState();
  if (state === 0) {
    handleVideoEnd();
  } else if (state === 1) {
    show(none);
    // playVideo();
  }
}

/** @param {MouseEvent} ev */
function findTarget(ev) {
  const eventTarget = /** @type {HTMLElement} */ (ev.target);
  if (eventTarget.classList.contains('btn')) {
    return true;
  } else {
    return false;
  }
}

function changeVideo() {
  console.log('[changeVideo]', {
    useLocalVideo,
    level,
  });
  if (useLocalVideo) {
    const videoUrl = localVideos[level];
    console.log('[changeVideo] local', {
      videoUrl,
    });
    videoSource.setAttribute('src', videoUrl);
    videoNode.load();
  } else {
    const videoId = ytVideos[level];
    console.log('[changeVideo] youtube', {
      videoId,
    });
    ytPlayer.loadVideoById(videoId);
  }
  return true;
}

function changeLevel() {
  level++;
  return true;
}

function changeQuestion() {
  question.innerText = questions[level];
  return true;
}

function changeAnswers() {
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].innerText = answers[level][i];
    buttons[i].classList.toggle('selected', false);
  }
}

function changeComm() {
  comm.innerText = comms[level];
}

function changeTexts() {
  changeQuestion();
  changeAnswers();
  changeComm();
}

function checkComm() {
  if (level < comms.length) {
    if (comms[level].length == 0) {
      hide(comm);
    } else {
      show(comm);
    }
  }
}

function checkFinish() {
  if (level == answers.length) {
    show(end);
  }
}

function handleVideoEnd() {
  console.log('[handleVideoEnd]');
  changed = 0;
  checkComm();
  checkFinish();
  show(white);
}

/** @param {ErrorEvent} ev */
function handleVideoError(ev) {
  const { src } = videoSource;
  // eslint-disable-next-line no-console
  console.log('[handleVideoError]', {
    src,
    ev,
    videoSource,
  });
  debugger; // eslint-disable-line no-debugger
  error.innerText = 'Ошибка загрузки видео "' + src + '"';
  show(error);
}

// eslint-disable-next-line no-unused-vars
function onYouTubePlayerAPIReady() {
  ytPlayer = new window.YT.Player('ytplayer', {
    videoId: ytVideos[0],
    playerVars: { controls: 0, showinfo: 0 },
    events: {
      onStateChange: playerChange,
      onReady: initPlayer,
    },
  });
  ytPlayer.getIframe().classList.add('player');
  show(document.getElementById('ytplayer'));
  show(startButton);
  document.addEventListener('click', main);
}

function onYoutubePlayerReady() {
  const tag = document.createElement('script');
  tag.src = 'https://youtube.com/player_api';
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onLocalPlayerReady() {
  videoSource.setAttribute('type', 'video/mp4');
  videoNode.appendChild(videoSource);
  videoNode.addEventListener('ended', handleVideoEnd);
  videoSource.addEventListener('error', handleVideoError);
  show(videoNode);
  initPlayer();
  show(startButton);
  document.addEventListener('click', main);
}

if (useLocalVideo) {
  window.addEventListener('load', onLocalPlayerReady);
} else {
  window.addEventListener('load', onYoutubePlayerReady);
}
