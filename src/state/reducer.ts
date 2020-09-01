import produce from 'immer';
import { Action, StoreState } from '../types';
import { initialState } from './storage';

const MAX_QUEUE_SIZE = 50;

function volumeReducer(state: StoreState['volume'], action: Action) {
  switch (action.type) {
    case 'CHANGE_VOLUME':
      return produce(state, s => {
        s.amount = Math.max(Math.min(action.volume, 1), 0);
      });

    case 'MUTE':
      return produce(state, s => {
        s.muted = action.muted;
      });

    default:
      return state;
  }
}

function sortReducer(state: StoreState['sort'], action: Action) {
  switch (action.type) {
    case 'SET_SORT':
      return produce(state, s => {
        s.column = action.column;
        s.direction = action.direction;
      });

    default:
      return state;
  }
}

function shuffleReducer(state: StoreState['shuffle'], action: Action) {
  switch (action.type) {
    case 'SET_SHUFFLE':
      return action.shuffle;

    default:
      return state;
  }
}

function historyReducer(state: StoreState['history'], action: Action) {
  switch (action.type) {
    case 'ADD_TO_HISTORY': {
      const cache = new Set<string>([action.search, ...state]);
      return Array.from(cache).slice(0, MAX_QUEUE_SIZE);
    }

    case 'REMOVE_FROM_HISTORY':
      return produce(state, s => {
        const idx = s.indexOf(action.search);
        s.splice(idx, 1);
      });

    default:
      return state;
  }
}

function downloadReducer(state: StoreState['download'], action: Action) {
  switch (action.type) {
    case 'DOWNLOAD_ADD':
      return produce(state, s => {
        s.queue.push(action.id);
      });

    case 'DOWNLOAD_PROGRESS':
      return produce(state, s => {
        s.progress = action.progress;
      });

    default:
      return state;
  }
}

function serverReducer(state: StoreState['yt'], action: Action) {
  switch (action.type) {
    case 'SET_LYRA_URL':
      return produce(state, s => {
        s.url = action.url;
      });

    case 'SET_LYRA_API':
      return produce(state, s => {
        s.api = action.api;
      });

    default:
      return state;
  }
}

function loadReducer(state: StoreState, action: Action) {
  switch (action.type) {
    case 'LOAD_STORAGE':
      return {
        ...action.state,
        loaded: true
      };

    case 'CLEAR_DATA':
      return {
        ...initialState,
        loaded: true
      };

    default:
      return state;
  }
}

function queueReducer(state: StoreState['queue'], action: Action) {
  switch (action.type) {
    case 'SKIP_PREVIOUS': {
      if (state.curr == null) {
        // Nothing playing right now
        return state;
      }

      if (state.prev.length === 0) {
        return state;
      }

      return produce(state, s => {
        if (s.curr != null) {
          s.next.unshift(s.curr);
        }
        const sid = s.prev.pop();
        s.curr = sid ?? null;
      });
    }

    case 'SKIP_NEXT': {
      // Middleware: queues song if next is empty
      if (state.next.length === 0) {
        return state;
      }

      return produce(state, s => {
        if (s.curr != null) {
          s.prev.push(s.curr);

          // Clean cache
          const prev = s.prev.splice(-MAX_QUEUE_SIZE);
          for (let sid of s.prev) {
            if (s.cache[sid] != null) {
              if (s.cache[sid].count === 1) {
                delete s.cache[sid];
              } else {
                s.cache[sid].count--;
              }
            }
          }

          s.prev = prev;
        }
        s.curr = s.next.shift() ?? null;
      });
    }

    default:
      return state;
  }
}

