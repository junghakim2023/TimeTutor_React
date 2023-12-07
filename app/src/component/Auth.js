import React from 'react';
import $ from 'jquery';
import * as Utils from '../logic/UtilFunc.js'

export default class Auth extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loginServerURL: null,
            highFunc : props.propFunction
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
            url: `${process.env.REACT_APP_BACKEND_URL}/init`,
            type: 'GET',
            header: {'Access-Control-Allow-Origin': "*"},
            xhrFields: {
                withCredentials: true,
            },
            success: (data, status, request) => {
                this.setState({ loginServerURL: data.loginURL });
            },
            error: (request, textStatus, error) => {
                Utils.printError(request, textStatus, error);
            }
        });
    }

  renewAccessToken(){
  var refresh = localStorage.getItem('refreshToken');
  refresh = refresh.substr(7);
  $.ajax({
      'url' : `${process.env.REACT_APP_BACKEND_URL}/token/refresh/accessToken`,
      'type' : 'POST',
      'headers': {
        'Access-Control-Allow-Origin': '*',
        ...Utils.getHeaderToken(),
      },
      'data' : {refresh},
      'success' : (data, status, request)=> {
          if (data.accessToken !== 'null' && data.accessToken !== undefined){
              localStorage.setItem('accessToken', "Bearer " + data.accessToken);
              window.location.href = "/";
          }
          
      },
      'error':(request, textStatus, error)=>{
          Utils.printError(request, textStatus, error)
          this.logoutBtn();
      }
      });
}

  requestCheckLogin(){
  var valid = false;

  $.ajax({
      'url' : `${process.env.REACT_APP_BACKEND_URL}/checkLogin`,
      'type' : 'GET',
      'headers': {
        'Access-Control-Allow-Origin': '*',
        ...Utils.getHeaderToken(),
      },
      'success' : (data, status, request) =>{
          if (data === 'VALID') valid = true;
          else if(data === 'EXPIRED')
              this.renewAccessToken();      
          
          this.setLoginStatus(valid);
      },
      'error':(request, textStatus, error)=>{
          Utils.printError(request, textStatus, error)

          this.setLoginStatus(valid);
      }
      });

      return valid;
  }

  setLoginStatus(isLoggedIn){
  if (isLoggedIn){
      $('#loginBtn').css("display", "none");
      $('#logoutBtn').css("display", "block");
      $('#welcomeText').css("display", "block");
      $('#welcomeText').text("Welcome "+ localStorage.getItem('userName') +"!");
      this.state.highFunc(true);
  }
  else{
      $('#loginBtn').css("display", "block");
      $('#logoutBtn').css("display", "none");
      $('#welcomeText').css("display", "none");
      this.state.highFunc(false);
  }
  }

  
  setToken(data){
      if (data.accessToken !== 'null' && data.accessToken !== undefined)
          localStorage.setItem('accessToken', "Bearer " + data.accessToken);
      if (data.refreshToken !== 'null'&& data.refreshToken !== undefined)
          localStorage.setItem('refreshToken', "Bearer " + data.refreshToken);
      if (data.userName !== 'null' && data.userName !== undefined){
          localStorage.setItem('userName', data.userName);
          window.location.href = "/";
      }
  }
  
  setTokenInfo(tokenKey){
      $.ajax({
          url : `${process.env.REACT_APP_BACKEND_URL}/getTokenInfo`,
          type : 'GET',
          header: {'Access-Control-Allow-Origin': "*"},
          data : {
              tokenKey : tokenKey
          },
          success : (data, status, request) => { 
              this.setToken(data);
              this.setLoginStatus(true);
        },
          error: (request, textStatus, error) => {
              if (request.code === 501)
                  this.renewAccessToken()
              else{
                  Utils.printError(request, textStatus, error)
                  this.setLoginStatus(false);
              }
          }
          });
  }

      checkLogin(){
        const tokenKey = Utils.getQueryParam('tokenKey');
        this.state.highFunc(null);
 
        if (tokenKey !== null){
            this.setTokenInfo(tokenKey)
        }
        else{
            if (localStorage.getItem("accessToken") && localStorage.getItem("refreshToken"))
                this.requestCheckLogin();
        }
      }

      logoutBtn(){
          localStorage.setItem('accessToken', null);
          localStorage.setItem('refreshToken', null);
          localStorage.setItem('userName', null);
          this.setLoginStatus(false);
          window.location.href="/";
        }

      render() {
        return (
            <>
            <span style={{ width: '10px' }}></span>
            <li className="nav-link active" id="welcomeText" style={{ display: 'none' }}>Welcome! </li>
            <button className="btn btn-outline-success comming-soon">Signup</button>
            <span style={{ width: '10px' }}></span>
            <button onClick={()=> this.loginBtn()}   className="btn btn-outline-success" id="loginBtn">Login</button>
            <button onClick={()=> this.logoutBtn()}   className="btn btn-outline-success" style={{ display: 'none' }} id="logoutBtn">Logout</button>
            </>
        );
      }
    }