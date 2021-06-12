import Input from "@components/ui/input";
import { useForm } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import { useRouter } from "next/router";
import { Tax } from "@ts-types/generated";
import { useCreateTaxClassMutation } from "@data/tax/use-tax-create.mutation";
import { useUpdateTaxClassMutation } from "@data/tax/use-tax-update.mutation";
import { yupResolver } from "@hookform/resolvers/yup";
import { taxValidationSchema } from "./tax-validation-schema";

const defaultValues = {
  name: "",
  rate: 0,
  country: "",
  state: "",
  zip: "",
  city: "",
};

type IProps = {
  initialValues?: Tax | null;
};
export default function CreateOrUpdateTaxForm({ initialValues }: IProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Tax>({
    shouldUnregister: true,
    resolver: yupResolver(taxValidationSchema),
    defaultValues: initialValues ?? defaultValues,
  });
  const {
    mutate: createTaxClass,
    isLoading: creating,
  } = useCreateTaxClassMutation();
  const {
    mutate: updateTaxClass,
    isLoading: updating,
  } = useUpdateTaxClassMutation();
  const onSubmit = async (values: Tax) => {
    if (initialValues) {
      updateTaxClass({
        variables: {
          id: initialValues.id!,
          input: {
            ...values,
          },
        },
      });
    } else {
      createTaxClass({
        variables: {
          input: {
            ...values,
          },
        },
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title="Information"
          details={`${initialValues ? "Update" : "Add"} your tax
          information from here`}
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label="Name"
            {...register("name", { required: "Name is required" })}
            error={errors.name?.message}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="Rate"
            {...register("rate")}
            type="number"
            error={errors.rate?.message}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="Country"
            {...register("country")}
            error={errors.country?.message}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="City"
            {...register("city")}
            error={errors.city?.message}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="State"
            {...register("state")}
            error={errors.state?.message}
            variant="outline"
            className="mb-5"
          />
          <Input
            label="ZIP"
            {...register("zip")}
            error={errors.zip?.message}
            variant="outline"
            className="mb-5"
          />
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

        <Button loading={creating || updating}>
          {initialValues ? "Update" : "Add"} Tax
        </Button>
      </div>
    </form>
  );
}
