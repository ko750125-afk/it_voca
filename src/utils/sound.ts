import { createAudioPlayer, AudioPlayer } from 'expo-audio';

const whooshSource = require('../../assets/sounds/card-whoosh.wav');
const clickSource = require('../../assets/sounds/button-click.wav');

let whooshPlayer: AudioPlayer | null = null;
let clickPlayer: AudioPlayer | null = null;

function getWhooshPlayer(): AudioPlayer {
  if (!whooshPlayer) {
    whooshPlayer = createAudioPlayer(whooshSource);
  }
  return whooshPlayer;
}

function getClickPlayer(): AudioPlayer {
  if (!clickPlayer) {
    clickPlayer = createAudioPlayer(clickSource);
  }
  return clickPlayer;
}

/**
 * 카드가 넘어갈 때 / 뒤집힐 때 나는 경쾌한 "휘익~" 소리
 */
export const playCardWhoosh = () => {
  try {
    const player = getWhooshPlayer();
    player.seekTo(0);
    player.play();
  } catch {
    // 오디오 에러 무시
  }
};

/**
 * 모든 일반 버튼, 바로가기, 카드 클릭 시 나는 깔끔한 탭 사운드
 */
export const playButtonClick = () => {
  try {
    const player = getClickPlayer();
    player.seekTo(0);
    player.play();
  } catch {
    // 오디오 에러 무시
  }
};
