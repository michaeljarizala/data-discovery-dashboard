{/*
  Company List Organism

  An interface that lists
  companies. Each list item is 
  a card, defined using the
  re-usable atomic component Card.
*/}

import React, {
  useCallback,
} from "react"
import Card from "@/components/atoms/card"
import Arrow from "@/components/assets/svg/Arrow"
import NameBadge from "@/components/atoms/bage/nameBadge"
import { Companies } from "@/components/utils/types/companyType"
import { Company } from "@/components/utils/interfaces/companyInterface"
import { ICompanyContextValue } from "@/components/utils/contexts/companyContext"
import CheckBox from "@/components/atoms/input/checkbox"


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
  dataSource: Companies,
  header?: string,
  companyState: ICompanyContextValue
}

const CompanyList: React.FC<Props> = (props: Props): React.JSX.Element => {
  const {
    dataSource = [],
    companyState: { state, dispatch },
  } = props

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

  return (
    <div
      className={`
        flex
        flex-wrap
        gap-5
        p-5
        bg-slate-100
      `}
    >
      {dataSource.map((item: Company): React.JSX.Element => (
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
      ))}
    </div>
  )
}

export default CompanyList