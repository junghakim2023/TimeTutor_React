import React, {useState, useEffect} from 'react';
import './App.css';
import './index.css';
import './assets/dist/css/bootstrap.min.css'
import Auth from './component/Auth.js'
import TutorChat from './component/TutorChat.js'

export default class App extends React.Component {
  constructor(props){
      super(props);
      this.state = {
          login:null
        };
    }

    highFunction = (data) => {
      this.setState({ login: data }, () => {
      });
    }

    render(){
        return (
          <div style={{ height: '100%', paddingBottom: '0px' }}>
              <header>
                <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                  <div className="container-fluid">
                    <a className="navbar-brand" href="/">Time tutor</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarCollapse">
                      <ul className="navbar-nav me-auto mb-2 mb-md-0">
                        <li className="nav-item">
                          <a className="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link comming-soon">App Download</a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link comming-soon" tabIndex="-1">Upload File</a>
                        </li>
                      </ul>
                      <Auth propFunction={this.highFunction}/>
                    </div>
                  </div>
                </nav>
              </header>
              <TutorChat value ={this.state.login}/>
          </div>
      );
    }

};



