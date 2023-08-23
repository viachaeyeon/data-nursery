import React from "react";

function index() {
  return <div></div>;
}
export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: "/dashboard",
    },
  };
};

export default index;
