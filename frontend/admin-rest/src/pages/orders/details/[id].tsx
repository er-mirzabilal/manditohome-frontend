import Card from "@components/common/card";
import Layout from "@components/common/layout";
import Image from "next/image";
import { Table } from "@components/ui/table";
import ProgressBox from "@components/ui/progress-box/progress-box";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import Button from "@components/ui/button";
import ErrorMessage from "@components/ui/error-message";
import { siteSettings } from "@settings/site.settings";
import usePrice from "@utils/use-price";
import { formatAddress } from "@utils/format-address";
import Loader from "@components/ui/loader/loader";
import ValidationError from "@components/ui/form-validation-error";
import { Attachment } from "@ts-types/generated";
import { useOrderQuery } from "@data/order/use-order.query";
import { useUpdateOrderMutation } from "@data/order/use-order-update.mutation";
import { useOrderStatusesQuery } from "@data/order-status/use-order-statuses.query";
import SelectInput from "@components/ui/select-input";

type FormValues = {
  order_status: any;
};
const columns = [
  {
    dataIndex: "image",
    key: "image",
    width: 70,
    render: (image: Attachment) => (
      <Image
        src={image?.thumbnail ?? siteSettings.product.placeholder}
        alt="alt text"
        layout="fixed"
        width={50}
        height={50}
      />
    ),
  },
  {
    title: "Products",
    dataIndex: "name",
    key: "name",
    align: "left",
    render: (name: string, item: any) => (
      <div>
        <span>{name}</span>
        <span className="mx-2">x</span>
        <span className="font-semibold text-heading">
          {item.pivot.order_quantity}
        </span>
      </div>
    ),
  },
  {
    title: "Total",
    dataIndex: "price",
    key: "price",
    align: "right",
    render: (_: any, item: any) => {
      const { price } = usePrice({
        amount: parseFloat(item.pivot.subtotal),
      });
      return <span>{price}</span>;
    },
  },
];
export default function OrderDetailsPage() {
  const { query } = useRouter();
  const { mutate: updateOrder, isLoading: updating } = useUpdateOrderMutation();
  const { data: orderStatusData } = useOrderStatusesQuery({});
  const { data, isLoading: loading, error } = useOrderQuery(query.id as string);

  const {
    handleSubmit,
    control,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { order_status: data?.order?.status?.id ?? "" },
  });

  const ChangeStatus = ({ order_status }: FormValues) => {
    updateOrder({
      variables: {
        id: data?.order?.id as string,
        input: {
          status: order_status?.id as string,
        },
      },
    });
  };
  const { price: subtotal } = usePrice(
    data && {
      amount: data?.order?.amount!,
    }
  );
  const { price: total } = usePrice(
    data && {
      amount: data?.order?.paid_total!,
    }
  );
  const { price: discount } = usePrice(
    data && {
      amount: data?.order?.discount!,
    }
  );
  const { price: delivery_fee } = usePrice(
    data && {
      amount: data?.order?.delivery_fee!,
    }
  );
  const { price: sales_tax } = usePrice(
    data && {
      amount: data?.order?.sales_tax!,
    }
  );
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  return (
    <Card>
      <div className="flex flex-col lg:flex-row items-center">
        <h3 className="text-2xl font-semibold text-heading text-center lg:text-left w-full lg:w-1/3 mb-8 lg:mb-0 whitespace-nowrap">
          Order ID - {data?.order?.tracking_number}
        </h3>

        <form
          onSubmit={handleSubmit(ChangeStatus)}
          className="flex items-start ml-auto w-full lg:w-2/4"
        >
          <div className="w-full mr-5 z-20">
            <SelectInput
              name="order_status"
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={orderStatusData?.order_statuses?.data}
              placeholder="Order status"
            />

            <ValidationError message={errors?.order_status?.message} />
          </div>
          <Button loading={updating}>
            <span className="hidden sm:block">Change Status</span>
            <span className="block sm:hidden">Change</span>
          </Button>
        </form>
      </div>

      <div className="my-5 lg:my-10 flex justify-center items-center">
        <ProgressBox
          data={orderStatusData?.order_statuses?.data}
          status={data?.order?.status?.serial!}
        />
      </div>

      <div className="mb-10">
        {data?.order ? (
          <Table
            //@ts-ignore
            columns={columns}
            data={data?.order?.products!}
            rowKey="id"
            scroll={{ x: 300 }}
          />
        ) : (
          <span>No Order Found</span>
        )}

        <div className="border-t-4 border-double border-gray-200 flex flex-col w-full sm:w-1/2 md:w-1/3 ml-auto px-4 py-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-body">
            <span>Sub total</span>
            <span>{subtotal}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-body">
            <span>Tax</span>
            <span>{sales_tax}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-body">
            <span>Delivery Fee</span>
            <span>{delivery_fee}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-body">
            <span>Discount</span>
            <span>{discount}</span>
          </div>
          <div className="flex items-center justify-between text-base text-heading font-semibold">
            <span>Total</span>
            <span>{total}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="w-full sm:w-1/2 sm:pr-8 mb-10 sm:mb-0">
          <h3 className="text-heading font-medium mb-3 pb-2 border-b border-gray-200">
            Billing address
          </h3>

          <div className="text-sm text-gray-500 flex flex-col items-start space-y-1">
            <span>{data?.order?.customer?.name}</span>
            {data?.order?.billing_address && (
              <span>{formatAddress(data.order.billing_address)}</span>
            )}
            {data?.order?.customer_contact && (
              <span>{data?.order?.customer_contact}</span>
            )}
          </div>
        </div>

        <div className="w-full sm:w-1/2 sm:pl-8">
          <h3 className="text-heading text-left font-medium sm:text-right mb-3 pb-2 border-b border-gray-200">
            Shipping address
          </h3>

          <div className="text-sm text-gray-500 text-left sm:text-right flex flex-col items-start sm:items-end space-y-1">
            <span>{data?.order?.customer?.name}</span>
            {data?.order?.shipping_address && (
              <span>{formatAddress(data.order.shipping_address)}</span>
            )}
            {data?.order?.customer_contact && (
              <span>{data?.order?.customer_contact}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
OrderDetailsPage.Layout = Layout;
