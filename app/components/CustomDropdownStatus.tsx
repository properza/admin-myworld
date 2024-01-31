import { on } from "node:events";
import React, { useEffect, useRef, useState } from "react";

interface CustomDropdownStatusProps {
	options: optionsDropdown[];
	defaultOption: string;
	onChange?: (option: string) => void;
}

interface optionsDropdown {
	title: string;
	shipmentStatus: string;
	color?: string;
}

function getDefaultOptions(options: optionsDropdown[], status: string) {
	return options.find(
		(item: optionsDropdown) => item.shipmentStatus === status,
	);
}

const CustomDropdownStatus: React.FC<CustomDropdownStatusProps> = ({
	options,
	defaultOption,
	onChange,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState(
		getDefaultOptions(options, defaultOption) || options[0],
	);
	// const dropdownRef = useRef(null);
	const dropdownRef = useRef<HTMLDivElement | null>(null);

	const handleSelect = (option: string) => {
		let selected = options.find(
			(item: optionsDropdown) => item.shipmentStatus === option,
		);
		setSelectedOption(selected || ({} as optionsDropdown));
		if (onChange) onChange(selected?.shipmentStatus || "");
		console.log(selected);
		toggleDropdown();
	};

	const toggleDropdown = () => {
		setIsOpen(!isOpen);
	};

	// เพิ่ม api update status ส่วนนี้
	const handleClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	return (
		<div className="flex relative" ref={dropdownRef}>
			<div
				className="h-6 px-1.5 py-0.5 bg-white rounded border border-sky-400 cursor-pointer"
				style={{
					borderColor: selectedOption.color,
					color: selectedOption.color,
				}}
			>
				<div
					className="flex justify-start items-center gap-1"
					onClick={toggleDropdown}
				>
					<p className="text-xs font-normal font-roboto">
						{selectedOption.title}
					</p>
					<img
						src="/images/chevron-down.svg"
						alt="More options"
						className="w-2 h-2 justify-center items-center"
						draggable="false"
						style={{ fill: selectedOption.color }}
					/>
				</div>
				{isOpen && (
					<div className="absolute bg-[#fff] border-1 top-[32px] text-center left-[0] w-full rounded-lg overflow-hidden shadow-lg z-10">
						{options.map((option, index) => (
							<div
								className="p-1 border-b-[1px] hover:bg-gray-100"
								key={index}
								onClick={() => {
									handleSelect(option.shipmentStatus);
								}}
								style={{ borderColor: option.color, color: option.color }}
							>
								{option.title}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default CustomDropdownStatus;
