import { Collection } from '../types';


export enum ChangeCollectionActionKind {
  ADDEDCOLLECTION = 'ADDEDCOLLECTION',
  ADDEDDESCRIPTION = 'ADDEDDESCRIPTION',
  ADDEDNAME = 'ADDEDNAME'
}

interface ChangeScreenAction {
  type: ChangeCollectionActionKind;
  payload: string | Collection;
}

export function changeCollectionReducer(collection: Collection, action: ChangeScreenAction): Collection {
    switch (action.type) {
      case ChangeCollectionActionKind.ADDEDCOLLECTION: {
        return { ...action.payload as Collection };
      }
      case ChangeCollectionActionKind.ADDEDDESCRIPTION: {
        return {
          ...collection,
          description: action.payload as string
        };
      }
      case ChangeCollectionActionKind.ADDEDNAME: {
        return {
          ...collection,
          name: action.payload as string
        };
      }
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }