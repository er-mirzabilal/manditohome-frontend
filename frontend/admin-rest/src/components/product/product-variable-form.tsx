import Input from "@components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import Label from "@components/ui/label";
import Title from "@components/ui/title";

import Checkbox from "@components/ui/checkbox/checkbox";
import SelectInput from "@components/ui/select-input";
import { cartesian } from "@utils/cartesian";
import isEmpty from "lodash/isEmpty";
import { useEffect } from "react";
import { Attribute, Product } from "@ts-types/generated";

type IProps = {
	initialValues?: Product | null;
	attributes?: Attribute[] | null;
};

function filteredAttributes(attributes: any, variations: any) {
	let res = [];
	res = attributes.filter((el: any) => {
		return !variations.find((element: any) => {
			return element?.attribute?.slug === el?.slug;
		});
	});
	return res;
}

function getCartesianProduct(values: any) {
	const formattedValues = values
		?.map((v: any) =>
			v.value?.map((a: any) => ({ name: v.attribute.name, value: a.value }))
		)
		.filter((i: any) => i !== undefined);
	if (isEmpty(formattedValues)) return [];
	return cartesian(...formattedValues);
}

export default function ProductVariableForm({
	attributes,
	initialValues,
}: IProps) {
	const {
		register,
		control,
		watch,
		setValue,
		getValues,
		formState: { errors },
	} = useFormContext();
	// This field array will keep all the attribute dropdown fields
	const { fields, append, remove } = useFieldArray({
		shouldUnregister: true,
		control,
		name: "variations",
	});
	const variations = watch("variations");

	const cartesianProduct = getCartesianProduct(getValues("variations"));

	return (
		<div className="flex flex-wrap my-5 sm:my-8">
			<Description
				title="Product Variation Information"
				details={`${
					initialValues ? "Update" : "Choose"
				} your product variation and necessary information from here`}
				className="w-full px-0 sm:pr-4 md:pr-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
			/>
			<Card className="w-full sm:w-8/12 md:w-2/3 p-0 md:p-0">
				<div className="border-t border-dashed border-gray-200 mb-5 md:mb-8">
					<Title className="text-lg uppercase text-center px-5 md:px-8 mb-0 mt-8">
						Options
					</Title>
					<div>
						{fields?.map((field: any, index: number) => {
							return (
								<div
									key={field.id}
									className="border-b border-dashed border-gray-200 last:border-0 p-5 md:p-8"
								>
									<div className="flex items-center justify-between">
										<Title className="mb-0">Option {index + 1}</Title>
										<button
											onClick={() => remove(index)}
											type="button"
											className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none"
										>
											Remove
										</button>
									</div>

									<div className="grid grid-cols-fit gap-5">
										<div className="mt-5">
											<Label>Attribute Name*</Label>
											<SelectInput
												name={`variations[${index}].attribute`}
												control={control}
												defaultValue={field.attribute}
												getOptionLabel={(option: any) => option.name}
												getOptionValue={(option: any) => option.id}
												options={filteredAttributes(attributes, variations)!}
											/>
										</div>

										<div className="mt-5 col-span-2">
											<Label>Attribute Value*</Label>
											<SelectInput
												isMulti
												name={`variations[${index}].value`}
												control={control}
												defaultValue={field.value}
												getOptionLabel={(option: any) => option.value}
												getOptionValue={(option: any) => option.id}
												options={
													watch(`variations[${index}].attribute`)?.values
												}
											/>
										</div>
									</div>
								</div>
							);
						})}
					</div>

					<div className="px-5 md:px-8">
						<Button
							disabled={fields.length === attributes?.length}
							onClick={(e: any) => {
								e.preventDefault();
								append({ attribute: "", value: [] });
							}}
							type="button"
						>
							Add an option
						</Button>
					</div>

					{/* Preview generation section start */}
					{!!cartesianProduct?.length && (
						<div className="border-t border-dashed border-gray-200 pt-5 md:pt-8 mt-5 md:mt-8">
							<Title className="text-lg uppercase text-center px-5 md:px-8 mb-0">
								{cartesianProduct?.length} Variations Added
							</Title>
							{cartesianProduct.map(
								(fieldAttributeValue: any, index: number) => {
									return (
										<div
											key={`fieldAttributeValues-${index}`}
											className="border-b last:border-0 border-dashed border-gray-200 p-5 md:p-8 md:last:pb-0 mb-5 last:mb-8 mt-5"
										>
											<Title className="!text-lg mb-8">
												Variant:{" "}
												<span className="text-blue-600 font-normal">
													{Array.isArray(fieldAttributeValue)
														? fieldAttributeValue?.map((a) => a.value).join("/")
														: fieldAttributeValue.value}
												</span>
											</Title>
											<TitleAndOptionsInput
												register={register}
												setValue={setValue}
												index={index}
												fieldAttributeValue={fieldAttributeValue}
											/>

											<input
												{...register(`variation_options.${index}.id`)}
												type="hidden"
											/>

											<div className="grid grid-cols-2 gap-5">
												<Input
													label="Price*"
													type="number"
													{...register(`variation_options.${index}.price`)}
													error={
														errors.variation_options?.[index]?.price?.message
													}
													variant="outline"
													className="mb-5"
												/>
												<Input
													label="Sell Price"
													type="number"
													{...register(`variation_options.${index}.sale_price`)}
													error={
														errors.variation_options?.[index]?.sale_price
															?.message
													}
													variant="outline"
													className="mb-5"
												/>
												<Input
													label="SKU*"
													{...register(`variation_options.${index}.sku`)}
													error={
														errors.variation_options?.[index]?.sku?.message
													}
													variant="outline"
													className="mb-5"
												/>
												<Input
													label="Quantity*"
													type="number"
													{...register(`variation_options.${index}.quantity`)}
													error={
														errors.variation_options?.[index]?.quantity?.message
													}
													variant="outline"
													className="mb-5"
												/>
											</div>
											<div className="mb-5 mt-5">
												<Checkbox
													{...register(`variation_options.${index}.is_disable`)}
													error={
														errors.variation_options?.[index]?.is_disable
															?.message
													}
													label="Disable This Variant"
												/>
											</div>
										</div>
									);
								}
							)}
						</div>
					)}
				</div>
			</Card>
		</div>
	);
}

export const TitleAndOptionsInput = ({
	fieldAttributeValue,
	index,
	setValue,
	register,
}: any) => {
	const title = Array.isArray(fieldAttributeValue)
		? fieldAttributeValue.map((a) => a.value).join("/")
		: fieldAttributeValue.value;
	const options = Array.isArray(fieldAttributeValue)
		? JSON.stringify(fieldAttributeValue)
		: JSON.stringify([fieldAttributeValue]);
	useEffect(() => {
		setValue(`variation_options.${index}.title`, title);
		setValue(`variation_options.${index}.options`, options);
	}, [fieldAttributeValue]);
	return (
		<>
			<input {...register(`variation_options.${index}.title`)} type="hidden" />
			<input
				{...register(`variation_options.${index}.options`)}
				type="hidden"
			/>
		</>
	);
};
