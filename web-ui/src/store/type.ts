type ActionMap<M extends IPlainObject> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
      type: Key;
    }
    : {
      type: Key;
      payload: M[Key];
    }
};

export type RootStateType = {
  loading: boolean;
  setting: {
    locale: 'en' | 'zh';
  };
};

export enum RootReducerActionType {
  SET_LOADING = 'SET_LOADING',
  SET_SETTING = 'SET_SETTING',
}

type RootReducerActionPayload = {
  [RootReducerActionType.SET_LOADING]: RootStateType['loading'];
  [RootReducerActionType.SET_SETTING]: RootStateType['setting'];
};

export type RootReducerAction = ActionMap<RootReducerActionPayload>[keyof ActionMap<RootReducerActionPayload>];
