import React, { Component } from 'react';
import albumData from './../data/albums';
import PlayerBar from './PlayerBar';

class Album extends Component {
  constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    this.state = {
     album: album,
     currentSong: album.songs[0],
     currentTime: 0,
     duration: album.songs[0].duration,
     volume: .50,
     isPlaying: false,
     hovered: '',
     isPaused: false,
    };

    this.audioElement = document.createElement('audio');
    this.audioElement.src = album.songs[0].audioSrc;
}

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }

  pause() {
      this.audioElement.pause();
      this.setState({ isPlaying: false });
      this.setState({ isPaused: true});
    }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      },
      volumeupdate: e => {
        this.setState({ volume: this.audioElement.volume });
      },
    };

    this.audioElement.volume = this.state.volume;
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
    this.audioElement.addEventListener('volumeupdate', this.eventListeners.volumeupdate);
  }

   componentWillUnmount() {
     this.audioElement.src = null;
     this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
     this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
     this.audioElement.removeEventListener('volumeupdate', this.eventListeners.volumeupdate);
  }

  setSong(song) {
     this.audioElement.src = song.audioSrc;
     this.setState({ currentSong: song });
   }

   handleSongClick(song) {
     const isSameSong = this.state.currentSong === song;
     if (this.state.isPlaying && isSameSong) {
      this.pause();
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play();
    }
   }

   handlePrevClick() {
     const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
     const newIndex = Math.max(0, currentIndex - 1);
     const newSong = this.state.album.songs[newIndex];
     this.setSong(newSong);
     this.play();
    }

    handleNextClick() {
      const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
      const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1);
      const newSong = this.state.album.songs[newIndex];
      this.setSong(newSong);
      this.play();
    }

    handleTimeChange(e) {
      const newTime = this.audioElement.duration * e.target.value;
      this.audioElement.currentTime = newTime;
      this.setState({ currentTime: newTime });
    }

    handleVolumeChange(e) {
      const newVolume = e.target.value;
      this.audioElement.volume = newVolume;
      this.setState({ volume: newVolume});
    }

    formatTime(time) {
    return time ? `${Math.floor(time / 60)}:${Number(time % 60 / 100).toFixed(2).substr(2,3)}` : '-:--'
  }

   mouseOver(index) {
     this.setState({
       hovered: index
     })
   }

   mouseLeave() {
     this.setState({
       hovered: ''
     })
   }

   displayPlay(song, index) {
     if (this.state.isPlaying && this.state.currentSong === song) {
       return <span className="icon ion-md-pause"></span>
     }

     if (this.state.isPaused && this.state.currentSong === song) {
       return <span className="icon ion-md-play"></span>
     }

     if (this.state.hovered === index) {
       return <span className="icon ion-md-play"></span>
     }

     return index + 1;

   }

   render() {
     return (
       <section className="album">
        <section id="album-info">
        <img id="album-cover-art" src={this.state.album.albumCover}
              alt={this.state.album.title}/>
         <div className="album-details">
           <h1 id="album-title">{this.state.album.title}</h1>
           <h2 className="artist">{this.state.album.artist}</h2>
           <div id="release-info">{this.state.album.releaseInfo}</div>
         </div>
        </section>
        <table id="song-list">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>
          <tbody>
          {
            this.state.album.songs.map( (song, index) =>
              <tr className="song" key={index}
                  onClick={() => this.handleSongClick(song)}
                  onMouseOver={() => { this.mouseOver(index) }}
                  onMouseLeave={() => { this.mouseLeave() }}>
                <td className="number-song">{this.displayPlay(song, index)}</td>
                <td className="title-song">{song.title}</td>
                <td className="duration-song">{this.formatTime(song.duration)}</td>
              </tr>
          )
        }
          </tbody>
        </table>
          <PlayerBar
            isPlaying={this.state.isPlaying}
            currentSong={this.state.currentSong}
            currentTime={this.audioElement.currentTime}
            duration={this.audioElement.duration}
            volume={this.audioElement.volume}
            handleSongClick={() => this.handleSongClick(this.state.currentSong)}
            handlePrevClick={() => this.handlePrevClick()}
            handleNextClick={() => this.handleNextClick()}
            formatTime={(time) => this.formatTime(time)}
            handleTimeChange={(e) => this.handleTimeChange(e)}
            handleVolumeChange={(e) => this.handleVolumeChange(e)}
          />
       </section>
     );
   }
 }

 export default Album;
