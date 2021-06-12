import Logo from "@components/ui/logo";
import { useUI } from "@contexts/ui.context";
import AuthorizedMenu from "./authorized-menu";
import Drawer from "@components/ui/drawer";
import LinkButton from "@components/ui/link-button";
import { NavbarIcon } from "@components/icons/navbar-icon";
import { motion } from "framer-motion";
import DrawerWrapper from "@components/ui/drawer-wrapper";
import SidebarMenu from "@components/ui/sidebar-menu";
import { siteSettings } from "@settings/site.settings";

const Navbar = () => {
  const { toggleSidebar, displaySidebar, closeSidebar } = useUI();

  return (
    <header className="bg-white shadow fixed w-full z-40">
      <nav className="px-5 md:px-8 py-4 flex items-center justify-between">
        {/* <!-- Mobile menu button --> */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={toggleSidebar}
          className="flex p-2 h-full items-center justify-center focus:outline-none focus:text-primary lg:hidden"
        >
          <NavbarIcon />
        </motion.button>

        <div className="hidden md:flex ml-5 mr-auto">
          <Logo />
        </div>

        <Drawer open={displaySidebar} onClose={closeSidebar} variant="left">
          <DrawerWrapper onClose={closeSidebar}>
            <SidebarMenu
              items={siteSettings.sidebarLinks}
              className="px-5 py-3"
            />
          </DrawerWrapper>
        </Drawer>

        <div className="flex items-center space-x-8">
          <LinkButton
            href="/products/create"
            className="ml-4 md:ml-6"
            size="small"
          >
            Add Products
          </LinkButton>

          <AuthorizedMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
