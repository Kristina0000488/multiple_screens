import { store } from '../store';

import * as types from '../types';


class LocalStorage {
    //screens: string = 'screens';
    //collections: string = 'collections';

    constructor() { }

    #privateGetItem(key: string): any  {
        const data = localStorage.getItem(key);

        if (data) return JSON.parse(data);

        return [];        
    }

    #privateSetItem(key: string, value: any): void {
        const item = JSON.stringify(value);

        localStorage.setItem(key, item);
    }

    #privateRemoveItem(key: string): void {
        localStorage.removeItem(key);
    }

    async get(key: types.keysLocalStorageType): Promise<any[]> {
        const data: any[] = await this.#privateGetItem(key);

        return data;
    }

    async set(value: any[], key: types.keysLocalStorageType): Promise<void> {
        this.#privateSetItem(key, value);
    }

    async remove(key: types.keysLocalStorageType): Promise<void> {
        this.#privateRemoveItem(key);
    }
}


const instance = new LocalStorage();

export default instance;