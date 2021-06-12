import Input from "@components/ui/input";
import TextArea from "@components/ui/text-area";
import { useForm, FormProvider } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import Label from "@components/ui/label";
import Radio from "@components/ui/radio/radio";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import FileInput from "@components/ui/file-input";
import { productValidationSchema } from "./product-validation-schema";
import groupBy from "lodash/groupBy";
import ProductVariableForm from "./product-variable-form";
import ProductSimpleForm from "./product-simple-form";
import ProductGroupInput from "./product-group-input";
import ProductCategoryInput from "./product-category-input";
import omit from "lodash/omit";
import orderBy from "lodash/orderBy";
import sum from "lodash/sum";
import ProductTypeInput from "./product-type-input";
import {
  Type,
  ProductType,
  Category,
  AttachmentInput,
  ProductStatus,
  Product,
  Attribute,
  VariationOption,
} from "@ts-types/generated";
import { useCreateProductMutation } from "@data/product/product-create.mutation";
import { useUpdateProductMutation } from "@data/product/product-update.mutation";

type Variation = {
  formName: number;
};

type FormValues = {
  sku: string;
  name: string;
  type: Type;
  product_type: ProductType;
  description: string;
  unit: string;
  price: number;
  min_price: number;
  max_price: number;
  sale_price: number;
  quantity: number;
  categories: Category[];
  in_stock: boolean;
  is_taxable: boolean;
  image: AttachmentInput;
  gallery: AttachmentInput[];
  status: ProductStatus;
  width: string;
  height: string;
  length: string;
  isVariation: boolean;
  variations: Variation[];
  variation_options: Product["variation_options"];
  [key: string]: any;
};
const defaultValues = {
  sku: "",
  name: "",
  type: "",
  productTypeValue: { name: "Simple Product", value: ProductType.Simple },
  description: "",
  unit: "",
  price: "",
  min_price: 0.0,
  max_price: 0.0,
  sale_price: "",
  quantity: "",
  categories: [],
  in_stock: true,
  is_taxable: false,
  image: [],
  gallery: [],
  status: ProductStatus.Publish,
  width: "",
  height: "",
  length: "",
  isVariation: false,
  variations: [],
  variation_options: [],
};

type IProps = {
  initialValues?: Product | null;
  attributes: Attribute[] | null;
};

const productType = [
  { name: "Simple Product", value: ProductType.Simple },
  { name: "Variable Product", value: ProductType.Variable },
];
function getFormattedVariations(variations: any) {
  const variationGroup = groupBy(variations, "attribute.slug");
  return Object.values(variationGroup)?.map((vg) => {
    return {
      attribute: vg?.[0]?.attribute,
      value: vg?.map((v) => ({ id: v.id, value: v.value })),
    };
  });
}

function processOptions(options: any) {
  try {
    return JSON.parse(options);
  } catch (error) {
    return options;
  }
}

function calculateMaxMinPrice(variationOptions: any) {
  if (!variationOptions || !variationOptions.length) {
    return {
      min_price: null,
      max_price: null,
    };
  }
  const sortedVariationsByPrice = orderBy(variationOptions, ["price"]);
  const sortedVariationsBySalePrice = orderBy(variationOptions, ["sale_price"]);
  return {
    min_price:
      sortedVariationsBySalePrice?.[0].sale_price <
      sortedVariationsByPrice?.[0]?.price
        ? Number(sortedVariationsBySalePrice?.[0].sale_price)
        : Number(sortedVariationsByPrice?.[0]?.price),
    max_price: Number(
      sortedVariationsByPrice?.[sortedVariationsByPrice?.length - 1]?.price
    ),
  };
}

