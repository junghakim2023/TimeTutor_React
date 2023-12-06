import React, {useState, useEffect} from 'react';
import Chat from './Chat.js'

const list = []
export const ChatArea = props => {
    useEffect(() => {
        if (props.lowData == null)
            return;
            const chat = {};
            chat['name'] = 'asdf';
            chat['contents'] = props.lowData;
            list.push(chat);
          }, [props.lowData]);
          

        return (
            <>
            {list.map((info, index) => (
                <Chat value={info}/>
            ))}
            </>
        );
}; 

export default ChatArea;