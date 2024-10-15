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

import React, { useEffect, useReducer, useState, lazy, Suspense } from "react"
import Button from "@/components/atoms/button"
import {
  CompanyProvider,
  companyReducer,
  initState
} from "@/components/utils/contexts/companyContext"
import Modal from "@/components/organisms/modal"
import { modalInitState, modalReducer } from "@/components/utils/contexts/modalContext"

const CompanyList = lazy(() => import("@/components/organisms/company/companyList"))


// the main component
const Dashboard: React.FC = (): React.JSX.Element => {

  // setting up local state for loading indicator
  const [loading, setLoading] = useState<boolean>(false)

  // setting up of the reducer hook
  const [state, dispatch] = useReducer(companyReducer, initState)

  // setting up  of the modal reducer hook
  const [modalState, modalDispatch] = useReducer(modalReducer, modalInitState)

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
      <Suspense fallback={
        <div className="
          flex
          justify-center
          items-center
          text-lg
          text-black
          text-center"
        >loading companies</div>
      }>
        <CompanyList
          header="name"
          companyState={{ state, dispatch }}
        />
      </Suspense>
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
    </CompanyProvider>
  )
}

export default Dashboard