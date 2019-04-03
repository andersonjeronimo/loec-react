import React from "react";

import "./styles.css";

import Main from "../../pages/main";

const Body = () => {
  return (
    <main role="main">
      <div className="jumbotron jumbotron-fluid">
        <div className="container container-fluid">
          <Main />
        </div>
      </div>
    </main>
  );
};

export default Body;
