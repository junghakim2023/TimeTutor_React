import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './assets/dist/css/bootstrap.min.css'
import reportWebVitals from './reportWebVitals';
import Auth from './component/Auth.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
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
              <Auth/>
            </div>
          </div>
        </nav>
      </header>
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
