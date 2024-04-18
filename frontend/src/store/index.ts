import { toJS, runInAction, makeAutoObservable } from "mobx";
import { createContext } from "react";

import * as types from '../types';
import { client } from '../services/api';


class Store {
    screens: types.ScreenBlock[] = [];
    roughScreens: types.RoughScreens = {};
    collections: types.Collection[] = [];
    init = {
        left: 150, 
        top: 300, 
        right: 350, 
        bottom: 600, 
        width: 300, 
        height: 300 
    };
    status = 'initial';
    copiedScreens = {} as { [collectionID : string]: types.ScreenBlock<types.Location>[] };
    copiedScreenIds = {} as { [ collectionId : string] : { [screenId: string]: boolean } };
    errors = [] as types.ErrorList; 

    constructor() {
        makeAutoObservable(this);
    }

    getScreens = async () => {
        try {
            const data = await client.getScreens();

            runInAction( () => {
                this.roughScreens = data.data;
                this.screens = Object.values(this.roughScreens)  || [];
            } );
        } catch (error) {
            runInAction( () => {
                this.status = "error";
            } );
        }
    };

    getCollections = async () => {
        try {
            const data = await client.getCollections();

            runInAction( () => {  
                this.collections = data.data;
            } );
        } catch (error) {
            runInAction( () => {
                this.status = "error";
            } );
        }
    };

    getAll() {
        this.getScreens();
        this.getCollections();
    }

    get _getScreens() {
        return this.screens;
    }

    get _getRoughScreens() {
        return this.roughScreens;
    }

    get _getCollections() {
        return this.collections;
    }

    getCollectionById(id: string) {
        return this.collections.find( collection => collection.id === id ) ?? null;
    }

    getScreenById(id: string) {
        return this.screens.find( screen => screen.id === id ) ?? null;
    }
    
    createScreen = async (path: string, name: string, updTime: number, collectionId: string) => {   
        try {
            const obj: Record<string, types.Location> = {}; 
            obj[ collectionId ] = this.init; 
    
            const screen: types.InitScreenBlock = { 
                path: `${ path }`, 
                name,
                updTime,
                initPositions: obj,
            };

            const response = await client.createScreen( screen, collectionId );
            
            if (response.status === 201) {
                runInAction(() => {
                    this.status = "success";
                });

                this.getAll();
            } 
        } catch (error) {
            runInAction( () => {
                this.status = "error";
                
                console.error( error );
            } );
        }  
    }

    createChartScreen = async (path: string, name: string, updTime: number, collectionId: string, username?: string, password?: string) => {   
        try {

            const obj: Record<string, types.Location> = {}; 
            obj[ collectionId ] = this.init; 
    
            const screen: types.InitScreenBlock = { 
                path: `${ path }`, 
                name,
                updTime,
                initPositions: obj,
            };

            const response = await client.createChart( screen, collectionId, username, password );
            
            if (response.status === 201) {
                runInAction(() => {
                    this.status = "success";
                });

                this.getAll();
            } 
        } catch (error) {
            runInAction( () => {
                this.status = "error";
                
                console.error( error );
            } );
        }  
    }

    copyScreensToCollection = async (newCollectionId: string) => {   
        try {
            const ids = Object.values(this.copiedScreens)[0].map( (screen) => screen.id );

            const response = await client.copyScreen( ids, newCollectionId );

            if (response.status === 201) {
                runInAction(() => {
                    this.status = "success";
                });

                this.getAll();

                this.copiedScreens = {};
                this.copiedScreenIds = {};
            } 
        } catch (error) {
            runInAction( () => {
                this.status = "error";
                console.error( error );
            } );
        }  
    }

    createCollection = async (name: string, description?: string) => {
        try {
            const collection: types.InitCollection  = { 
                name, 
                description,
                screenIds: []
            };            

            const response = await client.createCollection( collection );

            if (response.status === 201) {
                runInAction(() => {
                    this.status = "success";
                });
                
                await this.getCollections();
            } 
        } catch (error) {
            runInAction( () => {
                this.status = "error";
                console.error( error );
            } );
        }
    }

