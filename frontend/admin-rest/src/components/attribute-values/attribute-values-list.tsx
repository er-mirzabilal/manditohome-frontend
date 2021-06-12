import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { ROUTES } from "@utils/routes";
import { Attribute, AttributeValue } from "@ts-types/generated";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    align: "center",
    width: 60,
  },
  {
    title: "Name",
    dataIndex: "value",
    key: "value",
    align: "left",
    render: (value: string) => (
      <span className="whitespace-nowrap">{value}</span>
    ),
  },
  {
    title: "Attribute",
    dataIndex: "attribute",
    key: "attribute",
    align: "left",
    render: (attribute: Attribute) => (
      <span className="whitespace-nowrap">{attribute?.name}</span>
    ),
  },
  {
    title: "Actions",
    dataIndex: "id",
    key: "actions",
    align: "right",
    render: (id: string) => (
      <ActionButtons
        id={id}
        navigationPath={`${ROUTES.ATTRIBUTE_VALUES}/edit/${id}`}
        modalActionType="DELETE_ATTRIBUTE_VALUE"
      />
    ),
  },
];

export type IProps = {
  attributeValues: AttributeValue[] | undefined;
};
const AttributeValuesList = ({ attributeValues }: IProps) => {
  return (
    <div className="rounded overflow-hidden shadow mb-8">
      {/* @ts-ignore */}
      <Table
        // @ts-ignore
        columns={columns}
        data={attributeValues}
        rowKey="id"
        scroll={{ x: 380 }}
      />
    </div>
  );
};

export default AttributeValuesList;
