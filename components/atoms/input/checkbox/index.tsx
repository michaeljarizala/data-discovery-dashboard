{/*
  Checkbox Input Atom

  A re-usable checkbox component with
  dynamic onChange event handler.
*/}

import React, { ChangeEvent } from "react"

interface Props {
	id: string
	className?: string
	checked?: boolean
	label?: string
	onChange: (e:ChangeEvent<HTMLInputElement>) => void
}

const CheckBox: React.FC<Props> = (props:Props): React.JSX.Element => {
	const {
		id,
		className,
		label = "",
		checked,
		onChange
	} = props

	return (
		<div>
			<label className="w-[100%] cursor-pointer" htmlFor="checkbox">
				<input
					className={`
						w-[20px]
						h-[20px]
						cursor-pointer
						${className}
					`}
					id={id}
					type="checkbox"
					checked={checked}
					onChange={onChange}
				/>
				{label && (<span>{label}</span>)}
			</label>
		</div>
	)
}

export default CheckBox