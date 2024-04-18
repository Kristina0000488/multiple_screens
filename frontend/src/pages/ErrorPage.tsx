import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from "react-router-dom";



const ErrorPage= () => {  
  let navigate = useNavigate(); 

  return (
    <div className='ErrorPage'>
      <div>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={ <Button onClick={ () => navigate("/") } type="primary">Back Home</Button> }
        />
      </div>
    </div>
  );
};

export default ErrorPage;