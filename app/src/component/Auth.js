import React from 'react';
import $ from 'jquery';
import * as Utils from '../logic/UtilFunc.js'


export default class Auth extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loginServerURL: null
          };


        $('.comming-soon').click(function() {alert("Comming soon!")}); 
      }

    componentDidMount() {
        this.initPage();      
        this.checkLogin();
    }
  
    loginBtn(){
        window.location.href = this.state.loginServerURL + "?redirection="+window.location.href;
    }

    initPage(){
        $.ajax({
            url: 'http://localhost:8083/init',
            type: 'GET',
            header: {'Access-Control-Allow-Origin': "*"},
            xhrFields: {
                withCredentials: true,
            },
            success: (data, status, request) => {
                this.setState({ loginServerURL: data.loginURL });
                console.log(data.loginURL);
            },
            error: (request, textStatus, error) => {
                Utils.printError(request, textStatus, error);
            }
        });
    }

      checkLogin(){
            
      }

      logout(){
          localStorage.setItem('accessToken', null);
          localStorage.setItem('refreshToken', null);
          localStorage.setItem('userName', null);
          //setLoginStatus(false);
          window.location.href="/";
        }

      render() {
        return (
            <div>
            <span style={{ width: '10px' }}></span>
            <li className="nav-link active" id="welcomeText" style={{ display: 'none' }}>Welcome! </li>
            <button className="btn btn-outline-success comming-soon">Signup</button>
            <span style={{ width: '10px' }}></span>
            <button onClick={()=> this.loginBtn()}   className="btn btn-outline-success" id="loginBtn">Login</button>
            <button onClick={()=> this.logoutBtn()}   className="btn btn-outline-success" style={{ display: 'none' }} id="logoutBtn">Logout</button>
            </div>
        );
      }
    }