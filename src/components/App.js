import React from "react";
import { data } from "../data";
import Navbar from "./Navbar";
import MovieCard from "./MovieCart";
import { addMovies, addFavourite, setShowFavourites } from "../actions";
import { StoreContext, connect } from "../index";

class App extends React.Component {
  componentDidMount() {
    //  this.props.subscribe(() => this.forceUpdate());
    //make api call
    //dispatch action
    this.props.dispatch(addMovies(data));
    console.log("STATE", this.props); //list:[], favourites: []
  }
  isMovieFavourite = (movie) => {
    const { movies } = this.props;

    const index = movies.favourites.indexOf(movie);

    if (index !== -1) {
      //found the movie
      return true;
    }
    return false;
  };
  onChangeTab = (val) => {
    this.props.dispatch(setShowFavourites(val));
  };
  render() {
    console.log("****,Props inside the App Component,", this.props);
    const { movies, search } = this.props;
    const { list, favourites, showFavourites } = movies; //
    console.log("RENDER");
    const displayMovies = showFavourites ? favourites : list;
    console.log(this.props);
    return (
      <div className="App">
        <Navbar />
        <div className="main">
          <div className="tabs">
            <div
              className={`tab ${showFavourites ? "" : "active-tabs"}`}
              onClick={() => this.onChangeTab(false)}
            >
              Movies
            </div>
            <div
              className={`tab ${showFavourites ? "active-tabs" : ""}`}
              onClick={() => this.onChangeTab(true)}
            >
              Favourites
            </div>
          </div>
          <div className="list">
            {displayMovies.map((movie, index) => (
              <MovieCard
                movie={movie}
                key={`movies-${index}`}
                dispatch={this.props.dispatch}
                isFavourite={this.isMovieFavourite(movie)}
              />
            ))}
          </div>
          {displayMovies.length === 0 ? (
            <div className="no-movies">No Movies To Display! </div>
          ) : null}
        </div>
      </div>
    );
  }
}

const ConnectedToStoreApp = connect(function (state) {
  return {
    movies: state.movies,
    search: state.search,
  };
})(App);

export default ConnectedToStoreApp;

//connect will solve:
//* give me data from store
//* provide dispatch as props
// *subscribe to store as well
