import React from 'react';

import { 
    MoreOutlined, 
    PlusCircleFilled, 
    DeleteOutlined, 
    EditOutlined, 
    PlusCircleOutlined, 
    FundViewOutlined 
} from '@ant-design/icons';
import { FloatButton, ConfigProvider, Popconfirm } from 'antd';

import { MetaFloatBtns, IconFloatBtnsKind } from '../types';


type Props = {
    meta: MetaFloatBtns[];
    style?: { [ property: string ]: number | string };
    trigger?: 'click' | 'hover';
    theme?: Object
}

const FloatBtns = (props: Props) => {
    const { meta, trigger='hover', style={ left: 15, bottom: 20 }, theme } = props;

    const renderIcon = (icon: IconFloatBtnsKind)  => {
        switch (icon) {
            case IconFloatBtnsKind.CreateCollection:
                return <PlusCircleOutlined />;        
            case IconFloatBtnsKind.CreateScreen:
                return <FundViewOutlined />;
            case IconFloatBtnsKind.Remove:
                return <DeleteOutlined />;
            case IconFloatBtnsKind.Edit:
                return <EditOutlined />;                
            default:
                return <PlusCircleFilled />;
        }
    }

    const renderBtn = (value: MetaFloatBtns) => {
        if (value.popconfirm) {
            return <Popconfirm             
                title={ value.popconfirm }
                onConfirm={ value.onClick }
                okText={ 'Yes' }
                cancelText={ 'No' }
                cancelButtonProps={{ rootClassName: 'popconfirm_Onbtn' }}
            >
                <FloatButton 
                    style={{ marginTop: 8 }} 
                    tooltip={ value.tooltip } 
                    icon={ renderIcon(value.icon) } 
                />
            </Popconfirm>
        }

        return <FloatButton 
            style={{ marginTop: 8 }} 
            onClick={ value.onClick } 
            tooltip={ value.tooltip } 
            icon={ renderIcon(value.icon) } 
        />
    }

    return (
        <ConfigProvider theme={ theme }>
            <FloatButton.Group
                trigger={ trigger }
                type="primary"
                style={ style }
                icon={<MoreOutlined />}
            >
                { meta && meta.map( (value, id) => <div key={ id }>{ 
                    !value.hidden && renderBtn(value) 
                }</div> ) }
            </FloatButton.Group>
        </ConfigProvider>
    )
};

export default FloatBtns;