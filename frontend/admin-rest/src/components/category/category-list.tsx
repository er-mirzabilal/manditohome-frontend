import Pagination from "@components/ui/pagination";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { getIcon } from "@utils/get-icon";
import * as categoriesIcon from "@components/icons/category";
import { ROUTES } from "@utils/routes";
import { CategoryPaginator } from "@ts-types/generated";
import Image from "next/image";

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
    dataIndex: "name",
    key: "name",
    align: "left",
    width: 150,
  },
  {
    title: "Details",
    dataIndex: "details",
    key: "details",
    align: "left",
    width: 200,
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    align: "center",

    render: (image: any, { name }: { name: string }) => {
      if (!image?.thumbnail) return null;

      return (
        <Image
          src={image?.thumbnail ?? "/"}
          alt={name}
          layout="fixed"
          width={24}
          height={24}
          className="rounded overflow-hidden"
        />
      );
    },
  },
  {
    title: "Icon",
    dataIndex: "icon",
    key: "icon",
    align: "center",
    render: (icon: string) => {
      if (!icon) return null;
      return (
        <span className="flex items-center justify-center">
          {getIcon({
            iconList: categoriesIcon,
            iconName: icon,
            className: "w-5 h-5 max-h-full max-w-full",
          })}
        </span>
      );
    },
  },
  {
    title: "Slug",
    dataIndex: "slug",
    key: "slug",
    align: "center",
    ellipsis: true,
    width: 150,
    render: (slug: any) => (
      <div className="whitespace-nowrap truncate overflow-hidden" title={slug}>
        {slug}
      </div>
    ),
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    align: "left",
    width: 120,
    render: (type: any) => (
      <div
        className="whitespace-nowrap truncate overflow-hidden"
        title={type?.name}
      >
        {type?.name}
      </div>
    ),
  },
  {
    title: "Actions",
    dataIndex: "id",
    key: "actions",
    align: "center",
    width: 90,
    render: (id: string) => (
      <ActionButtons
        id={id}
        navigationPath={`${ROUTES.CATEGORIES}/edit/${id}`}
        modalActionType="DELETE_CATEGORY"
      />
    ),
  },
];
export type IProps = {
  categories: CategoryPaginator | undefined | null;
  onPagination: (key: number) => void;
};
const CategoryList = ({ categories, onPagination }: IProps) => {
  const { data, paginatorInfo } = categories!;
  const rowExpandable = (record: any) => record.children?.length;

  return (
    <>
      <div className="rounded overflow-hidden shadow mb-6">
        <Table
          //@ts-ignore
          columns={columns}
          data={data}
          rowKey="id"
          scroll={{ x: 1000 }}
          expandable={{
            expandedRowRender: () => "",
            rowExpandable: rowExpandable,
          }}
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

export default CategoryList;
