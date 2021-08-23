import {AnimateSharedLayout, motion} from "framer-motion";
import EmptyCartIcon from "@components/icons/empty-cart";
import {CloseIcon} from "@components/icons/close-icon";
import {fadeInOut} from "@utils/motion/fade-in-out";
import {Table} from "@components/ui/table";

const columns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        align: "left",
        width: 300,
    },
    {
        title: "Qty",
        dataIndex: "quantity",
        key: "quantity",
        align: "center",
    },
    {
        title: "Unit",
        dataIndex: "unit",
        key: "unit",
        align: "center",
    },
]
const OrderItemsTotal = ({closeSidebar, items}: any) => {

    const getFormattedData = () => {
        const formatData: any = {};
        if(items && items.length){
            items.map((order: any) => {
                if(order.products && order.products.length){
                    order.products.map((product: any) =>{
                        if(formatData[product.id]){
                            formatData[product.id] = {
                                    ...formatData[product.id],
                                    quantity: formatData[product.id].quantity + parseFloat(product.pivot.order_quantity)
                                }
                        }
                        else {
                            formatData[product.id] = {
                                name: product.name,
                                unit: product.unit,
                                quantity: parseFloat(product.pivot.order_quantity),
                                type_id: product.type_id,
                            }
                        }
                    })
                }
            })
        }
        return Object.values(formatData);
    }
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    // @ts-ignore
    return (
        <section className="flex flex-col h-full relative">
            <header className="fixed max-w-md w-full top-0 z-10 bg-white py-4 px-6 flex items-center justify-between border-b border-gray-200 border-opacity-75">
                <div className="flex text-primary font-semibold">
                    <span className="flex ml-2">
                            Order Items Total
                     </span>
                </div>
                <button
                    onClick={() => closeSidebar()}
                    className="w-7 h-7 ml-3 -mr-2 flex items-center justify-center rounded-full text-gray-400 bg-gray-100 transition-all duration-200 focus:outline-none hover:bg-primary focus:bg-primary hover:text-white focus:text-white"
                >
                    <span className="sr-only">close</span>
                    <CloseIcon className="w-3 h-3" />
                </button>
            </header>
            <AnimateSharedLayout>
                    <motion.div layout className="flex-grow pt-16">
                        {getFormattedData().length > 0 ? (
                                <Table
                                     /*@ts-ignore*/
                                    columns={columns}
                                    /*@ts-ignore*/
                                    data={getFormattedData()}
                                    rowKey="id"
                                    tableLayout='fixed'
                                />
                            )
                            : (
                                <motion.div
                                    layout
                                    initial="from"
                                    animate="to"
                                    exit="from"
                                    variants={fadeInOut(0.25)}
                                    className="h-full flex flex-col items-center justify-center"
                                >
                                    <EmptyCartIcon width={140} height={176} />
                                    <h4 className="mt-6 text-gray-500 font-semibold">
                                        No products found
                                    </h4>
                                </motion.div>
                            )}
                    </motion.div>

            </AnimateSharedLayout>
        </section>
    );
};

export default OrderItemsTotal;
