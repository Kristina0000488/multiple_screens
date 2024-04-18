import * as types from '../types';


class LocalStorage {
    private getItem(key: string) {
        const data = localStorage.getItem(key);

        if (data) {
            return JSON.parse(data);
        }
    }

    private setItem(key: string, value: any) {
        const item = JSON.stringify(value);

        localStorage.setItem(key, item);
    }

    private removeItem(key: string) {
        localStorage.removeItem(key);
    }

    public async get(key: types.KeysLocalStorage): Promise<any[] | string> {
        const data = await this.getItem(key);

        return data;
    }

    public async set(value: any[], key: types.KeysLocalStorage): Promise<void> {
        this.setItem(key, value);
    }

    public async remove(key: types.KeysLocalStorage): Promise<void> {
        this.removeItem(key);
    }

    public async setCurrentCollection(value: string): Promise<void> {
        this.setItem(types.KeysLocalStorage.CurrentCollection, value);
    }
}


const instance = new LocalStorage();

export default instance;