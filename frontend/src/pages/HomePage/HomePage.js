import React from "react";
import Header from "../../components/Header";
import SockJS from "sockjs-client";
import { io } from "socket.io-client";

const HomePage = () => {
  const socket = new WebSocket("ws://localhost:8080/ws");
  socket.onopen = (e) => {
    console.log("ok: ", e);
  };
  socket.addEventListener("message", (event) => {
    console.log("Message from server ", event.data);
  });
  return (
    <>
      <Header title={"Главная"} />
      <div className="page">
        <section className="wrapper">
          <div className="page-content">
            <div className="test">123</div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
