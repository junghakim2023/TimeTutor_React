import React from 'react';
import $ from 'jquery';
import * as Utils from '../logic/UtilFunc.js'
import '../css/tutorChat.css';
import { diffChars } from 'diff';

export default class ChatController extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            questionInfo:null,
            updateFunc:props.propFunction,
            login: null
          };
      }

      
     componentDidUpdate(prevProps) {
        if (this.props.additionalProps == prevProps.additionalProps)
          return;

        this.state.login = this.props.additionalProps;

        if (this.state.login == false)
          this.sayToGuest();
        else if(this.state.login == true)
          this.getPreviousMessage();
     }

    updateChatArea(isUser, message, data){
        var info = {};
        info['contents'] = message;
        info['isUser'] = isUser;
        info['data'] = data;
        this.state.updateFunc(info)
    }

    addTutorMessage(message, data, send, skip){
      if (send)
      this.sendTutorMessage(message)

      if (!skip)
        Utils.sleep(1000);
      this.updateChatArea(false, message, data);
    }

    addUserMessage(message, notSend){
      this.updateChatArea(true, message, null);
      
      if (!notSend)
        this.sendMyMessage(message);
    }
    

  setPreviousMessage(chatList){
      if (chatList == null || chatList.length <= 0)
          return;       
  
          chatList = chatList.reverse();
          for (const chatData of chatList) {
              if (chatData.is_me == true)
                  this.addUserMessage(chatData.contents, true);
              else
                  this.addTutorMessage(chatData.contents, null, false, true);
          };
  }
  
   getPreviousMessage(){
  
      $.ajax({
          url : `${process.env.REACT_APP_BACKEND_URL}/chat/get/previous/message`,
          type : 'GET',
          headers: {
            'Access-Control-Allow-Origin': '*',
            ...Utils.getHeaderToken(),
          },
          data : {offset : 0},
          success : (data, status, request)=> {
              if (data == null || data.length <= 0){
                  var welcome = "Welcome to TimeTutor! " + localStorage.getItem("userName") + "! \n";
                  this.addTutorMessage(welcome,null, true);
              }
              else
                  this.setPreviousMessage(data);
        },
          error:function(request, textStatus, error){
              Utils.printError(request, textStatus, error)
          }
          });
  }

    changeTo(area){
        var qnaAreaShow = "none";
        var menuAreaShow = "none";
        var qnaMakerAreaShow = "none";
        var rescheduleAreaShow = "none";

        switch(area){
            case "qna":
                qnaAreaShow = "block";
                break;
            case "qnaMaking":
                qnaMakerAreaShow =  "block";
                break;
            case "reschedule":
                rescheduleAreaShow =  "block";
                break;
            case "menu":{
                menuAreaShow =  "block";
                $("#ChatFunctingArea").css("height", "92%");
                break;
            }
        }

        $('#questionInput').val('')
        $('#answerInput').val('')
        $('#ChatFuncInput').val('')

        $("#buttonMenueArea").css("display", menuAreaShow);
        $("#qnaArea").css("display", qnaAreaShow);
        $("#qnaMakingArea").css("display", qnaMakerAreaShow);
        $("#rescheduleArea").css("display", rescheduleAreaShow);

    }

    qnaMakingBtnClick (){
        if (!Utils.checkAuthToken()){
            this.sayToGuest();
            return;
        }
        this.changeTo("qnaMaking");

        $("#ChatFunctingArea").css("height", "80%");
    }


    qnaBtnClick(){
        if (!Utils.checkAuthToken()){
            this.sayToGuest();
            return;
        }
        this.addUserMessage("Give me question!")
        this.requestQuestion();
    
    }

    rescheduleBtnClick(){
        if (!this.checkAuthToken()){
            this.sayToGuest();
            return;
        }
        this.getTimeSet();
        this.changeTo("reschedule");
    }

    async guideBtnClick(){
        var message = 'Hello, I am TimeTutor. When you create a questionnaire, I will randomly select questions from the questionnaire at set times and ask you.';
        this.addTutorMessage(message, null, false)
        await Utils.sleep(1200);

        message = '1. Click the “Make QnA” button to register a question.';
        this.addTutorMessage(message, null, false)
        await Utils.sleep(1200);
        
        message = '2. Click the “ReScheduleing Alarm” button to be notified of the time you need to ask your question.';
        this.addTutorMessage(message, null, false)
        await Utils.sleep(1200);
        
        message = '3. If you need this explanation again, click the “Guide” button!';
        this.addTutorMessage(message, null, false)
        await Utils.sleep(1200);
        
        message = '4. Of course, if necessary, you can click the “QnA” button right away to start Q&A!';
        this.addTutorMessage(message, null, false)
    }

    sayToGuest(){
        var message = 'Hello, I am TimeTutor. You need to log in to use the service. ';
        this.addTutorMessage(message, null, false)
    }

    sendAnswer(){
        if (this.state.questionInfo == '' || this.state.questionInfo == null || this.state.questionInfo == undefined){
            var message = "Wait until Question to be prepared";
            this.addTutorMessage(message, null, true)
            return;
        }

        var answer = $('#ChatFuncInput').val();
        if (answer == "" || answer == null){
            var message = "Enter your answer";
            this.addTutorMessage(message, null, true)
            return;
        }

        this.addUserMessage( "A : " + answer);

        if (this.state.questionInfo == '' || this.state.questionInfo ==null)
            return;
    
        if (answer == '' || answer ==null)
            return;
        
        var correct = false;
        var text = "";
        let output = diffChars(answer, this.state.questionInfo.answer);
        output.forEach((part) => {

          if (part.added==true)
            text += "<ins>"+ part.value+ "</ins>"
          else if (part.removed ==true)
            text += "<del>"+ part.value+ "</del>"
          else
            text += part.value;

        });     

        if (text.indexOf('<ins>') == -1 && text.indexOf('<del>') == -1){
            let check = "[very good] <br>";
            text = "<good>" + text + "</good>";
            var message = check + text;
            this.addTutorMessage(message, null, true);
            
            correct = true;
        }else{
            let check = "[check] <br>";
            let answer = "<answer>"+this.state.questionInfo.answer + "</answer> <br>";
            var message = check + answer + text;
            this.addTutorMessage(message, null, true);
        }
    
        
        this.sendAnswerResult(this.state.questionInfo, correct);
        this.state.questionInfo = null;
        this.changeTo("menu");
    }

    requestQuestion(){
        $.ajax({
            url : `${process.env.REACT_APP_BACKEND_URL}/qna/get/question`,
            type : 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                ...Utils.getHeaderToken(),
              },
            contentType: 'application/json',
            success : (data, status, request) =>{
                if (data == null || data == ''){
                    var message = "There is no availiable Question. Make question first!"
                    this.addTutorMessage(message, null, true)
                    return;
                }

                this.state.questionInfo = data;
                this.addTutorMessage("Q : " + data.question, data, true)
                this.changeTo("qna");
          },
            error:(request, textStatus, error)=>{
                Utils.printError(request, textStatus, error)

                var message = "There is no availiable Question. Make question first!"
                this.addTutorMessage(message, null, true)
            }
            });
    }

    sendQnA(){
       var questionInput = $('#questionInput').val();
       if (questionInput == "" || questionInput == null){
           var message = "Enter your question";
           this.addTutorMessage(message, null, true)
           return;
       }

       var answerInput = $('#answerInput').val();
       if (answerInput == "" || answerInput == null){
           var message = "Enter your answer";
           this.addTutorMessage(message, null, true)
           return;
       }
       

       this.addUserMessage("Q : " + questionInput + " \n" + "A : " + answerInput)

       $.ajax({
           url : `${process.env.REACT_APP_BACKEND_URL}/qna/set/qna`,
           type : 'POST',
           headers: {
            'Access-Control-Allow-Origin': '*',
            ...Utils.getHeaderToken(),
          },
           contentType: 'application/json',
           data : JSON.stringify({questionInput,answerInput}),
           success : (data, status, request) =>{
               var message = "I get your question and answer successfully!"
               this.addTutorMessage(message, null, true)
               this.changeTo("menu");
         },
         error:(request, textStatus, error)=>{
           Utils.printError(request, textStatus, error)
       }
       });
    }


    
    sendMyMessage(msg){
        $.ajax({
            url : `${process.env.REACT_APP_BACKEND_URL}/chat/say`,
            type : 'POST',
            contentType: 'application/json',
            headers: Utils.getHeaderToken(),
            data : JSON.stringify({ message: msg }),
            success : (message, status, request) =>{
                
          },
            error:(request, textStatus, error)=>{
                  Utils.printError(request, textStatus, error);
                  if (request.status != 501)
                    alert("You need to log in to use the service");
                  window.location.href="/";
            }
            });
    }
    
    sendTutorMessage(message, info){
        $.ajax({
            url : `${process.env.REACT_APP_BACKEND_URL}/chat/say/tutor`,
            type : 'POST',
            contentType: 'application/json',
            headers: Utils.getHeaderToken(),
            data : JSON.stringify({ message }),
            success : (message, status, request) =>{
                //        
          },
            error:(request, textStatus, error)=>{
                Utils.printError(request, textStatus, error)
            }
            });
  
    }
    
    sendAnswerResult(info, correct){
        $.ajax({
            url : `${process.env.REACT_APP_BACKEND_URL}/qna/answer/result?questionIdx=`+info.idx+"&correct="+correct,
            type : 'GET',
            contentType: 'application/json',
            headers: Utils.getHeaderToken(),
            success : (message, status, request) =>{
                //        
          },
            error:(request, textStatus, error) => {
                Utils.printError(request, textStatus, error)
            }
            });
    }
    
    sendTimeSet(){
        /*
        var times = InitTime();
        

        $.ajax({
            url : `${process.env.REACT_APP_BACKEND_URL}/qna/set/alarmTime`,
            type : 'POST',
            headers: {
                'Access-Control-Allow-Origin': '*',
                ...Utils.getHeaderToken(),
              },
            contentType: 'application/json',
            data: JSON.stringify(times),
            success : (data, status, request) => {
                var message = "I set your schedules successfully! I will send an alarm email according to this schedule. "
                ChatFunc.sendTutorMessage(message);
                this.changeTo("menu");
          },
          error:(request, textStatus, error) => {
            Utils.printError(request, textStatus, error)
        }
        });
        */
    }
    getTimeSet(){
        /*
        $.ajax({
            url : `${process.env.REACT_APP_BACKEND_URL}/qna/get/alarmTime`,
            type : 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                ...Utils.getHeaderToken(),
              },
            success : (data, status, request) =>{
                SetTime(data);
               
          },
          error:(request, textStatus, error)=>{
            Utils.printError(request, textStatus, error)
        }
        });
        */
    }

    componentDidMount() {
        this.changeTo("menu");
    }

    render() {
        return (
            <div className="flex-grow-0 py-3 px-4 border-top">
            <div className="input-group" id="qnaArea" style={{ textAlign: 'center' }}>
              <input
                autoComplete="off"
                id="ChatFuncInput"
                type="text"
                style={{
                  padding: '7px',
                  border: '1px solid darkgray',
                  height: '6%',
                  width: '70%',
                  borderRadius: '7px',
                }}
                placeholder="Type your message"
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    this.sendAnswer();
                  }
                }}
              />
              <button
                onClick={() => this.sendAnswer()}
                className="btn btn-primary"
                style={{ width: '12%', marginLeft:'10px', marginRight:'10px', borderRadius:'7px'}}
              >
              ▶
               </button>
              <button
                onClick={() => this.changeTo('menu')}
                className="btn btn-primary"
                style={{ width: '10%', borderRadius:'7px' }}
              >
                X
              </button>
            </div>
            <div id="buttonMenueArea" style={{ textAlign: 'center'}}>
              <button
                id="qnaMakingBtn"
                onClick={() => this.qnaMakingBtnClick()}
                className="btn btn-primary btn-lg mr-1 px-3"
              >
                Make QnA
              </button>
              {/*
              <button
                id="reschedulingBtn"
                onClick={() => this.rescheduleBtnClick()}
                className="btn btn-info btn-lg mr-1 px-3 d-none d-md-inline-block"
              >
                ReScheduleing Alarm
              </button>
              */}
              <button
                style={{marginLeft: '10px', marginRight: '10px'}}
                id="qnaBtn"
                onClick={() => this.qnaBtnClick()}
                className="btn btn-primary btn-lg mr-1 px-3"
              >
                QnA
              </button>
              <button
                id="guideBtn"
                onClick={() => this.guideBtnClick()}
                className="btn btn-light border btn-lg px-3"
              >
                Guide
              </button>
            </div>
            
            <div id="qnaMakingArea" style={{ textAlign: 'center' }}>
              <input
                autoComplete="off"
                id="questionInput"
                type="text"
                className="form-control"
                placeholder="Type your Question"
              />
              <input
                autoComplete="off"
                id="answerInput"
                style={{ marginTop: '10px', marginBottom: '10px' }}
                type="text"
                className="form-control"
                placeholder="Type your Answer"
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    this.sendQnA();
                  }
                }}
              />
              <button
                onClick={() => this.sendQnA()}
                className="btn btn-primary"
                style={{ width: '85%', marginRight:'10px' }}
              >
                Send
              </button>
              <button
                onClick={() => this.changeTo('menu')}
                className="btn btn-primary"
                style={{ width: '10%' }}
              >
                X
              </button>
            </div>
            
            <div id="rescheduleArea" style={{ textAlign: 'center' }}>
              <input
                autoComplete="off"
                className="btn timeText"
                style={{ width: '100px', borderColor: 'darkgrey' }}
                placeholder="ex. 17:00"
              ></input>
              <input
                autoComplete="off"
                className="btn timeText"
                style={{ width: '100px', borderColor: 'darkgrey' }}
                placeholder="ex. 17:00"
              ></input>
              <input
                autoComplete="off"
                className="btn timeText"
                style={{ width: '100px', borderColor: 'darkgrey' }}
                placeholder="ex. 17:00"
              ></input>
              <input
                autoComplete="off"
                className="btn timeText"
                style={{ width: '100px', borderColor: 'darkgrey' }}
                placeholder="ex. 17:00"
              ></input>
              <input
                autoComplete="off"
                className="btn timeText"
                style={{ width: '100px', borderColor: 'darkgrey' }}
                placeholder="ex. 17:00"
              ></input>
              <button onClick={() => this.sendTimeSet()} className="btn btn-primary" style={{ width: '50px' }}>
                OK
              </button>
              <button
                onClick={() => this.changeTo('menu')}
                className="btn btn-primary"
                style={{ width: '40px', borderColor: 'darkgrey' }}
              >
                X
              </button>
            </div>
            </div>
        );
      }
    }

    function InitTime(){
        /*
        var times = []
        useEffect(() => {
            
            $('.timeText').each(function (index,item){
                times.push($(this).val());

            });
        });
        return times;
        */
    }

    function SetTime(){
        /*
        useEffect((data) => {
            $('.timeText').each(function(index,item){
                $(this).val('');
              });
            var idx = 0;
            $('.timeText').each(function(index,item){  
                if (data.length > idx) 
                    $(this).val(data[idx].time);
                idx++;
            });
        });
        */
    }

