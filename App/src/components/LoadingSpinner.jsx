import logo from "../components/images/logo.png";
import { Transition } from "@headlessui/react";

const LoadingSpinner = () => {
	return (
		<Transition
			show={true}
			enter="transition-opacity duration-1000"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="transition-opacity duration-1000"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
			>
			<div className="w-full h-full flex items-center justify-center">
				<img src={logo} alt="Intelliquiz logo" className="w-32 h-32 animate-fade-in-out"/>
			</div>
		</Transition>
	)
}

export default LoadingSpinner;