function calculateQuantity(variationOptions: any) {
  return sum(
    variationOptions?.map(({ quantity }: { quantity: number }) => quantity)
  );
}
export default function CreateOrUpdateProductForm({
  initialValues,
  attributes,
}: IProps) {
  const router = useRouter();
  const methods = useForm<FormValues>({
    resolver: yupResolver(productValidationSchema),
    shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
          isVariation:
            initialValues.variations?.length &&
            initialValues.variation_options?.length
              ? true
              : false,
          productTypeValue: initialValues.product_type
            ? productType.find(
                (type) => initialValues.product_type === type.value
              )
            : productType[0],
          variations: getFormattedVariations(initialValues?.variations),
        }
      : defaultValues,
  });
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = methods;

  const {
    mutate: createProduct,
    isLoading: creating,
  } = useCreateProductMutation();
  const {
    mutate: updateProduct,
    isLoading: updating,
  } = useUpdateProductMutation();

  const onSubmit = async (values: FormValues) => {
    const { type } = values;
    const inputValues: any = {
      description: values.description,
      height: values.height,
      length: values.length,
      name: values.name,
      sku: values.sku,
      status: values.status,
      unit: values.unit,
      width: values.width,
      quantity:
        values?.productTypeValue?.value === ProductType.Simple
          ? values?.quantity
          : calculateQuantity(values?.variation_options),
      product_type: values.productTypeValue?.value,
      type_id: type?.id as string,
      price: Number(values.price),
      sale_price: values.sale_price ? Number(values.sale_price) : null,
      categories: values?.categories?.map(({ id }: any) => id),
      image: {
        thumbnail: values?.image?.thumbnail,
        original: values?.image?.original,
        id: values?.image?.id,
      },
      gallery: values.gallery?.map(({ thumbnail, original, id }: any) => ({
        thumbnail,
        original,
        id,
      })),
      ...(productTypeValue?.value === ProductType.Variable && {
        variations: values?.variations?.flatMap(({ value }: any) =>
          value?.map(({ id }: any) => ({ attribute_value_id: id }))
        ),
      }),
      ...(productTypeValue?.value === ProductType.Variable
        ? {
            variation_options: {
              upsert: values?.variation_options?.map(
                ({ options, ...rest }: any) => ({
                  ...omit(rest, "__typename"),
                  options: processOptions(options).map(
                    ({ name, value }: VariationOption) => ({
                      name,
                      value,
                    })
                  ),
                })
              ),
              delete: initialValues?.variation_options
                ?.map((initialVariationOption) => {
                  const find = values?.variation_options?.find(
                    (variationOption) =>
                      variationOption?.id === initialVariationOption?.id
                  );
                  if (!find) {
                    return initialVariationOption?.id;
                  }
                })
                .filter((item) => item !== undefined),
            },
          }
        : {
            variations: {
              sync: [],
            },
            variation_options: {
              upsert: [],
              delete: initialValues?.variation_options?.map(
                (variation) => variation?.id
              ),
            },
          }),
      ...calculateMaxMinPrice(values?.variation_options),
    };

    if (initialValues) {
      updateProduct(
        {
          variables: {
            id: initialValues.id!,
            input: inputValues,
          },
        },
        {
          onError: (error: any) => {
            Object.keys(error?.response?.data).forEach((field: any) => {
              setError(field, {
                type: "manual",
                message: error?.response?.data[field][0],
              });
            });
          },
        }
      );
    } else {
      createProduct(
        {
          ...inputValues,
        },
        {
          onError: (error: any) => {
            Object.keys(error?.response?.data).forEach((field: any) => {
              setError(field, {
                type: "manual",
                message: error?.response?.data[field][0],
              });
            });
          },
        }
      );
    }
  };
  const productTypeValue = watch("productTypeValue");
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 my-5 sm:my-8">
          <Description
            title="Featured Image"
            details="Upload your product featured image here"
            className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="image" control={control} multiple={false} />
          </Card>
        </div>

        <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 my-5 sm:my-8">
          <Description
            title="Gallery"
            details="Upload your product image gallery here"
            className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="gallery" control={control} />
          </Card>
        </div>

        <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 my-5 sm:my-8">
          <Description
            title="Group & Categories"
            details="Select product group and categories form here"
            className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <ProductGroupInput
              control={control}
              error={(errors?.type as any)?.message}
            />
            <ProductCategoryInput control={control} setValue={setValue} />
          </Card>
        </div>

        <div className="flex flex-wrap my-5 sm:my-8">
          <Description
            title="Description"
            details={`${
              initialValues ? "Edit" : "Add"
            } your product description and necessary information from here`}
            className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label="Name*"
              {...register("name")}
              error={errors.name?.message}
              variant="outline"
              className="mb-5"
            />

            <Input
              label="Unit*"
              {...register("unit")}
              error={errors.unit?.message}
              variant="outline"
              className="mb-5"
            />

            <TextArea
              label="Description"
              {...register("description")}
              error={errors.description?.message}
              variant="outline"
              className="mb-5"
            />

            <div>
              <Label>Status</Label>

              <Radio
                {...register("status")}
                id="published"
                label="Publish"
                value={ProductStatus.Publish}
                className="mb-2"
              />
              <Radio
                {...register("status")}
                id="draft"
                label={ProductStatus.Draft}
                value="DRAFT"
              />
            </div>
          </Card>
        </div>

        <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 my-5 sm:my-8">
          <Description
            title="Product Type"
            details="Select product type form here"
            className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <ProductTypeInput />
        </div>

        {/* Simple Type */}
        {productTypeValue?.value === ProductType.Simple && (
          <ProductSimpleForm initialValues={initialValues} />
        )}

        {/* Variation Type */}
        {productTypeValue?.value === ProductType.Variable && (
          <ProductVariableForm
            attributes={attributes}
            initialValues={initialValues}
          />
        )}

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

          <Button loading={updating || creating}>
            {initialValues ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
