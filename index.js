import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

// Media control listeners
TrackPlayer.registerPlaybackService(async () => {
  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener('remote-previous', () => {
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener('remote-next', () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener('remote-jump-backward', interval => {
    const position = TrackPlayer.getPosition();
    TrackPlayer.seekTo(position - interval);
  });

  TrackPlayer.addEventListener('remote-jump-forward', interval => {
    const position = TrackPlayer.getPosition();
    TrackPlayer.seekTo(position + interval);
  });

  TrackPlayer.addEventListener('remote-seek', position => {
    TrackPlayer.seekTo(position);
  });

  TrackPlayer.addEventListener('remote-stop', () => {
    TrackPlayer.destroy();
  });
});
