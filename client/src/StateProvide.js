import React, { createContext, useReducer, useContext } from "react";

//Preparing the data layer
export const StateContext = createContext();

export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
    {/* here child is App in the index,js */}
  </StateContext.Provider>
);

//this is the main hook which allows us to pull information from the data layer
export const useStateValue = () => useContext(StateContext);
