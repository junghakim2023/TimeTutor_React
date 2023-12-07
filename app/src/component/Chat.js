import React from 'react';
import $ from 'jquery';
import * as Utils from '../logic/UtilFunc.js'

export default class Chat extends React.Component {
    constructor(props){
        super(props);

        var text = "";
        var color = "";
        
        if (props.value.data != null){
          var correct = parseInt(props.value.data.correct);
          var bad = parseInt(props.value.data.bad);
          
          if (correct + bad > 0){
              let rate = (correct/(correct + bad) * 100).toFixed(2);;
              text = "Correct : " + rate + "%";
  
              if (rate <= 0 ) color = "red";
              else if (rate <= 30) color = "red"
              else if (rate <= 70) color = "orange"
              else color =  "green"       
          }
        }
        
        this.state = {
          isUser: props.value.isUser,
          contents:props.value.contents,
          color:color,
          data:props.value.data,
          correctRate:text
        };

      }

    componentDidMount() {
     
    }

    renderUser(){
      return (
        <>
        <div id="chat" className="chat-message-right pb-4">
          <div>
            <img
              src="https://bootdey.com/img/Content/avatar/avatar1.png"
              className="rounded-circle mr-1"
              alt="Chris Wood"
              width="40"
              height="40"
            />
            <div className="text-muted small text-nowrap mt-2 time"></div>
          </div>
          <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
            <div className="font-weight-bold mb-1">You</div>
            <div id="chatText"> {this.state.contents}</div>
          </div>
        </div>
      </>
    );
    }

    clickDelete(){
      $.ajax({
          url : `${process.env.REACT_APP_BACKEND_URL}/qna/delete/question?questionIdx=` + this.state.data.idx,
          type : 'GET',
          headers: {
           'Access-Control-Allow-Origin': '*',
           ...Utils.getHeaderToken(),
         },
          success : (data, status, request)=> {
             alert("Delete successfully");
        },
        error:(request, textStatus, error)=>{
          Utils.printError(request, textStatus, error)
        }
      });
    }

    renderQuestionInfo(){

      if (this.state.data == null)
        return;

      return(
        <>
        <button onClick={() => this.clickDelete()} data="" className="btn btn-primary deleteBtn">Delete</button>
        <div id ="correctRate" style={{color:this.state.color }}> {this.state.correctRate} </div>
        </>
      )
    }
    renderTutor(){
      return (
        <>
        <div id="chat" className="chat-message-left pb-4">
          <div>
            <img
              src="https://bootdey.com/img/Content/avatar/avatar3.png"
              className="rounded-circle mr-1"
              alt="Chris Wood"
              width="40"
              height="40"
            />
            <div className="text-muted small text-nowrap mt-2 time"></div>
          </div>
          <div className="flex-shrink-1 bg-light rounded py-2 px-3 mr-3">
            <div className="font-weight-bold mb-1">Tutor</div>
            <div id="chatText" dangerouslySetInnerHTML={{ __html: this.state.contents }}></div>
          </div>
          {this.renderQuestionInfo()}
        </div>
        
      </>
    );
    }

    render() {
      if (this.state.isUser)
        return this.renderUser();
      else
        return this.renderTutor();
        
      }
    }