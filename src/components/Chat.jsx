import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify'; 
import '../styles/chat.css'; 


const sanitize = (text) => DOMPurify.sanitize(text);

const Chat = ({ user, setUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('https://chatify-api.up.railway.app/messages', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        console.log('Fetched messages:', data);

        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.error('Unexpected response format:', data);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    console.log('Sending message with:', {
      text: sanitize(newMessage),
      userId: user.id 
    });

    try {
      const response = await fetch('https://chatify-api.up.railway.app/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          text: sanitize(newMessage),
          userId: parseInt(user.id, 10) 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Message sent:', data);

        
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...data.latestMessage, userId: user.id } 
        ]);
        setNewMessage('');
      } else {
        const errorText = await response.text();
        console.error('Failed to send message:', errorText);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`https://chatify-api.up.railway.app/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setMessages((prevMessages) => prevMessages.filter((message) => message.id !== messageId));
      } else {
        console.error('Failed to delete message');
      }
    } catch (error) {
      console.error('An unexpected error occurred', error);
    }
  };

  const currentUserId = parseInt(user.id, 10);

  

  const fakeChat = [
    {
      text: "Tjena Marvin hur går uppgiften?",
      username: "Glenn",
      userId: "fake-user-id"
    },
    {
      text: "Den skulle in för länge sen!!",
      username: "Glenn",
      userId: "fake-user-id"
    },
    {
      text: "Sover du eller?! Hallå! ",
      username: "Glenn",
      userId: "fake-user-id"
    }
  ];

  if (loading) return <p>Loading messages...</p>;

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>Chat med Glenn</h1>
      </header>
      <div className="messages">
        {fakeChat.length > 0 && fakeChat.map((msg, index) => (
          <div key={`fake-${index}`} className={`message left`}>
            <p dangerouslySetInnerHTML={{ __html: sanitize(msg.text) }} />
          </div>
        ))}
        {messages.length > 0 ? (
          messages.map((msg) => {
            const messageUserId = parseInt(msg.userId, 10);
            const isCurrentUser = messageUserId === currentUserId;

            console.log(`Rendering message from ${msg.userId}. Current user ID: ${currentUserId}. Applying class: ${isCurrentUser ? 'right' : 'left'}`);

            return (
              <div
                key={msg.id}
                className={`message ${isCurrentUser ? 'right' : 'left'}`}
              >
                <p dangerouslySetInnerHTML={{ __html: sanitize(msg.text) }} />
                {isCurrentUser && (
                  <button className="delete-button" onClick={() => deleteMessage(msg.id)}>✖</button>
                )}
              </div>
            );
          })
        ) : (
          <p>No messages found.</p>
        )}
      </div>

      <form onSubmit={sendMessage}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
