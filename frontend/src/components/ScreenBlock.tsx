import React from 'react';

import '../css/ScreenBlock.css';

type Props = {
    path: string;
    isResize: boolean;
}

function ScreenBlock(props: Props) { 
    const { path, isResize } = props;   

    return (
        <div className={`screenBlock ${ isResize ? 'resize' : '' }`} id="screen">
            <iframe src={ path } allowFullScreen />
        </div>
    )
}

export default ScreenBlock;
