import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import ListMessage from "./ListMessage";
import TypeMessage from "./TypeMessage";
import { Link } from "react-router-dom";
import { searchProduct } from 'actions/ProductAction';
import { useHistory } from "react-router-dom";

function Chat(props) {
  const socketRef = useRef();
  const ENDPOINT = "http://localhost:4005";
  const [messages, setMessages] = useState([]);
  const { userInfo } = useSelector((state) => state.userSignin);
  const idConversation = useSelector((state) => state.chat.idConversation);
  const nameConversation = useSelector(state => state.chat.nameConversation)
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (!idConversation) return;
    const getAllMessageByConversation = async () => {
      const { data } = await axios.get(
        `/api/chat/message?idConversation=${idConversation}`
      );
      setMessages(data.messageList);
    };

    getAllMessageByConversation();
  }, [idConversation]);

  useEffect(() => {
    socketRef.current = io(ENDPOINT);

    socketRef.current.emit("admin_join_conversation", idConversation);

    socketRef.current.on("newMessage", (message) => {
      setMessages([...messages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const scrollMessage = () => {
      var element = document.querySelector(".ad-chatuser-listmessage");
      element.scrollTop = element.scrollHeight;
    }
    
      scrollMessage()

  })

  const handleFormSubmit = async (message) => {
    const sender = userInfo.name;

    const payload = {
      sender,
      message,
      idConversation,
    };
    const { data } = await axios.post(
      `/api/chat/save`,
      payload
    );
    socketRef.current.emit('chat', data);
  };

  return (
   
      <div className="ad-chatuser">
        <div className="ad-chatuser-user">
          <span className="ad-chatuser-user-name">{nameConversation}</span>
        </div>

        {messages ? (
          <ListMessage messages={messages} user={userInfo}></ListMessage>
        ) : (
          ""
        )}

        <TypeMessage onSubmit={handleFormSubmit}></TypeMessage>
      </div>
      
   
  );
}

export default Chat;
