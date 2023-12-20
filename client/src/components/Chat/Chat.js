import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import queryString from "query-string"; // -> get data from url
import io from "socket.io-client";

import "./Chat.css";

const ENDPOINT = "localhost:5000";

let socket;

const Chat = () => { // -> location comes from React Router (url params)
	let location = useLocation();

	const [name, setName] = useState("");
	const [room, setRoom] = useState("");
	const [users, setUsers] = useState("");
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		const { name, room } = queryString.parse(location.search); // -> location.search = obj of params
		socket = io(ENDPOINT); // -> instance of a socket
		setRoom(room);
		setName(name);
		socket.emit("join", { name, room }, ({error}) => {
			if (error) {
				alert(error);
			}
		});
	}, [location.search]);

	useEffect(() => {
		socket.on("message", (message) => {
			setMessages((messages) => [...messages, message]);
		});
		socket.on("roomData", ({ users }) => {
			setUsers(users);
		});
	}, []);

	const sendMessage = (event) => {
		event.preventDefault();
		if (message) {
			socket.emit("sendMessage", message, () => setMessage(""));
		}
	};

	return (
		<div className="outerContainer">
			<div className="container">
				<input
					value={message}
					onChange={(event) => setMessage(event.target.value)}
					onKeyDown={(event) => event.key === 'Enter' ? sendMessage(event) : null}
				/>
			</div>
		</div>
	);
};

export default Chat;
