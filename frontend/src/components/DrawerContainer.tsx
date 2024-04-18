import React from 'react';

import { Drawer } from 'antd';


type Props = { 
    children: React.ReactNode;
    open: boolean;
    title?: string;
    width?: number; 
    setOpen: (value: boolean) => void;
}

const DrawerContainer = (props: Props) => {
  const { children, title='', open=false, width=350, setOpen } = props;

  const onClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
        title={ title }
        width={ width }
        onClose={onClose}
        open={open}
        bodyStyle={{ paddingBottom: 80 }}
        destroyOnClose
        maskClosable={ false }
    >
        { children }
    </Drawer>
  );
};

export default DrawerContainer;