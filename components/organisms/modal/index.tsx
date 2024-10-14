{/*
  Modal Organism

  A re-usable component for
	toggling a modal whereever
	we needed.
*/}

import React, { ReactNode } from "react"
import { IModalContextValue } from "@/components/utils/contexts/modalContext"


interface Props {
	children: ReactNode
	modalState: IModalContextValue
}
const ModalMask: React.FC<Props> = (props: Props): React.JSX.Element => {
	const {
		children,
		modalState: { state }
	} = props

	return (
		<div
			className={`
				fixed
				top-0
				left-0
				w-full
				h-full
				bg-black
				bg-opacity-50

				${!state.open ? 'hidden' : ''}
		`}>
			{ children }
		</div>
	)
}

interface ModalContentProps {
	children: ReactNode
}
const ModalContent: React.FC<ModalContentProps> = (props: ModalContentProps): React.JSX.Element => {
	const { children } = props

	return (
		<div className="
			mt-20
			w-[90%]
			md:w-[50%]
			mx-auto
			bg-white
			shadow-md
			p-5
			rounded-md
		">
			{children}
		</div>
	)
}

interface ModalProps {
	children: ReactNode
	modalState: IModalContextValue
}
const Modal: React.FC<ModalProps> = (props: ModalProps): React.JSX.Element => {
	const {
		children,
		modalState: { state, dispatch }
	} = props

	return (
		<ModalMask modalState={{ state, dispatch }}>
			<ModalContent>
				{ children }
			</ModalContent>
		</ModalMask>
	)
}

export default Modal