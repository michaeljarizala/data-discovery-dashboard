{/*
  Company List Organism

  An interface that lists
  companies. Each list item is 
  a card, defined using the
  re-usable atomic component Card.
*/}

import React, {
  useCallback,
  useEffect,
  useRef,
  useReducer,
} from "react"
import Card from "@/components/atoms/card"
import Arrow from "@/components/assets/svg/Arrow"
import NameBadge from "@/components/atoms/bage/nameBadge"
import { Company, INextPage } from "@/components/utils/interfaces/companyInterface"
import { ICompanyContextValue } from "@/components/utils/contexts/companyContext"
import CheckBox from "@/components/atoms/input/checkbox"
import Button from "@/components/atoms/button"
import { modalInitState, modalReducer } from "@/components/utils/contexts/modalContext"
import { EPCompany } from "@/components/utils/interfaces/companyInterface"
import Skeleton from "@/components/atoms/skeleton"


{/*
  Props interface to be passed within
  the CardList component.

  Optional props:
  =================
  • cardItemClassName - extra classes
  for the card item component. You may
  use this to override default tailwind
  classes.

  Required props:
  =================
  • dataSource - defines the data source
  for the card list. It must be an array.
*/}
interface Props {
  cardItemClassName?: string,
  header?: string,
  companyState: ICompanyContextValue
}

const CompanyList: React.FC<Props> = (props: Props): React.JSX.Element => {
  const {
    companyState: { state, dispatch },
  } = props

  // setting up the list ref for infinite scrolling
  const listRef = useRef<HTMLDivElement>(null)

  // setting up  of the modal reducer hook
  const [modalState, modalDispatch] = useReducer(modalReducer, modalInitState)

  {/*
    Helper function for fetching companies
    from the '/api/companies' API endpoint.
    Implements AbortController interface for
    managing Fetch request and clean-up of
    associated useEffect usage below.
  */}
  const loadCompanies = async (p:number, signal?:AbortSignal)
  : Promise<EPCompany> => {

    let data:EPCompany = { data: [] } // return variable

    // begin fetching and assign result to 'data'
    await fetch(`/api/companies?page=${p}&size=18}`, { signal })
    .then((res) => res.json())
    .then((res): void => { data = res })
    .catch((err) => {
      if (err.name === 'AbortError') {
        console.log('Call aborted');
      } else {
        console.log("Unhandled exception: ", err)
      }
    })

    return data
  }

  {/*
    Helper callback function for checking if given item
    is one of the selected items. Accepts 1 argument
    of type Company.
  */}
  const isSelectedCard = useCallback((item:Company) => {
    const q = state.selectedCompanies.find((itm) => itm.id === item.id)
    if (q && q.id)
      return true

    return false
  }, [state.selectedCompanies])

  {/*
    Function for handling the click event
    on each company card
  */}
  const handleCompanySelect = (item:Company
    , e?:React.MouseEvent<HTMLDivElement>|React.ChangeEvent<HTMLInputElement>) => {
      
      e?.stopPropagation()

      if (!isSelectedCard(item)) {
        dispatch({
          type: 'SELECT_COMPANIES',
          payload: item,
        })
      } else {
        dispatch({
          type: 'DESELECT_COMPANIES',
          payload: item,
        })
      }
  }

  // ==== useEffect calls ====
  // =========START===========

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
      .then((res) => {
        dispatch({ type: "LOAD_COMPANIES", payload: res.data })
        // setLoading(false)
      })
    }, 2000)
    
    return () => {
      fetchController.abort()
    }
  }, [dispatch])

  // helper function for handling inifinte scrolling
  const handleScroll = () => {
    if (listRef.current) {
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
      } = listRef.current

      // monitor if scrolling reaches the bottom
      if (scrollTop + clientHeight >= scrollHeight) {
        const nextPage = state.page + 1
        const nextPagePayload:INextPage = { page: nextPage, totalPages: 0 }

        {/*
          Here we make use of the canPaginate company state
          to control pagination. If all pages have been traversed,
          there is no point in calling the API. This prevents unnecessary
          waste of the resource.
          
          If there is an update to the company data, we can use another
          method to validate canPaginate back to true to allow recall
          to the endpoint e.g. use SSE to signal the component to fetch
          for new or updated data. But that is outside the scope of this
          assessment so it is not implemented here.
        */}
        if (state.canPaginate) {
          loadCompanies(nextPage)
          .then((res) => {
            nextPagePayload["totalPages"] = res.totalPages || nextPage
            dispatch({ type: "NEXT_PAGE", payload: nextPagePayload })
            dispatch({ type: "APPEND_COMPANIES", payload: res.data })
          })
        }
      }
    }
  }

  return (
    <>
      <div className="flex flex-col h-[90vh]">
        <div ref={listRef} className="
            flex
            flex-wrap
            gap-5
            p-5
            h-[100%]
            overflow-y-scroll
          "
          onScroll={handleScroll}
        >
          {state.companies && state.companies.length > 0 ?
            state.companies.map((item: Company): React.JSX.Element => (
              <Card key={item.id}
                className={`
                  !flex-[100%]

                  md:grow-0

                  md:!flex-[30%]
                  lg:!flex-[31%]
                  xl:!flex-[32%]
                `}
              >
                <div
                  className="
                    h-[100%]
                    flex
                    flex-col
                    justify-between
                  "
                >
                  <div
                    className="flex flex-[80%] gap-3 items-start cursor-pointer"
                    onClick={(e) => handleCompanySelect(item, e)}
                  >
                    <div className="flex-[10%]">
                      <NameBadge name={item.name} />
                    </div>
                    <div className="flex-[85%] text-sm md:text-md xl:text-lg text-black">{item.name}</div>
                    <div className="flex-[5%] flex justify-end">
                      <CheckBox
                        id={`company_cb_${item.id}`}
                        checked={isSelectedCard(item)}
                        onChange={(e) => handleCompanySelect(item, e)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-[20%] items-center">
                    <a
                      className="
                        ml-auto
                        font-code
                        text-[.6rem]
                        font-bold
                        text-slate-500
                        uppercase
                        tracking-wider

                        md:text-[.7rem]
                    "
                      href={item.url}
                      target="_blank">
                        Explore website
                    </a>
                    <Arrow className="fill-slate-400" />
                  </div>
                </div>
              </Card>
            )
          ) : (
            <div className="flex w-full h-full justify-center">
              <div className="flex w-full flex-wrap gap-2 p-5">
                <Skeleton /> <Skeleton /> <Skeleton />
                <Skeleton /> <Skeleton /> <Skeleton />
                <Skeleton /> <Skeleton /> <Skeleton />
              </div>
            </div>
          )}
        </div>  
      </div>
      <div
        className="
          flex
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
              text-black
          ">

            Companies
          </div>
          <div className="text-slate-500 text-sm md:text-md lg:text-lg">
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
    </>
  )
}

export default CompanyList