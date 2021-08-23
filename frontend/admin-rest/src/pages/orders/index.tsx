import Card from "@components/common/card";
import Layout from "@components/common/layout";
import Search from "@components/common/search";
import OrderList from "@components/order/order-list";
import { useState } from "react";
import ErrorMessage from "@components/ui/error-message";
import Loader from "@components/ui/loader/loader";
import { useOrdersQuery } from "@data/order/use-orders.query";
import {DatePicker} from "@components/ui/date-picker";
import Button from "@components/ui/button";
import SidebarModal from "@components/common/sidebarModal";
import OrderItemsTotal from "@components/order-items-total/order-item-total";

export default function Orders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState(new Date);
  const [toDate, setToDate] = useState(new Date);
  const [open, setOpen] = useState(false);

  const { data, isLoading: loading, error } = useOrdersQuery({
    limit: 20,
    page,
    text: searchTerm,
    fromDate,
    toDate,
  });
  console.log(data);
  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error.message} />;
  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }
  function handlePagination(current: any) {
    setPage(current);
  }
  // @ts-ignore
  // @ts-ignore
  return (
    <>
      <Card className="flex flex-col md:flex-row items-center mb-4">
        <div className="md:w-1/4 mb-4 md:mb-0">
          <h1 className="text-lg font-semibold text-heading">Orders</h1>
        </div>

        <div className="w-full md:w-2/4 flex items-bottom justify-center ml-auto ">
          <Search onSearch={handleSearch} />
        </div>
        <div className="w-full md:w-1/4 flex items-center ml-auto mb-6">
          <div className='px-1'>
            <label>From</label>
          <DatePicker
              dateFormat="dd/MM/yyyy"
              onChange={(date)=> setFromDate(date) }
              onBlur={()=>{}}
              selected={fromDate}
              selectsStart
              // minDate={new Date()}
              maxDate={new Date()}
              // startDate={active_from}
              // endDate={expire_at}
              className="border border-gray-300"
          />
          </div>
          <div className='px-1'>
            <label>To</label>

            <DatePicker
              dateFormat="dd/MM/yyyy"
              onChange={(date)=> setToDate(date)}
              onBlur={()=>{}}
              selected={toDate}
              selectsStart
              // minDate={new Date()}
              maxDate={new Date()}
              // startDate={active_from}
              // endDate={expire_at}
              className="border border-gray-300"
          />
          </div>
          <div className='px-1'>
              <Button onClick={() => setOpen(true)}> + </Button>
          </div>
          </div>
      </Card>

      <OrderList orders={data?.orders} onPagination={handlePagination} />
      <SidebarModal open={open} onClose={()=>{setOpen(false)}}>
        <OrderItemsTotal items={data?.orders?.data} closeSidebar={()=> {setOpen(false)}}/>
      </SidebarModal>

    </>
  );
}
Orders.Layout = Layout;
