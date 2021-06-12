export const errorMessage = {
  product: {
    name: { required: "Name is required" },
    sku: { required: "SKU is required" },
    price: { required: "Price is required" },
    sale_price: {
      message: "The sale price must be less than or equal than price!",
    },
    quantity: {
      required: "Quantity is required",
      validate: {
        isInteger: (value: string) => {
          return Number.isInteger(+value) || "Quantity must be integer";
        },
      },
    },
    unit: { required: "Unit is required" },
    type: {
      required: "Type is required",
    },
    status: { required: "Status is required" },
  },
};
