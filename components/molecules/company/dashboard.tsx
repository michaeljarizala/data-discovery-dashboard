{/*
  Company Dashboard Molecule

  A company dashboard interface that consists of
  the following:

  • List of companies with an initial length of 12 items
  • Each list item is a card that contains the ff:
    • company badge
    • company name
    • company url
    • selection toggle (checkbox)
  • A sticky footer containing the title of the
  interface, an a conditional DELETE button based
  on the selected items
*/}

import React, { useEffect, useReducer, useRef, useState } from "react"
import CompanyList from "@/components/organisms/company/companyList"
import Button from "@/components/atoms/button"
import { Company } from "@/components/utils/interfaces/companyInterface"
import {
  CompanyProvider,
  companyReducer,
  initState
} from "@/components/utils/contexts/companyContext"
import Skeleton from "@/components/atoms/skeleton"
import Modal from "@/components/organisms/modal"
import { modalInitState, modalReducer } from "@/components/utils/contexts/modalContext"


// the main component
const Dashboard: React.FC = (): React.JSX.Element => {

  // setting up local state for loading indicator
  const [loading, setLoading] = useState<boolean>(false)

  // setting up of the reducer hook
  const [state, dispatch] = useReducer(companyReducer, initState)

  // setting up  of the modal reducer hook
  const [modalState, modalDispatch] = useReducer(modalReducer, modalInitState)

  // setting up the list ref for infinite scrolling
  const listRef = useRef<HTMLDivElement>(null)

  {/*
    Helper function for fetching companies
    from the '/api/companies' API endpoint.
    Implements AbortController interface for
    managing Fetch request and clean-up of
    associated useEffect usage below.
  */}
  const loadCompanies = async (p:number, signal?:AbortSignal)
  : Promise<Company[]> => {

    let data:Company[] = [] // return variable

    // begin fetching and assign result to 'data'
    await fetch(`/api/companies?page=${p}&size=15}`, { signal })
    .then((res) => res.json())
    .then((res): void => { data = res.items })
    .catch((err) => {
      if (err.name === 'AbortError') {
        console.log('Call aborted');
      } else {
        console.log("Unhandled exception: ", err)
      }
    })

    return data
  }

  // helper function for handling inifinte scrolling
  const handleScroll = () => {
    if (listRef.current) {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
      } = listRef.current

      // monitor if scrolling reaches the bottom
      console.log(`${scrollTop} -- ${clientHeight} -- ${scrollHeight}`)
      if (scrollTop + clientHeight >= scrollHeight) {
        const nextPage = state.page + 1
        const pageStep = 1
        loadCompanies(nextPage)
        .then((res) => {
          dispatch({ type: "NEXT_PAGE", payload: pageStep })
          dispatch({ type: "APPEND_COMPANIES", payload: res })
        })
      }
    }
  }

  // helper function for handling data deletion
  const handleDeletion = () => {
    dispatch({
      type: 'REMOVE_COMPANIES',
      payload: state.selectedCompanies
    })
    modalDispatch({
      type: 'OPEN',
      payload: !modalState.open
    })
  }
  
  // set loading to true
  useEffect(() => {
    setLoading(true)

    return () => setLoading(false)
  }, [])

  // load companies from the API on initial render
  useEffect(() => {
    const fetchController = new AbortController()
    const fetchSignal = fetchController.signal

    {/*
      Since data is loaded from a JSON file,
      I wrap the fetch() call within setTimeout
      to simulate a loading scenario.
    */}
    setTimeout(() => {
      loadCompanies(1, fetchSignal)
      .then((data) => {
        dispatch({ type: "LOAD_COMPANIES", payload: data })
        setLoading(false)
      })
    }, 2000)
    
    return () => {
      fetchController.abort()
    }
  }, [])

  if (!loading && state.companies.length === 0) {
    return (
      <div className="w-full h-[100vh] flex align-center justify-center p-20">
        <div className="w-full h-[100vh] text-slate-400 text-center">
          There are no companies yet.
        </div>
      </div>
    )
  }

  return (
    <CompanyProvider>
      <div>
        <div
          ref={listRef}
          className="h-[90vh] xl:h-[80vh] mx-auto overflow-y-scroll"
          onScroll={handleScroll}
        >
            {loading ? (
              <div className="flex flex-wrap gap-2 p-5">
                <Skeleton /> <Skeleton /> <Skeleton />
                <Skeleton /> <Skeleton /> <Skeleton />
              </div>
            ) : (
              <CompanyList
                dataSource={state.companies}
                header="name"
                companyState={{ state, dispatch }}
              />
            )}
        </div>
        <div
          className="
            flex
            flex-[10vh]
            xl:h-[20vh]
            gap-2
            items-center
            justify-end
            gap-2
            h-[10vh]
            px-10
            bg-slate-200
            shadow-inner
            shadow-xl
            sticky
            bottom-0"
        >
          <div className="
            flex
            flex-col
            flex-[80%]
          ">
              <div className="
              flex-[80%]
              text-md
              md:text-xl
              xl:text-2xl
              font-semibold
              uppercase
              tracking-wider
            ">

              Companies
            </div>
            <div className="text-slate-400 text-sm md:text-md lg:text-lg">
              List of active companies
            </div>
          </div>
          <div className="flex-[20%] flex items-center justify-end">
            {state.selectedCompanies && state.selectedCompanies.length > 0 && (
              <Button
                label={`Remove (${state.selectedCompanies.length})`}
                type="button"
                onClick={() => {
                  modalDispatch({
                    type: "OPEN",
                    payload: !modalState.open
                  })
                }}
              />
            )}
          </div>
        </div>
        <Modal
          modalState={{ state: modalState, dispatch: modalDispatch }}
        >
          <div className="
            flex
            flex-col
            justify-between
          ">
            <div>
              You are about to delete {state.selectedCompanies.length}
              {state.selectedCompanies.length > 1 ? ' companies' : ' company'}. Do
              you want to continue?
            </div>

            <div className="flex justify-end gap-2 mt-10">
              <Button
                label="Cancel"
                theme="light"
                onClick={() => {
                  modalDispatch({
                    type: 'OPEN',
                    payload: !modalState.open
                  })
                }}
              />
              <Button label="Yes" onClick={handleDeletion} />
            </div>
          </div>
        </Modal>
      </div>
    </CompanyProvider>
  )
}

export default Dashboard