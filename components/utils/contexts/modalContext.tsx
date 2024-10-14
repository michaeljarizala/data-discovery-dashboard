{/*
  Modal Context API

  Here we manage the state, types
  reducer, context, and provider
  for the Modal component.
*/}

import { createContext, useReducer } from "react"

// Declaration of Modal state
export type State = {
    open: boolean
}

// Declaration of Modal actions
type Open = {
    readonly type: "OPEN"
    readonly payload: boolean
}

// Combination of actions
export type Actions = Open

// State initialization
export const modalInitState = {
    open: false
}

// Declaration of Modal reducer
export const modalReducer = (state: State, action: Actions)
: State => {
    switch(action.type) {
        case "OPEN":
            console.log("ModalReducer OPEN called", open)
            return {
                ...state,
                open: action.payload,
            }
        default: return state
    }
}

export interface IModalContextValue {
    state: State
    dispatch: React.Dispatch<Actions>
}
export const ModalContext = createContext<IModalContextValue>({
    state: modalInitState,
    dispatch: (action) => console.error(
        "Attempted dispatch outside of a provider.", action)
})

interface IModalProvider {
    children: React.ReactNode
}
export const ModalProvider = ({ children }: IModalProvider)
: JSX.Element => {
    const [state, dispatch] = useReducer(modalReducer, modalInitState)

    return (
        <ModalContext.Provider value={{ state, dispatch }}>
            { children }
        </ModalContext.Provider>
    )
}

