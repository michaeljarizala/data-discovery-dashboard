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
  useReducer,
  useRef,
} from "react"
import Card from "@/components/atoms/card"
import Arrow from "@/components/assets/svg/Arrow"
import NameBadge from "@/components/atoms/bage/nameBadge"
import { Company } from "@/components/utils/interfaces/companyInterface"
import { ICompanyContextValue } from "@/components/utils/contexts/companyContext"
import CheckBox from "@/components/atoms/input/checkbox"
import {
  companyReducer,
  initState
} from "@/components/utils/contexts/companyContext"


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

  // setting up of the reducer hook
  const [companyState = state, companyDispatch = dispatch] = useReducer(companyReducer, initState)

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
    Function for handling the change event
    of the checkbox input in each company in the list
  */}
  const handleCheckSelect = (e:React.ChangeEvent<HTMLInputElement>, item:Company) => {
    if (!isSelectedCard(item)) {
      companyDispatch({
        type: 'SELECT_COMPANIES',
        payload: item,
      })
    } else {
      companyDispatch({
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
      .then((data) => {
        companyDispatch({ type: "LOAD_COMPANIES", payload: data })
        // setLoading(false)
      })
    }, 2000)
    
    return () => {
      fetchController.abort()
    }
  }, [])

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
          companyDispatch({ type: "NEXT_PAGE", payload: pageStep })
          companyDispatch({ type: "APPEND_COMPANIES", payload: res })
        })
      }
    }
  }

  return (
    <div
      className={`
        flex
        flex-wrap
        gap-5
        p-5
        bg-slate-100
        h-[90vh]
      `}
    >
      {companyState.companies && companyState.companies.length > 0 ?
        companyState.companies.map((item: Company): React.JSX.Element => (
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
                  className="flex flex-[80%] gap-3 items-start"
                >
                  <div className="flex-[10%]">
                    <NameBadge name={item.name} />
                  </div>
                  <div className="flex-[85%] text-sm md:text-md xl:text-lg">{item.name}</div>
                  <div className="flex-[5%] flex justify-end">
                    <CheckBox
                      id={`company_cb_${item.id}`}
                      checked={isSelectedCard(item)}
                      onChange={(e) => handleCheckSelect(e, item)}
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
        <div className="flex w-full h-full justify-center items-center">
          <div className="text-lg">loading companies</div>
        </div>
      )}
    </div>
  )
}

export default CompanyList