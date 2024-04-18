import ScreenBlock from "../components/ScreenBlock";

export type Location<T = number> = {
    left: T;
    top: T;
    bottom: T;
    right: T;
    width?: T;
    height?: T;
}

export type LocationScreenBlock = Record<string, Location>;
export type ChartData = {
    label: string;
    type: string;
    xValueFormatString: string;
    yValueFormatString: string;            
    xValueType: string;
    markerType?: string;
    dataPoints: Array<{[key: string]: number | Date | string}>;
};

export type ScreenBlock<T = LocationScreenBlock> = {
    path: string;
    id: string;
    initPositions: T;
    name: string;
    updTime: number;
    chartData?: ChartData[]; //Array<Record<string, string | Array<number | string>>>
};

export type RoughScreens = Record<string , ScreenBlock>;

export type InitScreenBlock<T = LocationScreenBlock> = Omit<ScreenBlock<T>, 'id'>;

export type Collection = {
    id: string;
    name: string;
    screenIds: string[];
    description?: string;
}

export type InitCollection = Omit<Collection, 'id'>;
export enum KeysLocalStorage {
    Screens = 'screens',
    Collections = 'collections',
    CurrentCollection = 'currentCollection'
}

//export type IconFloatBtns = 'createCollection' | 'createScreen' | 'remove' | 'edit';
export enum IconFloatBtnsKind {
    CreateCollection = 'createCollection',
    CreateScreen = 'createScreen',
    Remove = 'remove',
    Edit = 'edit'
}


export type MetaFloatBtns = {
    icon: IconFloatBtnsKind;
    onClick: () => void;
    hidden?: boolean;
    tooltip?: string;
    popconfirm?: string;
};

export type ErrorList = Array<{ message: string, id: string }>;