import SidebarMenu from "@components/ui/sidebar-menu";
import { siteSettings } from "@settings/site.settings";
const Sidebar = () => {
  return (
    <aside className="shadow w-72 xl:w-76 hidden lg:block overflow-y-auto bg-white px-4 fixed left-0 bottom-0 h-full pt-22">
      <SidebarMenu items={siteSettings.sidebarLinks} />
    </aside>
  );
};

export default Sidebar;
