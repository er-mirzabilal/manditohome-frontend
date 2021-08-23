import {motion} from "framer-motion";
import {fadeInOut} from "@utils/motion/fade-in-out";

interface ItemsTotalProps {
    item: any;
    key: number;
}

const ItemTotal = ({ item }: ItemsTotalProps) => {

    return (
        <motion.div
            layout
            initial="from"
            animate="to"
            exit="from"
            variants={fadeInOut(0.25)}
            className="flex items-center py-2 px-4 sm:px-6 text-sm border-b border-solid border-gray-200 border-opacity-75"
        >
            <div className='w-4/6 text-base'>
                {item.name}
            </div>
            <div className='w-1/6 text-center text-lg'>
                {item.quantity}
            </div>
            <div className='w-1/6 text-center text-lg'>
                {item.unit}
            </div>
        </motion.div>
    );
};

export default ItemTotal;
