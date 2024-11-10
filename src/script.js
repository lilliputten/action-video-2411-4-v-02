// @ts-check
/* eslint-disable no-console */
/* globals useLocalVideo, txt_que,txt_vars */
/* exported onYouTubePlayerAPIReady */

const buttons = /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.btn'));
const white = /** @type {HTMLElement} */ (document.querySelector('.white'));
// const none = [>* @type {HTMLElement} <] (document.querySelector('.none'));
const question = /** @type {HTMLElement} */ (document.querySelector('.que'));
const comm = /** @type {HTMLElement} */ (document.querySelector('.comm'));
const start = /** @type {HTMLElement} */ (document.querySelector('.start'));
const end = /** @type {HTMLElement} */ (document.querySelector('.end'));
// const retry = [>* @type {HTMLElement} <] (document.querySelector('.retry'));
// const retryBtn = [>* @type {HTMLElement} <] (document.querySelector('.retry-button'));

const startButton = /** @type {HTMLElement} */ (document.querySelector('.start-button'));
const error = /** @type {HTMLElement} */ (document.querySelector('.error'));

const videoNode = /** @type {HTMLVideoElement} */ (document.querySelector('video.video'));
const videoSource = document.createElement('source');

const answ = [1, 3, 2, 2];

// let started = 1;
let changed = 0;
// let states = [];
// let timeout;

let blocked = 0;

/** Youtube video ids */
const ytVideos = [
  // prettier-ignore
  'JMalLaybRiw',
  'PjhYcqH1hV4',
  'KCo4-0cQBL8',
  'RtnA2sdyXKU',
  'WVoPIdmNu3Y',
];

/** Local video files */
const localVideos = [
  // Local videos,,,
  'videos/1.mp4',
  'videos/2.mp4',
  'videos/3.mp4',
  'videos/4.mp4',
  'videos/5.mp4',
];

// const questions = [];
// const comms = ['', '', ''];
// const answers = [];

let level = 0;
let target = null;
let counter = null;

/** @type {InstanceType<typeof window.YT.Player>} */
let ytPlayer;

function changeTexts() {
  /* // ORIG
  question.innerText = txt_que[level];
  buttons.forEach((item, i) => {
    item.innerText = txt_vars[level][i];
  });
  */
  const text = txt_que[level];
  const vars = txt_vars[level];
  if (!text || !vars) {
    // The last level?
    console.warn('Invalid level index (is it the last one?)', {
      level,
    });
    return;
  }
  console.log('[changeTexts]', {
    level,
    text,
    vars,
  });
  question.innerText = text;
  buttons.forEach((item, i) => {
    item.classList.toggle('selected', false);
    item.innerText = vars[i];
  });
}

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
  changeVideo();
  pauseVideo();
  changeTexts();
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
      changeTexts();
      eventTarget.classList.remove('selected');
      comm.classList.add('no-op');
      if (eventTarget == white) {
        // changeTexts();
      }
    }
  });
}

function findCounter() {
  counter = null;
  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i] == target) {
      counter = i;
    }
  }
}

let answer = null;

function checkAnswer() {
  answer = null;
  if (answ[level - 1] == counter + 1) {
    answer = true;
  } else {
    answer = false;
  }
}

document.addEventListener('click', main);

/** @param {MouseEvent} ev */
function main(ev) {
  const eventTarget = /** @type {HTMLElement} */ (ev.target);
  console.log('[main]', {
    blocked,
    changed,
    eventTarget,
  });
  if (blocked == 1) {
    return false;
  }
  if (/* started == 1 && */ eventTarget.classList.contains('start-button')) {
    console.log('[main] start-button');
    playVideo();
    noOp(start);
    blocked = 1;
  } else if (eventTarget.classList.contains('end-button')) {
    console.log('[main] end (reload)');
    location.reload();
    blocked = 1;
  } else if (findTarget(ev)) {
    console.log('[main] other');
    blocked = 1;
    // clearTimeout(timeout);
    changed = 1;
    changeLevel('+');
    findCounter();
    checkAnswer();
    target.classList.add('selected');
    if (answer == true) {
      comm.innerText = 'Вы ответили правильно!';
      comm.classList.add('true');
    } else {
      comm.classList.remove('true');
      comm.innerText = 'Вы ответили неправильно!';
    }
    comm.classList.remove('no-op');
    setTimeout(() => {
      changeVideo();
      replayVideo();
      noOp(white);
    }, 1500);
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
  console.log('[playerChange]', {
    state,
  });
  // states.push(state);
  // if (states.length == 3) {
  //   started = 1;
  // }
  if (state == 0) {
    handleVideoEnd();
  } else if (state == 1) {
    // show(none);
  }
}

/** @param {MouseEvent} ev */
function findTarget(ev) {
  const eventTarget = /** @type {HTMLElement} */ (ev.target);
  if (eventTarget.classList.contains('btn')) {
    target = eventTarget;
    return true;
  } else {
    target = null;
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

/** @param {'+'|'-'} direction */
function changeLevel(direction) {
  switch (direction) {
    case '+':
      level++;
      break;
    case '-':
      level--;
      break;
  }
}

/* // UNUSED
 * function changeAnswers() {
 *   if (answers[level]) {
 *     for (let i = 0; i < buttons.length; i++) {
 *       buttons[i].innerHTML = answers[level][i];
 *     }
 *   }
 * }
 * function changeComm() {
 *   comm.innerText = comms[level];
 * }
 * function checkComm() {
 *   if (level < comms.length) {
 *     // if (comms[level].length == 0) {
 *     // hide(comm);
 *     // } else {
 *     // show(comm);
 *     // }
 *   }
 * }
 */

function checkFinish() {
  if (level == answ.length) {
    show(end);
  }
}

function handleVideoEnd() {
  console.log('[handleVideoEnd]');
  blocked = 0;
  changed = 0;
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
    playerVars: { showinfo: 0 },
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
