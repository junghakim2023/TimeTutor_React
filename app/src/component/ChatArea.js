import React, {useState, useEffect} from 'react';
import Chat from './Chat.js'

var list = []
export const ChatArea = props => {
    useEffect(() => {
        if (props.lowData == null)
            return;

          }, [props.lowData]);
    

          return (
            <>
              {props.lowData != null && props.lowData.map((info, index) => (
                <Chat value={info} key={index} />
              ))}
            </>
          );
}; 

export default ChatArea;