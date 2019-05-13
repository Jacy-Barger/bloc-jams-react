import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import albumData from './../data/albums';


class Library extends Component {
  constructor(props) {
     super(props);
     this.state = { albums: albumData };
   }

   render() {
    return (
      <div className="main-library">
      <p className="featured">Featured Albums</p>
      <section className='library'>
      {
        this.state.albums.map( (album, index) =>
        <Link to={`/album/${album.slug}`} key={index}>
          <div className="album-container">
            <img src={album.albumCover} alt={album.title} />
             <div className="album-path">{album.title}</div>
             <div className="album-path">{album.artist}</div>
             <div className="album-path">{album.songs.length} songs</div>
          </div>
        </Link>
        )
      }
      </section>
      </div>
     );
   }
 }

export default Library;
