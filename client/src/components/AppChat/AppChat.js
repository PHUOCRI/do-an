import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import axios from "axios";
import ListMessage from "./Components/ListMessage.js/ListMessage";
import TypeMessage from "./Components/TypeMessage/TypeMessage";
import './AppChat.css'
import { LineOutlined } from '@ant-design/icons';

let socket;

function AppChat(props) {
  const ENDPOINT = "http://localhost:4005";
  const [messages, setMessages] = useState([]);
  const [openChat, setOpenChat] = useState(false)
  const { userInfo } = useSelector((state) => state.userSignin)

  useEffect(() => {
    const getAllMessageByConversation = async () => {
      if (!userInfo || !userInfo._id || !userInfo.token) return;
      const {data}  = await axios.get(
        `/api/chat/message?idUser=${userInfo._id}`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        }
      );
      setMessages(data.messageList);
    }
    getAllMessageByConversation();
  }, [userInfo]);

  useEffect(() => {
    if (!userInfo || !userInfo._id) return;
    socket = io(ENDPOINT);
    socket.emit('join_conversation', userInfo._id);
    socket.on('newMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    // Cleanup
    return () => {
      if (socket) socket.disconnect();
    };
    // eslint-disable-next-line
  }, [userInfo]);

  useEffect(() => {
    const scrollMessage = () => {
      var element = document.querySelector(".chatuser-listmessage");
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }
    if(openChat){
      scrollMessage()
    }
  })

  const handleChatFormSubmit = async (message) => {
    const sender = userInfo.name;

    //emit create conversation and chat
    if (!Array.isArray(messages) || messages.length === 0) {
      socket.emit('create_conversation', userInfo);

      socket.on('response_room', async (conversation) => {
        const payload = {
          sender,
          message,
          idConversation: conversation._id,
        };
        const {data} = await axios.post(`/api/chat/save`, payload);
        socket.emit('chat', data);
      });
    } else {
      const idConversation = messages[0].idConversation._id || messages[0].idConversation;
      // request save message
      const payload = {
        sender,
        message,
        idConversation,
      };
      const {data} = await axios.post(`/api/chat/save`, payload)
      socket.emit('chat', data);
    } 
  };

  
  return (
  <div className="appchat">
      
      {
        openChat ? '' : (
          <div className="openchat" onClick={() => setOpenChat(!openChat)}>
            Chat với nhân viên
          </div>
        )
      }
      
      {
        openChat ? (<div className="chatuser">
        <div className="chatuser-user">
          <span className="chatuser-user-name">Cao Kha Hieu</span>
          <span className="chatuser-user-line" onClick={() => setOpenChat(!openChat)}><LineOutlined></LineOutlined></span>
        </div>

        {
          messages ? (<ListMessage messages={messages} user={userInfo}></ListMessage>) : ''
        }

      <TypeMessage onSubmit={handleChatFormSubmit} ></TypeMessage>

      </div>) : ''
      }

      <div className="header">
        <div className="header__logo">...</div>
        <div className="header__search">
          <form className="search-form">
            <button type="submit" className="search-button">
              <i className="fa fa-search"></i>
            </button>
            <input type="text" name="search" placeholder="Bạn tìm gì..." />
          </form>
        </div>
        <div className="header__menu">...</div>
        <div className="header__cart">...</div>
      </div>
  </div>);
}

export default AppChat;
