{/*
  Name Badge Atom

  A re-usable component for showing
  a badge of initials, based on the
  given base string value.
*/}

import { FC, JSX } from "react"
import { extractInitials } from "@/components/utils/string";

const NameBadge: FC<{name:string}> = ({ name }): JSX.Element => {

    return (
        <div
            className={`
                flex
                items-center
                justify-center
                p-2
                w-[50px]
                h-[50px]
                rounded-[50px]
                bg-black
                text-white
            `}
    >
            {extractInitials(name)}
        </div>
    )
}

export default NameBadge