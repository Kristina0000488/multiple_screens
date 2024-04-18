import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";
import * as types from "../types";
import { store } from "../store";


let api = axios.create( { } );

api.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
api.defaults.headers.common['Accept']     = 'application/json';
api.defaults.baseURL                      = '/';

type Response<T> = {
    data: T,
    status:number
}

class WrapedApi
{
    constructor( 
        public readonly api: AxiosInstance, 
        private token?: string 
    ) { }

    private async request<T, D extends Object>(
        method: string, 
        postfix: string, 
        data?: D, 
        allowStatuses: number[ ] = [ 200, 201 ], 
        postfile?: boolean
    ) : Promise<Response<T>>
    {         
        try {
            let headers = {
                'Content-Type': 'application/json'
            } as AxiosRequestHeaders;

            let options = { 
                method,
                url: `/${ postfix }`,
                body: data,
                headers,
                data,
            };

            if (postfile)
            {
                headers = {
                    "Content-Type": "multipart/form-data"
                } as AxiosRequestHeaders; 
            }     
                
            let response = await this.api(options);

            if (allowStatuses.includes(response.status) ) { 
                return { data: response.data as T, status: response.status };
            } else {
                throw new Error( `Bad response ${response.status}`);
            }
        } catch ( error: any ) {
            console.error( error, 'error' );

            store.addError(error.message as string);

            throw error;
        }
    }

    private async get<T>(url: string, allowStatuses: number[ ] = [ 200, 201 ]): Promise<Response<T>> 
    {
        return await this.request( 'get', url, undefined, allowStatuses );
    }

    private async put<T, D extends Object>( url: string, data: D ) : Promise<Response<T>> 
    { 
        return await this.request( 'put', url, data )  
    }
    
    private async post<T, D extends Object>( url: string, data: D, postfile: boolean = false) : Promise<Response<T>> 
    {
        return await this.request( 'post', url, data, undefined, postfile )  
    }

    private async delete<T, D extends Object>( url: string ) : Promise<Response<T>> 
    {
        return await this.request( 'delete', url, undefined )  
    }

    async getScreens(): Promise<Response<types.RoughScreens>> 
    { 
        return await this.get( `screens`, [ 200, 304 ] );    
    }

    async getScreen(id: string): Promise<Response<types.ScreenBlock>>
    {
        return await this.get( `screens/${ id }`, [ 200, 304 ] );    
    }
        
    async getCollections(): Promise<Response<types.Collection[]>>
    {
        return await this.get( `collections`, [ 200, 304 ] );    
    }

    async getCollection(id: string): Promise<Response<types.Collection>>
    {
        return await this.get( `collections/${ id }`, [ 200, 304 ] );    
    }

    async createScreen(
        data: types.InitScreenBlock | types.InitScreenBlock[], 
        collectionId: string
      ): Promise<Response<types.ScreenBlock>>
    {
        const newData = {
            screens: !Array.isArray(data) ? [ data ] : data,
            collectionId
        };

        return await this.post( `screens`, newData );    
    }

    async createChart(
        data: types.InitScreenBlock/* | types.InitScreenBlock[]*/, 
        collectionId: string,
        username?: string,
        password?: string
      ): Promise<Response<types.ScreenBlock>>
    {
        const newData = {
            screen: /*!Array.isArray(data) ? [ data ] :*/ data,
            collectionId,
            username,
            password
        };

        return await this.post( `chart`, newData );    
    }

    async copyScreen(
        data: string[], //ids
        collectionId: string
      ): Promise<Response<types.ScreenBlock>>
    {
        const newData = {
            ids: data,
            collectionId
        };

        return await this.post( `copy`, newData );    
    }

    async createCollection(data: types.InitCollection): Promise<Response<types.Collection>>
    {
        return await this.post( `collections`, data );    
    }

    async updateCollection(id: string, data: types.Collection) : Promise<Response<types.Collection>>
    {
        return await this.put( `collections/${ id }`, data );    
    }

    async updateScreen(id: string, data: types.ScreenBlock) : Promise<Response<types.ScreenBlock>>
    {
        return await this.put( `screens/${ id }`, data );    
    }

    async updateScreens(data: types.ScreenBlock[]) : Promise<Response<types.ScreenBlock[]>>
    {
        return await this.put( `screens`, data );    
    }

    async deleteCollection(id: string) : Promise<Response<{}>>
    {
        return await this.delete( `collections/${ id }` );    
    }

    async deleteScreen(id: string) : Promise<Response<{}>>
    {
        return await this.delete( `screens/${ id }` );    
    }
}


const client = new WrapedApi( api );

export { client };