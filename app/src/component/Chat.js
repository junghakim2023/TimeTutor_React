import React from 'react';
export default class Chat extends React.Component {
    constructor(props){
        super(props);
        console.log(props);
        this.state = {
            //isUser: props.value.isUser,
            contents:props.value.contents,
            name: props.value.name,
            //hasBtn: props.value.hasBtn,
            //data:props.value.data
          };
      }

    componentDidMount() {
    }

    render() {
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
                <div className="font-weight-bold mb-1">{this.state.name}</div>
                <div id="chatText"> {this.state.contents}</div>
              </div>
            </div>
          </>
        );
      }
    }