export default function rootReducer(
  state: StoreState = initialState,
  action: Action
): StoreState {
  state = loadReducer(state, action);
  state = produce(state, s => {
    s.shuffle = shuffleReducer(s.shuffle, action);
    s.sort = sortReducer(s.sort, action);
    s.history = historyReducer(s.history, action);
    s.volume = volumeReducer(s.volume, action);
    s.download = downloadReducer(s.download, action);
    s.yt = serverReducer(s.yt, action);
    s.queue = queueReducer(s.queue, action);
  });

  switch (action.type) {
    case 'SELECT_SONG': {
      const { id } = action.song;

      return produce(state, s => {
        if (s.queue.curr != null) {
          s.queue.prev.push(s.queue.curr);
          s.queue.prev = s.queue.prev.slice(-MAX_QUEUE_SIZE);
        }
        s.queue.curr = id;
        s.queue.next = [];

        if (s.songs[id] != null) {
          return s;
        }

        if (s.queue.cache[id] != null) {
          s.queue.cache[id].count++;
          return s;
        }

        s.queue.cache[id] = {
          song: action.song,
          count: 1
        };
      });
    }

    case 'ADD_SONGS': {
      return produce(state, s => {
        for (let song of action.songs) {
          s.songs[song.id] = song;

          // Remove from cache
          delete s.queue.cache[song.id];
        }
      });
    }

    case 'REMOVE_SONG': {
      const { songs } = state;
      const sid = action.id;

      if (songs[sid] == null) {
        console.error('song missing');
        return state;
      }

      return produce(state, s => {
        delete s.songs[sid];

        // Remove from queue
        s.queue.prev = s.queue.prev.filter(i => i !== sid);
        if (s.queue.curr === sid) {
          s.queue.curr = null;
        }
        s.queue.next = s.queue.next.filter(i => i !== sid);
      });
    }

    case 'CREATE_PLAYLIST':
      return produce(state, s => {
        const { playlist } = action;
        if (s.playlists[playlist.id] != null) {
          console.error('duplicate playlist');
          return s;
        }
        s.playlists[playlist.id] = playlist;

        for (let sid of playlist.songs) {
          if (s.songs[sid] != null) {
            if (!s.songs[sid].playlists.includes(playlist.id)) {
              s.songs[sid].playlists.push(playlist.id);
            } else {
              console.error('song already in new playlist');
            }
          } else {
            console.error('missing song for playlist');
          }
        }
      });

    case 'DELETE_PLAYLIST':
      return produce(state, s => {
        const pid = action.id;

        for (let sid of s.playlists[pid].songs) {
          const idx = s.songs[sid].playlists.indexOf(pid);
          if (idx >= 0) {
            s.songs[sid].playlists.splice(idx, 1);
          }
        }

        delete s.playlists[pid];
      });

    case 'UPDATE_SONG_PLAYLISTS': {
      const { sid, added, removed } = action;

      const song = state.songs[sid];

      // Invalid song ID
      if (song == null) {
        console.error('song is null');
        return state;
      }

      return produce(state, s => {
        // Update pids to song
        const pids = new Set(s.songs[sid].playlists);
        added.forEach(a => pids.add(a));
        removed.forEach(r => pids.delete(r));

        s.songs[sid].playlists = [...pids];

        // Update sid to playlists
        for (let pid of added) {
          if (s.playlists[pid] != null) {
            // Check for dup
            if (!s.playlists[pid].songs.includes(sid)) {
              s.playlists[pid].songs.push(sid);
            } else {
              console.error('adding song twice to playlist');
            }
          } else {
            console.error('missing playlist for added');
          }
        }

        for (let pid of removed) {
          if (s.playlists[pid] != null) {
            // Check for dup
            const idx = s.playlists[pid].songs.indexOf(sid);
            if (idx >= 0) {
              s.playlists[pid].songs.splice(idx, 1);
            } else {
              console.error('song not in playlist');
            }
          } else {
            console.error('missing playlist for removed');
          }
        }
      });
    }

    case 'UPDATE_PLAYLIST': {
      const { pid, added, removed } = action;

      const playlist = state.playlists[pid];

      // Invalid song ID
      if (playlist == null) {
        console.error('playlist is null');
        return state;
      }

      return produce(state, s => {
        // Update sids to playlist
        const sids = new Set(s.playlists[pid].songs);
        added.forEach(a => sids.add(a));
        removed.forEach(r => sids.delete(r));

        s.playlists[pid].songs = [...sids];

        // Update pid to songs
        for (let sid of added) {
          if (s.songs[sid] != null) {
            // Check for dup
            if (!s.songs[sid].playlists.includes(pid)) {
              s.songs[sid].playlists.push(pid);
            } else {
              console.error('adding playlist twice to song');
            }
          } else {
            console.error('missing song for added');
          }
        }

        for (let sid of removed) {
          if (s.songs[sid] != null) {
            // Check for dup
            const idx = s.songs[sid].playlists.indexOf(pid);
            if (idx >= 0) {
              s.songs[sid].playlists.splice(idx, 1);
            } else {
              console.error('playlist not in song');
            }
          } else {
            console.error('missing song for removed');
          }
        }
      });
    }

    case 'UPDATE_TAGS': {
      const sid = action.id;
      if (state.songs[sid] == null) {
        return state;
      }

      return produce(state, s => {
        s.songs[sid].title = action.title;
        s.songs[sid].artist = action.artist;
      });
    }

    case 'QUEUE_SONG': {
      const { song } = action;

      return produce(state, s => {
        s.queue.next.push(song.id);
        if (s.songs[song.id] != null) {
          // Song in library
          return s;
        }

        if (s.queue.cache[song.id] != null) {
          // Song in cache
          s.queue.cache[song.id].count++;
          return s;
        }

        // Add to cache
        s.queue.cache[song.id] = {
          song,
          count: 1
        };
      });
    }

    case 'DOWNLOAD_FINISH':
      return produce(state, s => {
        s.download.queue.shift();
        s.download.progress = 0;

        const { song } = action;
        if (song != null) {
          s.songs[song.id] = song;
        }
      });

    default:
      return state;
  }
}
