import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { ROUTES } from "@utils/routes";
import { Shipping } from "@ts-types/generated";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 62,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    align: "left",
    width: 150,
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    align: "center",
  },
  {
    title: "Global",
    dataIndex: "is_global",
    key: "is_global",
    align: "center",
    render: (value: boolean) => (
      <span className="capitalize">{value.toString()}</span>
    ),
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    align: "center",
  },
  {
    title: "Actions",
    dataIndex: "id",
    key: "actions",
    align: "center",
    render: (id: string) => (
      <ActionButtons
        id={id}
        navigationPath={`${ROUTES.SHIPPINGS}/edit/${id}`}
        modalActionType="DELETE_SHIPPING"
      />
    ),
    width: 200,
  },
];

export type IProps = {
  shippings: Shipping[] | undefined;
};
const ShippingList = ({ shippings }: IProps) => {
  return (
    <div className="rounded overflow-hidden shadow mb-8">
      <Table
        //@ts-ignore
        columns={columns}
        data={shippings}
        rowKey="id"
        scroll={{ x: 900 }}
      />
    </div>
  );
};

export default ShippingList;