    setCopiedScreens(
        collectionId: string, 
        id: string,
        path: string, 
        name: string, 
        updTime: number, 
        initPositions: types.LocationScreenBlock
    ) {
        try {
            const item = { 
                id,
                path, 
                name, 
                updTime, 
                initPositions: Object.values(initPositions)[0] 
            };
    
            if ( collectionId in this.copiedScreens) {
                this.copiedScreens[collectionId].push(item); 
            } else {
                this.copiedScreens = { [collectionId]: [ item ] };
            }
           // console.log(toJS( this.copiedScreens), toJS(this.copiedScreenIds), 'add' );
            this.setCopiedScreenIds( collectionId, id );
        } catch (error) {
            console.error(error);
        }
    }

    removeCopiedScreen(collectionId: string, screenId: string) {
        try {    
            if ( collectionId in this.copiedScreens) {
                this.copiedScreens[collectionId] = this.copiedScreens[collectionId].filter( screen => screen.id !== screenId );  

                if (this.copiedScreens[collectionId].length === 0) {
                   delete this.copiedScreens[collectionId];
                }

               // console.log(toJS( this.copiedScreens), 'remove');

                this.setCopiedScreenIds( collectionId, screenId, true );
            }            
        } catch (error) {
            console.error(error);
        }
    }

    setCopiedScreenIds(collectionId: string, screenId: string, remove: boolean = false) {
        try {            
            this.copiedScreenIds[ collectionId ] = { 
                ...this.copiedScreenIds[ collectionId ],
                [ screenId ]: !remove
            };
            console.log(toJS( this.copiedScreenIds), 'copied');
        } catch (error) {
            console.error(error);
        }
    }

    async updScreenPosition(location: types.LocationScreenBlock, idCollection: string) { 
        try {
            const updatedScreens = [];

            for (let idScreen in location) {
                const screen =  this.screens.find( screen => screen.id === idScreen );

                if (screen) {
                    let copied = { ...screen };
                    copied!.initPositions[ idCollection ] = toJS(location[ idScreen ]);
                    
                    updatedScreens.push(copied);
                }
                
            }

            const response = await client.updateScreens(updatedScreens);

            if (response.status === 200) {
                runInAction(() => {
                    this.status = "success";
                });

                await this.getScreens();
            }
        } catch (error) {
            console.error(error);
        }
    }

    updateChartData(screen: types.ScreenBlock) {
        try { console.log('start')
            if (screen) {
                this.roughScreens[ screen.id ] = screen;
            }
            console.log(toJS(this.roughScreens), screen, ' ===updated')
            runInAction(() => {
               this.screens = Object.values(this.roughScreens);
            })
        } catch (error) {
            console.error(error);
        }
    }

    changeCollection = async (collection: types.Collection) => {
        try {
            const response = await client.updateCollection( collection.id, collection );

            if (response.status === 200) {
                runInAction(() => {
                    this.status = "success";
                });
                
                await this.getCollections();
            } 
        } catch (error) {
            runInAction( () => {
                this.status = "error";

                console.error( error );
            } );
        }
    }

    changeScreen = async (screen: types.ScreenBlock) => { 
        try {
            const response = await client.updateScreen( screen.id, screen );

            if (response.status === 200) {
                runInAction(() => {
                    this.status = "success";
                });

                await this.getScreens();
            } 
        } catch (error) {
            runInAction( () => {
                this.status = "error";
                console.error( error );
            } );
        }
    }

    async removeScreen(id: string) {
        try {
            const response = await client.deleteScreen( id );

            if (response.status === 200) {
                runInAction(() => {
                    this.status = "success";
                });
                
                this.getAll();
            } 
        } catch (error) {
            console.error(error);
        }
    }

    async removeCollection(id: string) { 
        try {
            const response = await client.deleteCollection( id );

            if (response.status === 200) {
                runInAction(() => {
                    this.status = "success";
                });

                this.getAll();
            } 
        } catch (error) {
            console.error(error);
        }
    }

    addError(errorMessage: string) {
        try {
            this.errors.push({ message: errorMessage, id: String(this.errors.length + 1) });
            //console.log('add', toJS(this.errors))
        } catch (error) {
            console.error(error);
        }
    }

    removeError(id: string) {
        try {
            this.errors = [ ...this.errors ].filter( err => err.id !== id );
        } catch (error) {
            console.error(error);
        }
    }
}

export const store        = new Store();
export const storeContext = createContext<Store>(store);