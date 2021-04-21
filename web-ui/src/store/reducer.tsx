import { RootReducerAction, RootReducerActionType, RootStateType } from './type';

export default function reducer(state: RootStateType, action: RootReducerAction) {
  switch(action.type) {
    case RootReducerActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case RootReducerActionType.SET_SETTING:
      return {
        ...state,
        setting: action.payload,
      };
    default: 
      return state;
  }
}
