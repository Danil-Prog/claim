import React from 'react';
import Header from '../../components/Header';
import SockJS from 'sockjs-client';
import { io } from 'socket.io-client';

const HomePage = () => {
  // const sock = new SockJS('http://localhost:8080/ws');
  const socket = new WebSocket('ws://localhost:8080/ws');
  socket.addEventListener('message', (event) => {
    console.log('Message from server ', event.data);
  });
  return (
    <>
      <Header title={'Главная'} />
      <div className="page">
        <section className="wrapper">
          <div className="page-content">123</div>
        </section>
      </div>
    </>
  );
};

export default HomePage;
