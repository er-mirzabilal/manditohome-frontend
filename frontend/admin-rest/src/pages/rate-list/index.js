import {useEffect, useState} from "react";
import Layout from "@components/common/layout";
import {useRateListQuery} from '@data/rate-list/rateList.query';
import Loader from "@components/ui/loader/loader";
import Card from "@components/common/card";
import SelectInput from "@components/ui/select-input";
const initial = {
    categories: [],
    selectedCategory: [],
    products:[],
    loading: true
}
export  default  function rateList(){
    const { data,  isLoading, error } = useRateListQuery();
    const [state, setState] = useState(initial);
    useEffect(() => {
        if(error) setState({
            ...state,
            loading: false
        })
        else if(!isLoading && data) {
            const tempCategories = getCategories();
            setState({
                ...state,
                categories: tempCategories,
                selectedCategory: tempCategories[0],
                products: data[tempCategories[0].value].products,
                loading:false

            })
        }
        return () => {
            setState(initial);
        };
    }, [data,isLoading]);

    const getCategories = () => {
        return Object.keys(data).map(key =>{
            return {name: data[key].name, value: key}
        })
    }
    if(state.loading){
        return <Loader/>
    }
    if(error){
        return <div> {error.message}</div>
    }
    console.log(state);
    return (
        <>
        <Card className="flex flex-row items-center justify-between mb-8">
            <div className="md:w-1/4">
                <h1 className="text-xl font-semibold text-heading">
                    Rate List
                </h1>
            </div>
            <div className="flex items-center ml-auto">
                {/*<SelectInput*/}
                {/*    name="Category"*/}
                {/*    getOptionLabel={state.selectedCategory[0]}*/}
                {/*    getOptionValue={state.selectedCategory[1]}*/}
                {/*    options={state.categories}*/}
                {/*    control={}*/}
                {/*/>*/}
            </div>
        </Card>
        </>
    )
};

rateList.Layout = Layout;