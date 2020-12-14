export const initialState = {
  user: null,
};

export const actionTypes = {
  SET_USER: "SET_USER",
  LOGOUT_USER: "LOGOUT",
  UPDATE: "UPDATE",
  UPDATEPIC: "UPDATEPIC",
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action,
      };

    case actionTypes.LOGOUT_USER:
      return {
        user: null,
      };

    case actionTypes.UPDATE:
      return {
        ...state,
        followers: action.followers,
        following: action.following,
      };

    case actionTypes.UPDATEPIC:
      return {
        ...state,
        profile: action.profile,
      };

    default:
      return state;
  }
};

export default reducer;
