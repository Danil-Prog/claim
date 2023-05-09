import { Navigate } from 'react-router-dom';
import React from 'react';

import UserContext from '../context/UserContext';
import Sidebar from '../components/Sidebar';

const HomePage = () => {
  const contextType = React.useContext(UserContext);

  return (
    <div>
      <Sidebar />
    </div>
  );
};

export default HomePage;
