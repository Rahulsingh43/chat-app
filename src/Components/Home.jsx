import axios from "axios";
import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { FaPaperclip, FaMicrophone,FaHome, FaBell, FaSearch, FaCog, FaUserCircle,FaSignOutAlt  } from 'react-icons/fa';
import { IoSend } from 'react-icons/io5';
import socket from "../Socket";

// let users = [
//     { id: 1, userName: 'Daisy Fomndius', lastMsg: 'Lorem ipsum is simply...', time: '09:57' },
//     { id: 2, userName: 'Luther Bin', lastMsg: 'Lorem ipsum is simply...', time: '02 Apr' },
//     { id: 3, userName: 'Ram Kumar', lastMsg: 'Lorem ipsum is simply...', time: '09:38' },
//     { id: 4, userName: 'Waxy monto', lastMsg: 'Lorem ipsum is simply...', time: '06:30' },
//     { id: 5, userName: 'John hatter', lastMsg: 'Lorem ipsum is simply...', time: '09:58' },
//     { id: 7, userName: 'Morsy Vijay', lastMsg: 'Lorem ipsum is simply...', time: '08:30' },
//     { id: 8, userName: 'Morsy Vijay', lastMsg: 'Lorem ipsum is simply...', time: '08:30' },
//     { id: 9, userName: 'Morsy Vijay', lastMsg: 'Lorem ipsum is simply...', time: '08:30' },
//     { id: 10, userName: 'Morsy Vijay', lastMsg: 'Lorem ipsum is simply...', time: '08:30' },
//     { id: 11, userName: 'Morsy Vijay', lastMsg: 'Lorem ipsum is simply...', time: '08:30' },
//     { id: 12, userName: 'Morsy Vijay', lastMsg: 'Lorem ipsum is simply...', time: '08:30' },
//     { id: 13, userName: 'Morsy Vijay', lastMsg: 'Lorem ipsum is simply...', time: '08:30' },
//     { id: 14, userName: 'Morsy Vijay', lastMsg: 'Lorem ipsum is simply...', time: '08:30' },
//     { id: 15, userName: 'Morsy Vijay', lastMsg: 'Lorem ipsum is simply...', time: '08:30' },
//     { id: 16, userName: 'Morsy Vijay', lastMsg: 'Lorem ipsum is simply...', time: '08:30' },
//     { id: 17, userName: 'Morsy Vijay', lastMsg: 'Lorem ipsum is simply...', time: '08:30' },
//     { id: 18, userName: 'Morsy Vijay', lastMsg: 'Lorem ipsum is simply...', time: '08:30' },
//     { id: 19, userName: 'Morsy Vijay', lastMsg: 'Lorem ipsum is simply...', time: '08:30' },
//     { id: 20, userName: 'Morsy Vijay', lastMsg: 'Lorem ipsum is simply...', time: '08:30' },
//   ];





