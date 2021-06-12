import Pagination from "@components/ui/pagination";
import Image from "next/image";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { siteSettings } from "@settings/site.settings";
import usePrice from "@utils/use-price";
import { ROUTES } from "@utils/routes";
import Badge from "@components/ui/badge/badge";
import { Product, ProductPaginator, ProductType } from "@ts-types/generated";

const columns = [
	{
		title: "ID",
		dataIndex: "id",
		key: "id",
		align: "center",
		width: 64,
	},
	{
		title: "Image",
		dataIndex: "image",
		key: "image",
		align: "left",
		width: 74,
		render: (image: any, { name }: { name: string }) => (
			<Image
				src={image?.thumbnail ?? siteSettings.product.placeholder}
				alt={name}
				layout="fixed"
				width={42}
				height={42}
				className="rounded overflow-hidden"
			/>
		),
	},
	{
		title: "Name",
		dataIndex: "name",
		key: "name",
		align: "left",
		width: 200,
		ellipsis: true,
	},
	{
		title: "Type",
		dataIndex: "type",
		key: "type",
		width: 120,
		align: "center",
		ellipsis: true,
		render: (type: any) => (
			<span className="whitespace-nowrap truncate">{type?.name}</span>
		),
	},
	{
		title: "Product Type",
		dataIndex: "product_type",
		key: "product_type",
		width: 120,
		align: "center",
		render: (product_type: string) => (
			<span className="whitespace-nowrap truncate">{product_type}</span>
		),
	},
	{
		title: "Price/Unit",
		dataIndex: "price",
		key: "price",
		align: "right",
		width: 180,
		render: (value: number, record: Product) => {
			if (record?.product_type === ProductType.Variable) {
				const { price: max_price } = usePrice({
					amount: record?.max_price as number,
				});
				const { price: min_price } = usePrice({
					amount: record?.min_price as number,
				});
				return (
					<span
						className="whitespace-nowrap"
						title={`${min_price} - ${max_price}`}
					>{`${min_price} - ${max_price}`}</span>
				);
			} else {
				const { price } = usePrice({
					amount: value,
				});
				return (
					<span className="whitespace-nowrap" title={price}>
						{price}
					</span>
				);
			}
		},
	},
	{
		title: "Quantity",
		dataIndex: "quantity",
		key: "quantity",
		align: "center",
		width: 100,
	},
	{
		title: "Description",
		dataIndex: "description",
		key: "description",
		align: "left",
		width: 220,
		ellipsis: true,
	},
	{
		title: "Status",
		dataIndex: "status",
		key: "status",
		align: "center",
		width: 100,
		render: (status: string) => (
			<Badge
				text={status}
				color={status === "DRAFT" ? "bg-yellow-400" : "bg-primary"}
			/>
		),
	},
	{
		title: "Actions",
		dataIndex: "id",
		key: "actions",
		align: "center",
		width: 80,
		render: (id: string, record: Product) => (
			<ActionButtons
				id={id}
				navigationPath={`${ROUTES.PRODUCTS}/edit/${record.slug}`}
				modalActionType="DELETE_PRODUCT"
			/>
		),
	},
];

export type IProps = {
	products?: ProductPaginator;
	onPagination: (current: number) => void;
};

const ProductList = ({ products, onPagination }: IProps) => {
	const { data, paginatorInfo } = products!;

	return (
		<>
			<div className="rounded overflow-hidden shadow mb-6">
				{/* @ts-ignore */}
				<Table columns={columns} data={data} rowKey="id" scroll={{ x: 900 }} />
			</div>

			{!!paginatorInfo.total && (
				<div className="flex justify-end items-center">
					<Pagination
						total={paginatorInfo.total}
						current={paginatorInfo.currentPage}
						pageSize={paginatorInfo.perPage}
						onChange={onPagination}
						showLessItems
					/>
				</div>
			)}
		</>
	);
};

export default ProductList;
