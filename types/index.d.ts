declare module 'react-native-get-music-files' {
  interface Options {
    title?: boolean;
    artist?: boolean;
    duration?: boolean;
    blured?: boolean;
    id?: boolean;
    cover?: boolean;
    genre?: boolean;
    album?: boolean;
    batchNumber?: number;
    minimumSongDuration?: number;

    coverFolder?: string;
    coverResizeRatio?: number;
    icon?: boolean;
    iconSize?: number;
    coverSize?: number;
    delay?: number;

    fields?: Array<string>; // iOS
  }

  interface Track {
    title: string;
    author: string;
    path: string;
    duration: number;
    cover: string;
    artwork: string;
  }

  function getAll(options: Options): Promise<Array<Track>>;
}

declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
