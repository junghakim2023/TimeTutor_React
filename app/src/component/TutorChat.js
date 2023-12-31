import React, {useState, useEffect} from 'react';
import '../css/tutorChat.css'
import './ChatController.js'
import ChatController from './ChatController.js';
import ChatArea from './ChatArea.js';

var list = []
export default class TutorChat extends React.Component {
    chatMessagesRef = React.createRef();

    constructor(props){
        super(props);
        this.state = {
            lowData:null,
            deviceHeight: window.innerHeight,

          };
      }

    handleResize = () => {
        this.setState({
          deviceHeight: window.innerHeight,
        });
      };
    componentDidUpdate(prevProps) {
      if (prevProps.messages !== this.props.messages) {
        this.handleResize();
      }

      this.scrollToBottom();
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleResize);
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleResize);
    }

    highFunction = (data) => {
      list.push(data);
        this.setState({ lowData: list });
      }

      scrollToBottom() {
        if (this.chatMessagesRef.current) {
          // chat-messages 요소의 scrollHeight로 스크롤을 조정
          this.chatMessagesRef.current.scrollTop = this.chatMessagesRef.current.scrollHeight;
        }
      }

    render() {
        return (
          <body>
            <main className="content" style={{ height: '100%', marginTop: '70px'}}>
              <div className="container p-0" style={{ height: '100%' }}>
                <h1 className="h3 mb-3"></h1>
                <div className="card" style={{ height: '99%' }}>
                  <div className="row g-0" style={{ height: '80%' }}>
                    <div className="col-12 col-lg-5 col-xl-3 border-right " style={{borderRightColor: "#FF0000", borderRight: "solid 1px #e9e9e9"}}>
                      <div className="px-4 d-none d-md-block">
                        <div className="d-flex align-items-center">
                          <div className="flex-grow-1">
                            <input type="text" className="form-control my-3" placeholder="Search..." />
                          </div>
                        </div>
                      </div>
                      <a href="#" className="list-group-item list-group-item-action border-0">
                        <div className="badge bg-success float-right alarm"></div>
                        <div className="d-flex align-items-start">
                          <img src="https://bootdey.com/img/Content/avatar/avatar3.png" className="rounded-circle mr-1" alt="Vanessa Tucker" width="40" height="40" />
                          <div className="flex-grow-1 ml-3">
                            Time tutor
                            <div className="small"><span className="fas fa-circle chat-online"></span> Online</div>
                          </div>
                        </div>
                      </a>
                      <hr className="d-block d-lg-none mt-1 mb-0" />
                    </div>
                    <div className="col-12 col-lg-7 col-xl-9">
                        <div className="py-2 px-4 border-bottom d-none d-lg-block">
                            <div className="d-flex align-items-center py-1">
                                <div className="position-relative">
                                    <img src="https://bootdey.com/img/Content/avatar/avatar3.png" className="rounded-circle mr-1" alt="Sharon Lessman" width="40" height="40"/>
                                </div>
                            <div className="flex-grow-1 pl-3">
                                <strong>Time tutor</strong>
                                <div className="text-muted small"><em>Tutor</em></div>
                            </div>
                            </div>
                        </div>
                        <div className="position-relative">
                        <div id="chattingArea" style={{height:this.state.deviceHeight-225, maxHeight:this.state.deviceHeight-225}}className="chat-messages p-4" ref={this.chatMessagesRef}>
                            <ChatArea lowData={this.state.lowData} />
                        </div>
                            <ChatController propFunction={this.highFunction} additionalProps={this.props.value}/>

                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </body>
        );
      }
    }