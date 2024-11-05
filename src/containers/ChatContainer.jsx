import React, { useState, useEffect } from "react";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import Navbar from "../components/Navbar";
import Load from "../components/Load";
import { queryAI, logout } from "../utils/api";

const ChatContainer = ({ token, setToken }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const endOfMessageRef = React.useRef(null);

  const handleQuery = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    queryAI({ query }, token)
      .then((res) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            query,
            data: res,
          },
        ]);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };
  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // Lifecycle method untuk scroll otomatis ke bawah saat ada pesan baru

  const handleLogout = () => {
    setLoading(true);
    logout(token)
      .then(() => {
        setToken(null);
        localStorage.removeItem("token");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    scrollToBottom();
  });

  return (
    <div>
      <Navbar logout={handleLogout} loading={loading} />
      <div className="container">
        {loading && messages.length === 0 ? (
          <Load />
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.data.data}
              query={message.query}
              isLoading={loading}
              lastArray={index === messages.length - 1}
              currentQuery={query}
            />
          ))
        )}
        {/* Elemen referensi untuk scroll otomatis */}
        <div ref={endOfMessageRef} />
      </div>
      <ChatInput
        onSubmit={handleQuery}
        onChange={handleChange}
        loading={loading}
        query={query}
      />
    </div>
  );
};

export default ChatContainer;
