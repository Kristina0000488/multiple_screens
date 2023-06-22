export type locationType<T> = {
    left: T;
    top: T;
    bottom: T;
    right: T;
    width?: T;
    height?: T;
}

export type locationScreenBlockType = {
    [ id: string ]: locationType<number> 
}

export type screenBlockType = { 
    path: string; 
    id: string; 
    initPosition?: locationType<number>, 
    name: string, 
    updTime: number,
    idCollection: string,
};

export type collectionType = {    
    id: string;
    name: string;
    screens: string[] //keyof screenBlockType[];    
}
export type collectionsType = collectionType[];
export type keysLocalStorageType = 'screens' | 'collections';
export type arrIdScreensType = string[];
