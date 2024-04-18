import React, { useState, useEffect } from 'react';

import { Select as SelectAntd, Space, ConfigProvider } from 'antd';

import { theme } from '../pages/configProvider';


type Props = {
    handleChange: (value: string) => void;
    options: { value: string, label: string, disabled?: boolean }[];
    currentValue: string;
    placeholder?: string;
    width?: number;
}

const Select = (props: Props) => {   
    const [ value, setValue ] = useState<string>('');

    const { handleChange, options, width=120, placeholder='', currentValue } = props;

    useEffect( () => { //console.log(currentValue, options, 'sel')
        setValue( currentValue /**options[ 0 ].value*/ );
    }, [ currentValue ] );

    const filterOption = (
        input: string,
        option: { label: string; value: string }
    ) => {
        return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    };
    
    return (
        <>{ 
            options && <Space wrap>
                <ConfigProvider theme={{
                    components: {
                        Select: theme.select
                    },
                    token: theme.tokenSelect
                }}>
                    <SelectAntd
                        placeholder={ placeholder }
                        showSearch
                        value={ value }
                        defaultValue={ currentValue /*|| options[ 0 ].value*/ }
                        style={{ width, zIndex: 1000 }}
                        onChange={ (value: string) => {
                            handleChange(value);
                            setValue(value); console.log(value, 'sel')
                        } }
                        options={ options }
                        optionFilterProp="children"
                        filterOption={ (input, option) => filterOption(
                            input,
                            option as { label: string; value: string }
                        ) }
                    />
                </ConfigProvider>
            </Space> 
        }</>
    )
};

export default Select;