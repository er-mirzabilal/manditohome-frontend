import Modal from "@components/ui/modal";
import { useUI } from "@contexts/ui.context";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import dynamic from "next/dynamic";
const TaxDeleteView = dynamic(() => import("@components/tax/tax-delete-view"));
const BanCustomerView = dynamic(
  () => import("@components/customer/customer-ban-view")
);
const ShippingDeleteView = dynamic(
  () => import("@components/shipping/shipping-delete-view")
);
const AttributeDeleteView = dynamic(
  () => import("@components/attribute/attribute-delete-view")
);
const AttributeValueDeleteView = dynamic(
  () => import("@components/attribute-values/attribute-values-delete-view")
);
const CategoryDeleteView = dynamic(
  () => import("@components/category/category-delete-view")
);
const CouponDeleteView = dynamic(
  () => import("@components/coupon/coupon-delete-view")
);

const ProductDeleteView = dynamic(
  () => import("@components/product/product-delete-view")
);
const TypeDeleteView = dynamic(
  () => import("@components/type/type-delete-view")
);

const Layout: React.FC = ({ children }) => {
  const { displayModal, closeModal, modalView } = useUI();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col transition-colors duration-150">
      <Navbar />
      <div className="flex flex-1 pt-20">
        <Sidebar />
        <main className="w-full lg:pl-72 xl:pl-76">
          <div className="p-5 md:p-8 overflow-y-auto h-full">{children}</div>
        </main>
      </div>
      {/* render modal */}
      <Modal
        open={displayModal}
        onClose={closeModal}
        containerClassName="max-w-xs"
        // useBlurBackdrop={true}
      >
        {modalView === "DELETE_PRODUCT" && <ProductDeleteView />}
        {modalView === "DELETE_TYPE" && <TypeDeleteView />}
        {modalView === "DELETE_CATEGORY" && <CategoryDeleteView />}
        {modalView === "DELETE_ATTRIBUTE" && <AttributeDeleteView />}
        {modalView === "DELETE_ATTRIBUTE_VALUE" && <AttributeValueDeleteView />}
        {modalView === "DELETE_COUPON" && <CouponDeleteView />}
        {modalView === "DELETE_TAX" && <TaxDeleteView />}
        {modalView === "DELETE_SHIPPING" && <ShippingDeleteView />}
        {modalView === "BAN_CUSTOMER" && <BanCustomerView />}
      </Modal>
    </div>
  );
};
export default Layout;
