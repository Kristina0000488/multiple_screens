import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';

const props: UploadProps = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};



type Props = {
    name: string,
    action?: string;//'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    headers?: Record<string, string>,
    onChange: (info: UploadChangeParam) => void;
}

const UploadBtn = (props: Props) => {
    const {
        headers = {
            authorization: 'authorization-text',
        },
        name, 
        action,
        onChange
    } = props;

    return (
        <Upload headers={headers} name={name} action={action} onChange={(info) => onChange(info)}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
    )
};

export default UploadBtn;