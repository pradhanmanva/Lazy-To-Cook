import React, { Component } from 'react';
import Navbar from "./components/commons/Navbar";
import AuthenticationHome from "./components/auth/AuthenticationHome";
import RestaurantHome from "./components/restaurant/RestaurantHome";
import UserHome from "./components/user/UserHome";
import { BrowserRouter, Route } from "react-router-dom";
import './App.css';

const queryString = require('query-string');

class App extends Component {

  render() {
    return (
      <div className="App">
        <BrowserRouter basename="/app">
          <div>
            <Route exact path="/" component={LandingPage} />
            <Route path="/admin/:id" component={RestaurantHome} />
            <Route path="/user/:id" component={UserHome} />
          </div>
        </BrowserRouter>
        
        <div className="footer">
          <div>App logo made by <a rel="noopener noreferrer" href="https://www.flaticon.com/authors/baianat" title="Baianat">Baianat</a> from <a rel="noopener noreferrer" href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a rel="noopener noreferrer" href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>
        </div>
      </div>
    );
  }
}

const LandingPage = ({location}) => {
  const queryParameters = queryString.parse(location.search);
  
  return (
    <div>
      <Navbar isLoggedIn={false}></Navbar>
      <AuthenticationHome 
        type={queryParameters.type ? queryParameters.type : "user"} 
        method={queryParameters.method ? queryParameters.method : "signin"} />
    </div>
  );
}

export default App;
