import React, { memo } from 'react';
import { Button, message, Upload } from 'antd';
import { ChartData } from '../types';
import { observer } from "mobx-react-lite";

// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';



//var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

type Props = {
    data: ChartData[]
}

const Chart = (props: Props) => {
    const { data } = props;

    const options = {
        zoomEnabled: true,
        animationEnabled: true,
        title: {
            text: ""
        },
        axisY:{
            interlacedColor: "",
            gridColor: ""
        },
        axisX: {
            valueFormatString: "HH:mm"
        },
        markerType: 'none',
        data  
    }
    console.log(data)
    return (
        <CanvasJSChart options={options} />
    )
};

export default observer(Chart);