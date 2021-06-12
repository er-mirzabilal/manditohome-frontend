import Input from "@components/ui/input";
import { useForm, useWatch } from "react-hook-form";
import Button from "@components/ui/button";
import Card from "@components/common/card";
import Description from "@components/ui/description";
import Radio from "@components/ui/radio/radio";
import Label from "@components/ui/label";
import { ShippingInput, ShippingType, Shipping } from "@ts-types/generated";
import { useCreateShippingClassMutation } from "@data/shipping/use-shipping-create.mutation";
import { useUpdateShippingClassMutation } from "@data/shipping/use-shipping-update.mutation";
import { yupResolver } from "@hookform/resolvers/yup";
import { shippingValidationSchema } from "./shipping-validation-schema";
import { useRouter } from "next/router";

const defaultValues = {
  name: "",
  amount: 0,
  is_global: true,
  type: ShippingType.Fixed,
};

type IProps = {
  initialValues?: Shipping | undefined | null;
};
export default function CreateOrUpdateShippingForm({ initialValues }: IProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Shipping>({
    shouldUnregister: true,
    resolver: yupResolver(shippingValidationSchema),
    defaultValues: initialValues ?? defaultValues,
  });
  const {
    mutate: createShippingClass,
    isLoading: creating,
  } = useCreateShippingClassMutation();
  const {
    mutate: updateShippingClass,
    isLoading: updating,
  } = useUpdateShippingClassMutation();
  const onSubmit = async (values: ShippingInput) => {
    if (initialValues) {
      updateShippingClass({
        variables: {
          id: initialValues.id!,
          input: {
            ...values,
          },
        },
      });
    } else {
      createShippingClass({
        variables: {
          input: {
            ...values,
          },
        },
      });
    }
  };

  const type = useWatch({ name: "type", control });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title="Description"
          details={`${
            initialValues ? "Update" : "Add"
          } your type description and necessary
          information from here`}
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />
        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label="Name"
            {...register("name", { required: "Name is required" })}
            error={errors.name?.message}
            variant="outline"
            className="mb-5"
          />

          <div className="mb-5">
            <Label>Type</Label>
            <Radio
              label="Free"
              {...register("type")}
              id="FREE"
              value={ShippingType.Free}
              className="mb-2"
            />
            <Radio
              label="Fixed"
              {...register("type")}
              id="FIXED"
              value={ShippingType.Fixed}
              className="mb-2"
            />
            <Radio
              label="Percentage"
              {...register("type")}
              id="PERCENTAGE"
              value={ShippingType.Percentage}
            />
          </div>
          {type !== ShippingType.Free && (
            <Input
              label="Amount"
              {...register("amount")}
              type="number"
              error={errors.amount?.message}
              variant="outline"
              className="mb-5"
            />
          )}
        </Card>
      </div>

      <div className="mb-4 text-right">
        {initialValues && (
          <Button
            variant="outline"
            onClick={router.back}
            className="mr-4"
            type="button"
          >
            Back
          </Button>
        )}

        <Button loading={creating || updating} disabled={creating || updating}>
          {initialValues ? "Update" : "Add"} Shipping
        </Button>
      </div>
    </form>
  );
}
