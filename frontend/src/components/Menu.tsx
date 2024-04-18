import React from 'react';
import { DragOutlined, CheckOutlined } from '@ant-design/icons';
import { FloatButton, ConfigProvider, Button } from 'antd';

import FloatBtns from './FloatBtns';

import { MetaFloatBtns, IconFloatBtnsKind } from '../types';


type Props = {
  meta: MetaFloatBtns[];
  theme?: Object;
  endMove: boolean;
  currentScreenIdsLength: number;
  onClickDrag: () => void;
  onClickCheck: () => void;
}

const Menu = (props: Props) => {
  const { meta, theme, endMove, currentScreenIdsLength, onClickDrag, onClickCheck } = props;

  return (
    <div className='btn_group'>
      {endMove ? <>
        {currentScreenIdsLength > 0 && <ConfigProvider theme={theme} >
          <FloatButton
            type="primary"
            shape="circle"
            icon={<DragOutlined />}
            style={{ left: 65, bottom: 20 }}
            tooltip="Move screens"
            onClick={() => onClickDrag()}
          />
        </ConfigProvider>}
        <FloatBtns meta={meta} theme={theme} />
      </> : <ConfigProvider theme={theme} >
        <FloatButton
          type="primary"
          shape="circle"
          icon={<CheckOutlined />}
          style={{ left: 15, bottom: 20 }}
          className='custom_float_btn'
          onClick={() => onClickCheck()}
        />
      </ConfigProvider>
      }
    </div>
  )
};

export default Menu;