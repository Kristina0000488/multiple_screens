export type locationType<T> = {
    left: T;
    top: T;
    bottom: T;
}

export type locationScreenBlockType = {
    [ id: string ]: locationType<number> 
}

export type positionType = { x: number, y: number };

export type screenBlockType = { path: string; id: string; initPosition?: positionType };