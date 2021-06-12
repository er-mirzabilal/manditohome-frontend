import Input from "@components/ui/input";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import { useFormContext } from "react-hook-form";

type IProps = {
  initialValues: any;
};

export default function ProductSimpleForm({ initialValues }: IProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="flex flex-wrap my-5 sm:my-8">
      <Description
        title="Simple Product Information"
        details={`${
          initialValues ? "Edit" : "Add"
        } your simple product description and necessary information from here`}
        className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
      />

      <Card className="w-full sm:w-8/12 md:w-2/3">
        <Input
          label="Price*"
          {...register("price")}
          type="number"
          error={errors.price?.message}
          variant="outline"
          className="mb-5"
        />
        <Input
          label="Sale Price"
          type="number"
          {...register("sale_price")}
          error={errors.sale_price?.message}
          variant="outline"
          className="mb-5"
        />

        <Input
          label="Quantity*"
          type="number"
          {...register("quantity")}
          error={errors.quantity?.message}
          variant="outline"
          className="mb-5"
        />

        <Input
          label="SKU*"
          {...register("sku")}
          error={errors.sku?.message}
          variant="outline"
          className="mb-5"
        />

        <Input
          label="Width"
          {...register("width")}
          error={errors.width?.message}
          variant="outline"
          className="mb-5"
        />
        <Input
          label="Height"
          {...register("height")}
          error={errors.height?.message}
          variant="outline"
          className="mb-5"
        />
        <Input
          label="Length"
          {...register("length")}
          error={errors.length?.message}
          variant="outline"
          className="mb-5"
        />
      </Card>
    </div>
  );
}
