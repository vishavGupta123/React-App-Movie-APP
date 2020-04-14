import React from "react";
import { data } from "../data";
import Navbar from "./Navbar";
import MovieCard from "./MovieCart";
import { addMovies, addFavourite, setShowFavourites } from "../actions";
import { StoreContext } from "../index";

class App extends React.Component {
  componentDidMount() {
    const { store } = this.props;
    store.subscribe(() => {
      console.log("UPDATED");
      this.forceUpdate();
    });
    //make api call
    //dispatch action
    store.dispatch(addMovies(data));
    console.log("STATE", this.props.store.getState()); //list:[], favourites: []
  }
  isMovieFavourite = (movie) => {
    const { movies } = this.props.store.getState();

    const index = movies.favourites.indexOf(movie);

    if (index !== -1) {
      //found the movie
      return true;
    }
    return false;
  };
  onChangeTab = (val) => {
    this.props.store.dispatch(setShowFavourites(val));
  };
  render() {
    console.log("****,Props inside the App Component,", this.props);
    const { movies, search } = this.props.store.getState();
    const { list, favourites, showFavourites } = movies; //
    console.log("RENDER");
    const displayMovies = showFavourites ? favourites : list;
    console.log(this.props.store.getState());
    return (
      <div className="App">
        <Navbar dispatch={this.props.store.dispatch} search={search} />
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
                dispatch={this.props.store.dispatch}
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
class AppWrapper extends React.Component {
  render() {
    return (
      <StoreContext.Consumer>
        {(store) => {
          return <App store={store}></App>;
        }}
      </StoreContext.Consumer>
    );
  }
}

export default AppWrapper;
