export type locationType<T> = {
    left: T;
    top: T;
    bottom: T;
}

export type locationScreenBlockType = {
    [ id: string ]: locationType<number> 
}