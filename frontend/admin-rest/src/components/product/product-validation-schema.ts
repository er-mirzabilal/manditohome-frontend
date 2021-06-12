import { ProductType } from "@ts-types/generated";
import * as yup from "yup";

export const productValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  productTypeValue: yup.object().required("Product type is required"),
  sku: yup.mixed().when("productTypeValue", {
    is: (productType: {
      name: string;
      value: string;
      [key: string]: unknown;
    }) => productType?.value === ProductType.Simple,
    then: yup.string().nullable().required("SKU is required"),
  }),
  price: yup.mixed().when("productTypeValue", {
    is: (productType: {
      name: string;
      value: string;
      [key: string]: unknown;
    }) => productType?.value === ProductType.Simple,
    then: yup
      .number()
      .typeError("Price must be a number")
      .positive("Price must be positive")
      .required("Price is required"),
  }),
  sale_price: yup
    .number()
    .transform((value) => (isNaN(value) ? undefined : value))
    .lessThan(yup.ref("price"), "Sale Price should be less than ${less}")
    .positive("Sale price must be positive"),
  quantity: yup.mixed().when("productTypeValue", {
    is: (productType: {
      name: string;
      value: string;
      [key: string]: unknown;
    }) => productType?.value === ProductType.Simple,
    then: yup
      .number()
      .typeError("Quantity must be a number")
      .positive("Quantity must be positive")
      .integer("Quantity must be integer")
      .required("Quantity is required"),
  }),
  unit: yup.string().required("Unit is required"),
  type: yup.object().nullable().required("Type is required"),
  status: yup.string().required("Status is required"),
  variation_options: yup.array().of(
    yup.object().shape({
      price: yup
        .number()
        .typeError("Price must be a number")
        .positive("Price must be positive")
        .required("Price is required"),
      sale_price: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .lessThan(yup.ref("price"), "Sale Price should be less than ${less}")
        .positive("Sale price must be positive"),
      quantity: yup
        .number()
        .typeError("Quantity must be a number")
        .positive("Quantity must be positive")
        .integer("Quantity must be integer")
        .required("Quantity is required"),
      sku: yup.string().required("SKU is required"),
    })
  ),
});
