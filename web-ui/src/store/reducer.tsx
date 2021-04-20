export default function reducer(state: RootStateType, action: RootReducerType) {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        loading: !!action.payload,
      };
    default:
      return state;
  }
}
