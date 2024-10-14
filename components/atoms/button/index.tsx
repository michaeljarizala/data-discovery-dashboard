{/*
  Button Atom

  Re-usable button component
  with dynamic onClick event handler.
*/}

import {
	FC,
	JSX,
	MouseEventHandler,
	ButtonHTMLAttributes
} from "react"
import { useRouter } from "next/router"

interface Props {
	className?: string,
	label?: string,
	link?: string,
	anchor?: boolean,
	type?: ButtonHTMLAttributes<HTMLButtonElement>["type"],
	theme?: string,
	onClick?: MouseEventHandler,
}

const Button: FC<Props> = (props: Props): JSX.Element => {
	const {
		className,
		label="Click Me",
		link="",
		anchor=undefined,
		type="button",
		theme="dark",
		onClick,
	} = props;
	
	const router = useRouter()

	const handleClick = () => {
		if (link.includes('https://')) {
			window.location.href = link
		} else {
			router.push(link)
		}
	}

	return (
		<>
			{anchor ? (
				<a
					className={`
						${className}
						border-0 outline-0 shadow-lg text-center rounded-[8px] p-3
						transition-all duration-500 bg-pos-0 hover:bg-pos-100 bg-size-200
						${theme === 'dark'
							? 'bg-zinc-900 hover:bg-gradient-to-l from-zinc-900 via-zinc-500 to-zinc-900 text-zinc-50'
							: 'bg-zinc-300 hover:bg-gradient-to-l from-zinc-300 via-zinc-200 to-zinc-300 text-zinc-900'
						}
					`}
					href={`#${anchor}`}
				>
					{label}
				</a>
			) : (
				onClick ? (
					<>
						<button
							className={`
								${className}
								border-0 outline-0 shadow-lg text-center rounded-[8px] p-3
								transition-all duration-500 bg-pos-0 hover:bg-pos-100 bg-size-200
								${theme === 'dark'
									? 'bg-zinc-900 hover:bg-gradient-to-l from-zinc-900 via-zinc-500 to-zinc-900 text-zinc-50'
									: 'bg-zinc-300 hover:bg-gradient-to-l from-zinc-300 via-zinc-200 to-zinc-300 text-zinc-900'
								}
							`}
							type={type}
							onClick={(e) => !onClick ? handleClick() : onClick(e)}
						>
							{label}
						</button>
					</>
				) : (
					<button
						className={`
							${className}
							border-0 outline-0 shadow-lg text-center rounded-[8px] p-3
							transition-all duration-500 bg-pos-0 hover:bg-pos-100 bg-size-200
							${theme === 'dark'
								? 'bg-zinc-900 hover:bg-gradient-to-l from-zinc-900 via-zinc-500 to-zinc-900 text-zinc-50'
								: 'bg-zinc-300 hover:bg-gradient-to-l from-zinc-300 via-zinc-200 to-zinc-300 text-zinc-900'
							}
						`}
						type={type}
					>
						{label}
					</button>
				)
			)}
		</>
	)
}

export default Button