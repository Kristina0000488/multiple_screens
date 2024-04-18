import { ScreenBlock } from '../types';


export enum ChangeScreenActionKind {
  ADDEDSCREEN = 'ADDEDSCREEN',
  ADDEDPATH = 'ADDEDPATH',
  ADDEDNAME = 'ADDEDNAME',
  ADDEDUPDTIME = 'ADDEDUPDTIME',
}


interface ChangeScreenAction {
  type: ChangeScreenActionKind;
  payload: number | string | ScreenBlock;
}


export function changeScreenReducer(screen: ScreenBlock, action: ChangeScreenAction): ScreenBlock {
    switch (action.type) {
      case ChangeScreenActionKind.ADDEDSCREEN: {
        return { ...action.payload as ScreenBlock };
      }
      case ChangeScreenActionKind.ADDEDPATH: {
        return {
          ...screen,
          path: action.payload as string
        };
      }
      case ChangeScreenActionKind.ADDEDUPDTIME: {
        return {
          ...screen,
          updTime: action.payload as number
        };
      }
      case ChangeScreenActionKind.ADDEDNAME: {
        return {
          ...screen,
          name: action.payload as string
        };
      }
      default: {
        throw Error('Unknown action: ' + action.type);
      }
    }
  }