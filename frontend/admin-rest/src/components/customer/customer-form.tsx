import Button from "@components/ui/button";
import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import { useForm } from "react-hook-form";
import Card from "@components/common/card";
import Description from "@components/ui/description";
import { useCreateUserMutation } from "@data/user/use-user-create.mutation";
import { yupResolver } from "@hookform/resolvers/yup";
import { customerValidationSchema } from "./customer-validation-schema";

type FormValues = {
  name: string;
  email: string;
  password: string;
};
const defaultValues = {
  email: "",
  password: "",
};

const CustomerCreateForm = () => {
  const { mutate: registerUser, isLoading: loading } = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    setError,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(customerValidationSchema),
  });

  async function onSubmit({ name, email, password }: FormValues) {
    registerUser(
      {
        variables: {
          name,
          email,
          password,
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
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title="Information"
          details="Add your customer information and create a new customer from here"
          className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label="Name"
            {...register("name")}
            type="text"
            variant="outline"
            className="mb-4"
            error={errors.name?.message}
          />
          <Input
            label="Email"
            {...register("email")}
            type="email"
            variant="outline"
            className="mb-4"
            error={errors.email?.message}
          />
          <PasswordInput
            label="Password"
            {...register("password")}
            error={errors.password?.message}
            variant="outline"
            className="mb-4"
          />
        </Card>
      </div>

      <div className="mb-4 text-right">
        <Button loading={loading} disabled={loading}>
          Create Customer
        </Button>
      </div>
    </form>
  );
};

export default CustomerCreateForm;
