import React from 'react';
import $ from 'jquery';
import * as Utils from '../logic/UtilFunc.js'

export default class ChatFuncController extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            questionInfo:null,
            updateFunc:props.propFunction
          };
      }

    updateChatArea(info){
        this.state.updateFunc(info)
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
        this.updateChatArea("Give me question!")
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
        this.updateChatArea(message);
        await Utils.sleep(1200);

        message = '1. Click the “Make QnA” button to register a question.';
        this.updateChatArea(message);
        await Utils.sleep(1200);
        
        message = '2. Click the “ReScheduleing Alarm” button to be notified of the time you need to ask your question.';
        this.updateChatArea(message);
        await Utils.sleep(1200);
        
        message = '3. If you need this explanation again, click the “Guide” button!';
        this.updateChatArea(message);
        await Utils.sleep(1200);
        
        message = '4. Of course, if necessary, you can click the “QnA” button right away to start Q&A!';
        this.updateChatArea(message);
    }

    sayToGuest(){
        var message = 'Hello, I am TimeTutor. You need to log in to use the service. ';
        this.updateChatArea(message);
    }

    sendAnswer(){
        if (this.state.questionInfo == '' || this.state.questionInfo == null || this.state.questionInfo == undefined){
            var message = "Wait until Question to be prepared";
            this.this.updateChatArea(message);
            return;
        }

        var answer = $('#ChatFuncInput').val();
        if (answer == "" || answer == null){
            var message = "Enter your answer";
            this.this.updateChatArea(message);
            return;
        }

        this.updateChatArea("A : " + answer);

        if (this.state.questionInfo == '' || this.state.questionInfo ==null)
            return;
    
        if (answer == '' || answer ==null)
            return;
        
        var correct = false;
        let output = window.htmldiff(answer, this.state.questionInfo.answer);
        
        if (output.indexOf('<ins>') == -1 && output.indexOf('<del>') == -1){
            let check = "[very good] <br>";
            output = "<good>" + output + "</good>";
            var message = check + output;
            this.this.updateChatArea(message);
            
            correct = true;
        }else{
            let check = "[check] <br>";
            var message = check + output;
            this.this.updateChatArea(message);
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
                    this.updateChatArea(message);
                    return;
                }

                this.state.questionInfo = data;
                this.updateChatArea("Q : " + data.question);
                this.changeTo("qna");
          },
            error:(request, textStatus, error)=>{
                Utils.printError(request, textStatus, error)

                var message = "There is no availiable Question. Make question first!"
                this.updateChatArea(message);
            }
            });
    }

    sendQnA(){
       var questionInput = $('#questionInput').val();
       if (questionInput == "" || questionInput == null){
           var message = "Enter your question";
           this.updateChatArea(message);
           return;
       }

       var answerInput = $('#answerInput').val();
       if (answerInput == "" || answerInput == null){
           var message = "Enter your answer";
           this.updateChatArea(message);
           return;
       }
       
       this.updateChatArea("Q : " + questionInput + " \n" + "A : " + answerInput);

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
               this.updateChatArea(message);
               this.changeTo("menu");
         },
         error:(request, textStatus, error)=>{
           Utils.printError(request, textStatus, error)
       }
       });
    }

    extraTutorMessage(chatFromTutor, info){
        chatFromTutor.find(".deleteBtn").attr("data", info.idx);
        chatFromTutor.find(".deleteBtn").css("display","block");
    
        var correct = parseInt(info.correct);
        var bad = parseInt(info.bad);
        var correctRateText = chatFromTutor.find("#correctRate");
        if (correct == 0 && bad == 0){
            correctRateText.html("");
        }
        else{
            let rate = (correct/(correct + bad) * 100).toFixed(2);
            correctRateText.html("Correct : " + rate + "%");
            if (rate <= 0 ) correctRateText.html("");
            else if (rate <= 30) correctRateText.css("color", "red");
            else if (rate <= 70) correctRateText.css("color", "orange");
            else correctRateText.css("color", "green");
        }
    }
    
    sendMyMessage(msg){
        $.ajax({
            url : `${process.env.REACT_APP_BACKEND_URL}/chat/say`,
            type : 'POST',
            contentType: 'application/json',
            headers: Utils.getHeaderToken(),
            data : JSON.stringify({ message: msg }),
            success : (message, status, request) =>{
                this.this.updateChatArea(message);   
          },
            error:(request, textStatus, error)=>{
                Utils.printError(request, textStatus, error);
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
    
            this.this.updateChatArea(message);
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

    deleteQnA(button){
       $.ajax({
           url : `${process.env.REACT_APP_BACKEND_URL}/qna/delete/question?questionIdx=` + button.getAttribute("data"),
           type : 'GET',
           headers: {
            'Access-Control-Allow-Origin': '*',
            ...Utils.getHeaderToken(),
          },
           success : (data, status, request)=> {
               var message = "I delete your QnA successfully! "
               this.this.updateChatArea(message);
         },
         error:(request, textStatus, error)=>{
           Utils.printError(request, textStatus, error)
       }
       });

       this.changeTo("menu");
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
                  width: '75%',
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
                style={{ width: '10%' }}
              ></button>
              <button
                onClick={() => this.changeTo('menu')}
                className="btn btn-primary"
                style={{ width: '10%' }}
              >
                X
              </button>
            </div>
            <div id="buttonMenueArea" style={{ textAlign: 'center' }}>
              <button
                id="qnaMakingBtn"
                onClick={() => this.qnaMakingBtnClick()}
                className="btn btn-primary btn-lg mr-1 px-3"
              >
                Make QnA
              </button>
              <button
                id="reschedulingBtn"
                onClick={() => this.rescheduleBtnClick()}
                className="btn btn-info btn-lg mr-1 px-3 d-none d-md-inline-block"
              >
                ReScheduleing Alarm
              </button>
              <button
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
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    this.inputText();
                  }
                }}
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
                    this.inputText();
                  }
                }}
              />
              <button
                onClick={() => this.sendQnA()}
                className="btn btn-primary"
                style={{ width: '85%' }}
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

