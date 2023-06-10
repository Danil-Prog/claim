import React from 'react';


import Header from '../../components/Header';


const HomePage = ({ userContext }) => {
  const user = userContext.getUser({ userContext });

    const handleSubmit = async (e) => {
        e.preventDefault();

    };

  return (
    <>
      <Header title={'Главная'} />
        <div className="page">
            <section className="wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="page-content">

                    </div>
                </form>
            </section>
        </div>
    </>

  );
};

export default HomePage;
