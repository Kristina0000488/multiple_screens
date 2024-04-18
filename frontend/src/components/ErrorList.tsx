import React from 'react';
import { Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { observer } from "mobx-react-lite";

import { store } from '../store';


const ErrorList = () => {
  const { errors } = store;

  const renderError = (error: string, id: string) => {
    return <div className='error' key={ id }>
      { error }
      <Button 
        className='btn_error' 
        shape="circle" 
        type="text" 
        onClick={ () => store.removeError(id) } 
        icon={ <CloseCircleOutlined /> } 
      />      
    </div>;
  };

  return (
    <>
      { errors.length > 0 && <div className='errors'>
        { errors.map( error => renderError(error.message, error.id) ) }
      </div> }
    </>
  );
};

export default observer(ErrorList);