import React from 'react';
import { Formik, Field, Form } from 'formik';

import Header from '../../components/Header';
import Dropdown from '../../components/Dropdown';
import { userApi } from '../../misc/UserApi';

const HomePage = ({ userContext }) => {
  const user = userContext.getUser({ userContext });

  return (
    <>
      <Header title={'Главная'} />
      <div>test</div>
    </>
  );
};

export default HomePage;
