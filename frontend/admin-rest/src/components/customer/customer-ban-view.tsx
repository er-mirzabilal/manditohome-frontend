import ConfirmationCard from "@components/common/confirmation-card";
import { useUI } from "@contexts/ui.context";
import { useBlockUserMutation } from "@data/user/use-user-block.mutation";
import { useUnblockUserMutation } from "@data/user/use-user-unblock.mutation";

const CustomerBanView = () => {
  const { mutate: blockUser, isLoading: loading } = useBlockUserMutation();
  const {
    mutate: unblockUser,
    isLoading: activeLoading,
  } = useUnblockUserMutation();

  const {
    closeModal,
    modalData: { id, type },
  } = useUI();
  async function handleDelete() {
    if (type === "ban") {
      blockUser(id);
    } else {
      unblockUser(id);
    }
    closeModal();
  }
  return (
    <ConfirmationCard
      onCancel={closeModal}
      onDelete={handleDelete}
      deleteBtnText={type === "ban" ? "Block" : "Unblock"}
      title={type === "ban" ? "Block Customer" : "Unblock Customer"}
      description="Are you sure you want to block this customer?"
      deleteBtnLoading={loading || activeLoading}
    />
  );
};

export default CustomerBanView;
