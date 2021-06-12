import Pagination from "@components/ui/pagination";
import dayjs from "dayjs";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import usePrice from "@utils/use-price";
import { formatAddress } from "@utils/format-address";
import { ROUTES } from "@utils/routes";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  Order,
  OrderPaginator,
  OrderStatus,
  UserAddress,
} from "@ts-types/generated";
import InvoicePdf from "./invoice-pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";

const columns = [
  {
    title: "Tracking Number",
    dataIndex: "tracking_number",
    key: "tracking_number",
    align: "center",
    width: 150,
  },
  {
    title: "Delivery fee",
    dataIndex: "delivery_fee",
    key: "delivery_fee",
    align: "center",
    render: (value: any) => {
      const delivery_fee = value ? value : 0;
      const { price } = usePrice({
        amount: delivery_fee,
      });
      return <span>{price}</span>;
    },
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    align: "center",
    width: 120,
    render: (value: any) => {
      const { price } = usePrice({
        amount: value,
      });
      return <span className="whitespace-nowrap">{price}</span>;
    },
  },
  {
    title: "Order Date",
    dataIndex: "created_at",
    key: "created_at",
    align: "center",
    render: (date: string) => {
      dayjs.extend(relativeTime);
      dayjs.extend(utc);
      dayjs.extend(timezone);
      return (
        <span className="whitespace-nowrap">
          {dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()}
        </span>
      );
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    align: "left",
    render: (status: OrderStatus) => (
      <span
        className="whitespace-nowrap font-semibold"
        style={{ color: status?.color! }}
      >
        {status?.name}
      </span>
    ),
  },
  {
    title: "Shipping Address",
    dataIndex: "shipping_address",
    key: "shipping_address",
    align: "left",
    render: (shipping_address: UserAddress) => (
      <div>{formatAddress(shipping_address)}</div>
    ),
  },
  {
    title: "Download",
    dataIndex: "id",
    key: "download",
    align: "center",
    render: (id: string, order: Order) => (
      <div>
        <PDFDownloadLink
          document={<InvoicePdf order={order} />}
          fileName="invoice.pdf"
        >
          {({ loading }) => (loading ? "loading..." : "Download")}
        </PDFDownloadLink>
      </div>
    ),
  },
  {
    title: "Actions",
    dataIndex: "id",
    key: "actions",
    align: "center",
    width: 100,
    render: (id: string) => (
      <ActionButtons
        id={id}
        deleteButton={false}
        editButtonText="Details"
        navigationPath={`${ROUTES.ORDERS}/details/${id}`}
        modalActionType="DELETE_ORDER"
      />
    ),
  },
];

type IProps = {
  orders: OrderPaginator | null | undefined;
  onPagination: (current: number) => void;
};

const OrderList = ({ orders, onPagination }: IProps) => {
  const { data, paginatorInfo } = orders!;
  return (
    <>
      <div className="rounded overflow-hidden shadow mb-6">
        <Table
          //@ts-ignore
          columns={columns}
          data={data}
          rowKey="id"
          scroll={{ x: 1000 }}
        />
      </div>

      {!!paginatorInfo.total && (
        <div className="flex justify-end items-center">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default OrderList;
