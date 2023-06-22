




import { makeObservable, observable, action, toJS, runInAction, computed } from "mobx";
import { createContext } from "react";
import { arrIdScreensType, screenBlockType, collectionsType, collectionType } from '../types';
import localestorage from '../localStorage';


class Store {
    screens: screenBlockType[] = [];
    collections: collectionsType = [{name: 'first', screens: [], id:'1'}];

    constructor() {
        makeObservable( this, {
            screens: observable,
            getScreens: action,
            addScreen: action,
            updateScreens: action,
            removeScreen: action,
            _getScreens: computed,
            getCollections: action,
            _getCollections: computed,
            getAll: action,
        } )
    }

    async getScreens(): Promise<void> {
        const data: screenBlockType[] = await localestorage.get('screens');

        runInAction(() => this.screens = data);
    }

    async getCollections(): Promise<void> {
        const data: collectionsType = await localestorage.get("collections");

        runInAction(() => this.collections = data);
    }

    getAll(): void {
        this.getScreens();
        this.getCollections();
    }

    get _getScreens() {
        return this.screens;
    }

    get _getCollections() {
        return this.collections;
    }

    addScreen(path: string, name: string, updTime: number, idCollection: string = ''): void {   
        const id = 'screen' + this.screens.length; 
        const screen = { 
            path: `${ path }`, 
            id,
            name,
            updTime,
            idCollection,
            initPosition: { 
                left: 150, 
                top: 300, 
                right: 350, 
                bottom: 600, 
                width: 300, 
                height: 300 
            } 
        };
        
        runInAction(() => this.screens.push(screen));   
        runInAction(() => this.collections.find((collection) => idCollection === collection.id)?.screens.push(id));   
        runInAction(() => localestorage.set(this.screens, "screens"));
        runInAction(() => localestorage.set(this.collections, "collections"));
    }
    
    addCollection(name: string, arrIdScreens: arrIdScreensType): void {   
        const collection: collectionType = { 
            id: 'collect' + this.collections.length, 
            name, 
            screens: arrIdScreens
        };

        runInAction(() => this.collections.push(collection));   
        runInAction(() => localestorage.set(this.collections, 'collections'));
    }

    updateScreens(screens: screenBlockType[]): void {
        runInAction(() => this.screens = screens);
        runInAction(() => localestorage.set(this.screens, "screens"));
    }

    updateCollections(collections: collectionsType): void {
        runInAction(() => this.collections = collections);
        runInAction(() => localestorage.set(this.collections, 'collections'));
    }

    removeScreen(id: string): void {
        const findedIdScreen = [ ...this.screens ].findIndex( (value: screenBlockType) => value.id === id );
        const idCollection   = this.screens[findedIdScreen].idCollection;
        const indexColls     = [ ...this.collections ].findIndex((collectiob) => collectiob.id === idCollection);
        const indexScreen    = [ ...this.collections ][ indexColls ]?.screens.indexOf(id);

        if (indexScreen! > -1) { 
            this.collections[ indexColls ].screens.splice(indexScreen!, 1);
        }

        if (findedIdScreen !== -1) {    
            this.screens.splice(findedIdScreen, 1);
        } 

        runInAction(() => localestorage.set(this.screens, "screens"));
        runInAction(() => localestorage.set(this.collections, "collections"));
    }

    removeCollection(id: string): void {
        const findedId = [ ...this.collections ].findIndex( (value: collectionType) => value.id === id );

        if (findedId !== -1) {    
            this.collections.splice(findedId, 1)
        } 

        runInAction(() => localestorage.set(this.collections, 'collections'));
    }
}

export const store        = new Store();
export const storeContext = createContext(store);