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
import {
  CompanyProvider,
  companyReducer,
  initState
} from "@/components/utils/contexts/companyContext"

const CompanyList = lazy(() => import("@/components/organisms/company/companyList"))


// the main component
const Dashboard: React.FC = (): React.JSX.Element => {

  // setting up local state for loading indicator
  const [loading, setLoading] = useState<boolean>(false)

  // setting up of the reducer hook
  const [state, dispatch] = useReducer(companyReducer, initState)
  
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
    </CompanyProvider>
  )
}

export default Dashboard