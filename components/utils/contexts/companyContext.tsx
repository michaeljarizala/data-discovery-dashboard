import { createContext, useReducer } from "react"
import { Company, INextPage } from "../interfaces/companyInterface"

// Declaration of Company state
export type State = {
    companies: Company[]
    selectedCompanies: Company[]
    page: number
    totalPages: number
    canPaginate: boolean
}

// Declaration of Company actions
type Load = { // use for initially loading companies
    readonly type: "LOAD_COMPANIES"
    readonly payload: Company[]
}
type NextPage = { // use for inifinite scrolling
    readonly type: "NEXT_PAGE"
    readonly payload: INextPage
}
type AppendCompanies = { // use for adding item to the list
    readonly type: "APPEND_COMPANIES"
    readonly payload: Company[]
}
type SelectCompanies = { // use for company selection
    readonly type: "SELECT_COMPANIES"
    readonly payload: Company
}
type DeselectCompanies = { // use for company deselection
    readonly type: "DESELECT_COMPANIES"
    readonly payload: Company
}
type RemoveCompanies = { // use for company deletion
    readonly type: "REMOVE_COMPANIES"
    readonly payload: Company[]
}
type UpdateTotalPages = { // use for company deletion
    readonly type: "UPDATE_TOTAL_PAGES"
    readonly payload: number
}

// Combination of company actions
export type Actions =
    Load | NextPage | AppendCompanies | SelectCompanies
    | DeselectCompanies | RemoveCompanies | UpdateTotalPages

// State initialization
export const initState = {
    companies: [],
    selectedCompanies: [],
    page: 1,
    totalPages: 0,
    canPaginate: true,
}

{/*
    For state properties that need
    to be cached, we declare them
    at this point.

    Here is an example of persisting
    the companies into the cache.

    Uncomment this if caching is
    necessary.
*/}
// let companiesCache = JSON.stringify([])
// if (typeof window !== 'undefined') {
//     companiesCache = localStorage.getItem("companies")
//         || JSON.stringify(initState.companies)
// }

// Declaration of company reducer
export const companyReducer = (state: State, action: Actions)
: State => {
    switch(action.type) {
        case "LOAD_COMPANIES":
            console.log("CompanyReducer LOAD_COMPANIES called", state.companies)
            // Uncomment when caching should be enabled
            // if (JSON.parse(companiesCache).length === 0) {
            //     localStorage.setItem("companies"
            //         ,JSON.stringify(action.payload))
            // }
            return {
                ...state,
                companies: action.payload,
            }
        case "NEXT_PAGE":
            console.log("CompanyReducer NEXT_PAGE called")
            console.log(state)

            {/*
                Control pagination by making sure the defined states
                are only changed when there is a reason to paginate.
                If the totalPages is larger than the page being accessed,
                then we set the canPaginate to false.
                
                The canPaginate state can then be used by a component
                to determine whether pagination is allowed in this context.
            */}
            if (state.totalPages === 0 || state.page < state.totalPages) {
                console.log("paginated")
                return {
                    ...state,
                    page: action.payload.page,
                    totalPages: action.payload.totalPages,
                }
            } else {
                console.log("not paginated")
                return {
                    ...state,
                    canPaginate: false
                }
            }

        case "APPEND_COMPANIES":
            console.log("CompanyReducer APPEND_COMPANIES called")
            localStorage.setItem(
                "companies", JSON.stringify([
                    ...state.companies, ...action.payload])
            )
            return {
                ...state,
                companies: [...state.companies, ...action.payload],
            }
        case "SELECT_COMPANIES":
            console.log("CompanyReducer SELECT_COMPANIES called",
                state.selectedCompanies)
            return {
                ...state,
                selectedCompanies: [...state.selectedCompanies
                    ,action.payload],
            }
        case "DESELECT_COMPANIES":
            console.log("CompanyReducer DESELECT_COMPANIES called")
            const deselectedCompanies = state.selectedCompanies.filter(
                (item) => item.id !== action.payload.id)
            return {
                ...state,
                selectedCompanies: deselectedCompanies,
            }
        case "REMOVE_COMPANIES":
            console.log("CompanyReducer REMOVE_COMPANIES called")
            const updatedCompanies = state.companies.filter(
                (item) => !action.payload.some(rItm => rItm.id === item.id))
            console.log("updated items", updatedCompanies)
            return {
                ...state,
                companies: updatedCompanies,
                selectedCompanies: [],
            }
        default: return state
    }
}

export interface ICompanyContextValue {
    state: State
    dispatch: React.Dispatch<Actions>
}
export const CompanyContext = createContext<ICompanyContextValue>({
    state: initState,
    dispatch: (action) => console.error(
        "Attempted dispatch outside of a provider.", action)
})

interface ICompanyProvider {
    children: React.ReactNode
}
export const CompanyProvider = ({ children }: ICompanyProvider)
: JSX.Element => {
    const [state, dispatch] = useReducer(companyReducer, initState)

    return (
        <CompanyContext.Provider value={{ state, dispatch }}>
            { children }
        </CompanyContext.Provider>
    )
}

