import {
	createColumnHelper,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
	flexRender,
} from "@tanstack/react-table";
import PaginationNavigator from "./PaginationNavigator";
import { classNames } from "~/tailwind";
import {
	ChangeEvent,
	EventHandler,
	FC,
	FormEventHandler,
	useMemo,
	useRef,
	useState,
} from "react";
import CustomDropdownReward from "./CustomDropdownReward";
import { RewardDetail } from "~/models/reward.server";
import { Form, useSubmit } from "@remix-run/react";

const columnHelper = createColumnHelper<RewardDetail>();

// แก้ enum status ตรงนี้
const options = [
	{
		title: "เผยแพร่",
		shareStatus: true,
		color: "#1AA127",
	},
	{
		title: "ไม่เผยแพร่",
		shareStatus: false,
		color: "#414141",
	},
];

interface RewardTableProps {
	data: any;
}

const ChangeVisibility: FC<{
	id: string;
	defaultValue: string;
}> = ({ id, defaultValue }) => {
	const submit = useSubmit();
	const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		try {
			submit(e.currentTarget, { replace: true });
		} catch (error) {
			console.log(error);
		}
	};
	const [value, setValue] = useState(defaultValue);
	const formRef = useRef<HTMLFormElement>(null);

	return (
		<Form method="post" onSubmit={handleFormSubmit} ref={formRef}>
			<input name="id" value={id} hidden />
			<input name="method" value="changeVisibility" hidden />

			<select
				className="border-2 p-1 text-xs rounded"
				name="is_publish"
				style={{
					borderColor: options.find(
						(v) => `${v.shareStatus ? "true" : "false"}` === value,
					)?.color,
				}}
				defaultValue={value}
				onChange={(e) => {
					setValue(e.target.value);
					formRef.current?.submit();
				}}
			>
				{options.map((option) => (
					<option value={`${option.shareStatus}`}>{option.title}</option>
				))}
			</select>
		</Form>
	);
};
function RewardTable({ data }: RewardTableProps): JSX.Element {
	const [isOpen, setisOpen] = useState(false);

	const [formValues, setFormValues] = useState({
		id: "",
		name: "",
		title1: "",
		title2: "",
		picture: "",
		original_picture: "",
		description: "",

		piece: 0,
		point: 0,
		redeem_per_customer: 0,
		start_date: new Date(),
		end_date: new Date(),
	});
	const updateFormValues = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setFormValues({
			...formValues,
			[e.target.name]: e.target.value,
		});
	};
	const columns = useMemo(
		() => [
			columnHelper.accessor(
				(row) => ({ name: row.name, picture: row.picture }),
				{
					id: "product_info",
					header: () => "ชื่อสินค้า",
					cell: (info) => (
						<div className="flex gap-1 items-center">
							{info.getValue().picture ? (
								<img
									className="w-[27px] h-[27px]"
									src={info.getValue().picture}
									alt="Random Image"
								/>
							) : (
								<div className="w-[27px] h-[27px] bg-black"></div>
							)}
							<span>{info.getValue().name}</span>
						</div>
					),
				},
			),
			columnHelper.accessor("description", {
				header: () => "รายละเอียดสินค้า",
				cell: (info) => <p className="text-[#0047FF]">{info.getValue()}</p>,
			}),
			columnHelper.accessor("piece", {
				header: () => "จำนวนชิ้น",
				cell: (info) => info.getValue(),
			}),
			columnHelper.accessor("point", {
				header: () => "จำนวน Point ที่ใช้แลก",
				cell: (info) => info.getValue(),
			}),
			columnHelper.accessor("remaining", {
				header: () => "คงเหลือ",
				cell: (info) => info.getValue(),
			}),

			columnHelper.accessor("is_publish", {
				header: () => "สถานะการเผยแพร่",
				cell: (info) => (
					<ChangeVisibility
						id={info.row.original.merchandise_id}
						defaultValue={info.row.original.is_publish ? "true" : "false"}
					/>
				),
			}),
			columnHelper.accessor("rewardId", {
				header: () => "จัดการ",
				cell: ({ row: { original } }) => (
					<div className="flex space-x-1">
						<button
							type="button"
							onClick={() => {
								setFormValues({
									id: original.merchandise_id,
									name: original.name,
									picture: original.picture,
									title1: original.title1,
									title2: original.title2,
									description: original.description,
									piece: +original.piece,
									point: +original.point,
									original_picture: original.picture,
									redeem_per_customer: +original.redeem_per_customer,
									start_date: new Date(),
									end_date: new Date(),
								});
								setFormMethod("edit");
								setisOpen(true);
							}}
						>
							<img
								src="/images/pencil-alt.svg"
								alt="More options"
								draggable="false"
							/>
						</button>
						<Form method="post" onSubmit={handleFormSubmit}>
							<input name="method" value="delete" hidden />
							<input name="id" value={original.merchandise_id} hidden />
							<button type="submit" className="cursor-pointer">
								<img
									src="/images/trash.svg"
									alt="More options"
									draggable="false"
								/>
							</button>
						</Form>
					</div>
				),
			}),
		],
		[data],
	);

	const [formMethod, setFormMethod] = useState("create");
	const table = useReactTable({
		data: data?.data || [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const submit = useSubmit();

	const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		try {
			submit(e.currentTarget, { replace: true });
			setisOpen(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="w-full h-full flex flex-col">
			{/* header */}
			<div className="flex justify-between items-end mb-2">
				<p>ทั้งหมด {data.totalRow}</p>
				<div className="flex flex-row gap-x-3">
					<button
						type="button"
						className="bg-[#28B7E1] h-[40px] w-[170px] border-none rounded-md text-white"
						onClick={() => {
							setFormValues({
								id: "",
								name: "",
								picture: "",
								title1: "",
								title2: "",
								description: "",
								original_picture: "",
								price: 0,
								point: 0,
								redeem_per_customer: 0,
								start_date: new Date(),
								end_date: new Date(),
							});
							setFormMethod("create");
							setisOpen(true);
						}}
					>
						Create
					</button>
				</div>
			</div>

			{/* body */}

			<div
				className={classNames(
					data.totalRow > 0 ? "overflow-y-auto" : "",
					"md:h-[12.25rem] lg:max-h-[31rem] flex-grow border-gray-400 bg-white",
				)}
			>
				<table className="w-full">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className={classNames(
											`md:max-w-[${header.getSize()}px]`,
											"flex-grow flex-shrink-0 h-[2.75rem] px-2.5 py-1 bg-gray-200 border-t border-b border-gray-400 justify-start items-center gap-2.5 text-slate-500 text-base text-left font-light font-roboto",
										)}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
											  )}
									</th>
								))}
							</tr>
						))}
					</thead>

					<tbody>
						{table.getRowModel().rows.map((row) => (
							<tr key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<td
										key={cell.id}
										className={classNames(
											"flex-grow flex-shrink-0 h-[2.8rem] px-2 py-1 bg-white border-b border-gray-400 justify-start gap-2.5 text-stone-800 text-sm font-normal font-roboto",
										)}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
				{/* Empty State Here */}
			</div>

			{/* footer */}

			<div className="flex justify-between items-center gap-2 mt-2 mb-16">
				<span className="flex items-center gap-1">
					<div>Page</div>
					<strong>
						{table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount()}
					</strong>
				</span>

				<PaginationNavigator
					currentPage={table.getState().pagination.pageIndex + 1}
					totalPage={table.getPageCount()}
					setPageIndex={table.setPageIndex}
				/>
			</div>

			{isOpen && (
				<div className="fixed inset-0 flex items-center justify-center z-50">
					{/* Modal overlay */}
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
					<div
						className="fixed inset-0 bg-gray-900 opacity-30"
						onClick={() => setisOpen(false)}
					/>
					<div className="bg-white rounded-lg p-8 z-50 max-w-lg w-full">
						{/* Modal content */}
						<h2 className="text-2xl font-bold mb-4">
							{formMethod === "create" ? "Create" : "Edit"}
						</h2>
						<Form
							method="post"
							onSubmit={handleFormSubmit}
							encType="multipart/form-data"
						>
							<input name="id" value={formValues.id} hidden />
							<input name="method" value={formMethod} hidden />
							<input
								name="original_image"
								value={formValues.original_picture}
								hidden
							/>

							<input
								type="file"
								name="picture"
								accept="image/*"
								id="uploadimg"
								hidden
								onChange={(e) => {
									if (!e.target.files?.[0]) return;
									setFormValues((v) => ({
										...v,
										picture: URL.createObjectURL(e.target.files?.[0]),
									}));
								}}
							/>
							<div className="flex flex-col mb-4 gap-2 items-center">
								<label
									htmlFor="uploadimg"
									className="cursor-pointer w-32 aspect-square"
								>
									{formValues.picture ? (
										<img
											src={formValues.picture}
											className="w-32 h-32 aspect-square rounded object-cover"
											alt="product"
										/>
									) : (
										<div className="w-32 h-32 aspect-square bg-gray-100 rounded items-center justify-center flex">
											Upload
										</div>
									)}
								</label>
								<small>
									Image should be at least 300 x 300 px in PNG or JPG.
								</small>
							</div>
							<div>
								<div className="mb-4 w-full">
									<label>Product Name</label>
									<input
										type="text"
										className=" block w-full px-4 py-2 rounded border-2"
										name="name"
										onChange={updateFormValues}
										value={formValues.name}
									/>
								</div>
							</div>
							<div className="mb-4">
								<label>Title 1</label>
								<input
									type="text"
									className=" block w-full px-4 py-2 rounded border-2"
									name="title1"
									onChange={updateFormValues}
									value={formValues.title1}
								/>
							</div>

							<div className="mb-4">
								<label>Title 2</label>
								<input
									type="text"
									className=" block w-full px-4 py-2 rounded border-2"
									name="title2"
									onChange={updateFormValues}
									value={formValues.title2}
								/>
							</div>

							<div className="mb-4">
								<label>Details</label>
								<textarea
									className=" block w-full px-4 py-2 rounded border-2"
									name="description"
									onChange={updateFormValues}
									value={formValues.description}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="mb-4">
									<label>Start Time</label>
									<input
										type="date"
										className=" block w-full px-4 py-2 rounded border-2"
										name="start_date"
										onChange={(e) =>
											setFormValues({
												...formValues,
												start_date: e.target.valueAsDate || new Date(),
											})
										}
										value={formValues.start_date.toISOString().split("T")[0]}
									/>
								</div>
								<div className="mb-4">
									<label>End Time</label>
									<input
										type="date"
										className=" block w-full px-4 py-2 rounded border-2"
										name="end_date"
										onChange={(e) =>
											setFormValues({
												...formValues,
												end_date: e.target.valueAsDate || new Date(),
											})
										}
										value={formValues.end_date.toISOString().split("T")[0]}
									/>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="mb-4">
									<label>Amount (Piece)</label>
									<input
										type="number"
										className=" block w-full px-4 py-2 rounded border-2"
										name="piece"
										onChange={updateFormValues}
										value={formValues.piece}
									/>
								</div>
								<div className="mb-4">
									<label>Trading Point</label>
									<input
										type="number"
										className=" block w-full px-4 py-2 rounded border-2"
										name="point"
										onChange={updateFormValues}
										value={formValues.point}
									/>
								</div>
							</div>
							<div className="mb-4">
								<label>Limit Per user</label>
								<input
									type="nubmer"
									className=" block w-full px-4 py-2 rounded border-2"
									name="redeem_per_customer"
									onChange={updateFormValues}
									value={formValues.redeem_per_customer}
								/>
							</div>
							<div className="flex gap-4 items-center justify-between">
								<button
									type="button"
									className="bg-gray-100  px-4 py-2 border-none rounded-md"
									onClick={() => setisOpen(false)}
								>
									Close{" "}
								</button>
								<button
									type="submit"
									className="bg-[#28B7E1] h-[40px] w-[170px] border-none rounded-md text-white"
								>
									{formMethod === "create" ? "Create" : "Edit"}
								</button>
							</div>
						</Form>
					</div>
				</div>
			)}
		</div>
	);
}

export default RewardTable;