const Home = () => {
  console.log(socket,'socket=====');
  
    let userData = localStorage.getItem("user-data");
    userData = JSON.parse(userData);
    // const fileInputRef = useRef();
    const navigate = useNavigate();
    const [typingTimeout, setTypingTimeout] = useState();
    // const [files, setFiles] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [chat, setChat] = useState([]);
    // const [typinguser, setTypinguser] = useState('');
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    
  // const handleIconClick = () => {
  //   fileInputRef.current.click();
  // };

  // const handleFileChange = (e) => {
  //   setFiles([...e.target.files]);
  // };

    const handleUserClick = (user) => {
      // console.log(user,'ser user===');
      
      setSelectedUser(user);
      // console.log(selectedUser);
      // socket.emit('user_connected');
      socket.emit("user_connected", {
        currentUser: userData.userName,  // This should come from context or state
        withUser: user.userName
      });
      
    };
    
    useEffect(() => {

      const fetchUser = async () => {
         const response = await axios.get('https://chat-app-backend-8lel.onrender.com/api/user/getAlluser',{
          headers: {
            'x-access-token': localStorage.getItem("x-access-token"), // Set the custom header
         },
        });

       setUsers(response?.data);
      }
      fetchUser();

      
    },[]);

    useEffect(()=>{

      socket.on("receive_message", (msg) => {
        setChat((prev) => [...prev, msg]);
      });
  
      socket.on("typing", ({from,isUserTyping}) => {
        // console.log(from,isUserTyping,'from user');
        // console.log(selectedUser,'selectedUser user');
        // console.log(isUserTyping==true && from === selectedUser?.userName,'isUserTyping==true && from === selectedUser user');
        // console.log(message,'message user');
          
        setIsTyping(isUserTyping==true && from === selectedUser?.userName);
        
      });

      socket.on("message_history", (msgs) => {
        setChat(msgs);
      });

      return () => {
        socket.off("receive_message");
        socket.off("typing");
        // socket.off("message_read");
        socket.off("message_history");
      };
    },[selectedUser]);

    const handleTyping = (e) => {
      // console.log(userData);
      // console.log(selectedUser,'selcred');
        // Emit "typing started" if not already typing
          if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // prevent newline if using textarea
              sendMessage();
           }
      if (!isTyping) {
        // console.log(userData.userName,'ds');
        
        socket.emit("typing", { to: selectedUser.userName, from: userData.userName, isUserTyping:true });
      }
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
  
      // Set a new timeout to emit "typing stopped" after a delay (e.g., 1 second)
      const timeout = setTimeout(() => {
        socket.emit("typing", { to: selectedUser.userName, from: userData.userName,isUserTyping:false });
        // setTypinguser('');
      }, 1000); // Adjust the delay as needed
  
      setTypingTimeout(timeout); 
      
    };


    const sendMessage = async() => {
          // const formData = new FormData();
          // files.forEach(file => formData.append('files', file));

          // formData.append('sender_id', userData.userName);      // dynamic
          // formData.append('receiver_id', selectedUser.userName);    // dynamic
          // formData.append('message', message);
          // const uploadRes = await axios.post('http://127.0.0.1:3307/upload', formData);
          // const fileUrls = uploadRes.data.files; // array of file URLs
     if (message) {
         const msgData = {
        sender_id: userData.userName,
        receiver_id: selectedUser.userName,
        content: message
      };
      socket.emit("send_message", msgData);
      setChat((prev) => [...prev, { ...msgData, is_read: false }]);
      setMessage("");
     }
   
    };

    const logOut = () => {
      localStorage.clear();
      navigate("/signin")
    }
  
    return(
        <>
         <div className="h-screen flex flex-col sm:flex-row bg-[#f0f4ff]">
            <div className="w-full sm:w-16 bg-[#131140] flex sm:flex-col items-center justify-between sm:justify-start py-4 sm:py-6 px-4 sm:px-0 space-y-6 sm:space-y-8">
            <div className="flex sm:flex-col gap-6">
              <FaHome className="text-white text-xl cursor-pointer" />
              {/* <FaSearch className="text-white text-xl cursor-pointer" /> */}
              {/* <FaBell className="text-white text-xl cursor-pointer" /> */}
              {/* <FaCog className="text-white text-xl cursor-pointer" /> */}
              </div>
              <div className="hidden sm:block absolute bottom-4">
                <FaSignOutAlt className="text-white text-2xl cursor-pointer" onClick={logOut} />
                {/* <FaUserCircle className="text-white text-2xl cursor-pointer" /> */}
              </div>
              <div className="block sm:hidden">
                <FaUserCircle className="text-white text-2xl cursor-pointer" />
              </div>
            </div>

            {/* User List */}
            <div className={`sm:w-1/3 w-full ${selectedUser ? 'hidden sm:block' : 'block'}`}> 
              <div className="flex flex-col h-full p-4 bg-white shadow-lg">
                <div className="text-xl  mb-4"><span className="font-semibold">Chats ==</span> &nbsp; <span className="txt-sm">{userData?.userName}</span></div>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none"
                />
                <div className="overflow-y-auto flex-1">
                <ul className="space-y-2 pr-2">
                  {users.map((user) => (
                    <li
                      key={user.id}
                      className="flex justify-between items-center px-4 py-3 hover:bg-blue-100 cursor-pointer rounded-lg"
                      onClick={() => handleUserClick(user)}
                    >
                      <div>
                        <div className="font-semibold text-sm">{user?.userName || 'kk'}</div>
                        <div className="text-xs text-gray-500">{user?.lastMsg || 'No message'}</div>
                      </div>
                      <span className="text-xs text-gray-400">{user?.time || '10:00'}</span>
                    </li>
                  ))}
                </ul>
                </div>
              </div>
            </div>

            {/* Chat Box */}
            {selectedUser && (
              <div className="flex-1 flex flex-col h-full bg-white shadow-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="sm:hidden text-blue-500"
                  >
                    ← Back
                  </button>
                  <div className="font-semibold">{selectedUser?.userName}</div>
                  <div className="flex gap-4 text-blue-500">
                    <i className="fas fa-phone"></i>
                    <i className="fas fa-video"></i>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {chat.map((msg, index) => (
                    <div
                      key={index}
                      className={`text-sm p-2 rounded-lg w-fit max-w-xs break-words ${
                        msg.sender_id === selectedUser.userName
                          ? "bg-gray-200 text-gray-900 self-start mr-auto"
                          : "bg-blue-500 text-white self-end ml-auto"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                </div>


                {/* Input */}
                {isTyping && <p>{selectedUser?.userName} is typing...</p>}
                <div className="p-4 border-t flex items-center gap-2">
                 {/* <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden"/>
                  <FaPaperclip className="text-gray-500 cursor-pointer"  onClick={handleIconClick} /> */}
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleTyping}
                    placeholder="Type a message..."
                    className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
                  />
                  <FaMicrophone className="text-gray-500 cursor-pointer" />
                  <button className="text-blue-500 cursor-pointer" type="submit"  onClick={sendMessage}>
                    <IoSend size={20} />
                  </button>
                </div>
              </div>
            )}
         </div>
        </>
    )
}

export default Home;