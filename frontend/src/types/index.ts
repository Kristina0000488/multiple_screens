export type locationType<T> = {
    left: T;
    top: T;
}

export type locationScreenBlockType = {
    [ id: string ]: locationType<number> 
}