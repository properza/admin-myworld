import { useState } from 'react';

import LogoutModal from './LogoutModal';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

interface LayoutProps {
  title: string
  pathname: string
  isSubRoute: boolean
  returnRoute: string
  children: React.ReactNode;
}

export default function Layout({ title, pathname, isSubRoute, returnRoute, children }: LayoutProps) {
  const [isLogoutModalOpen, setLogoutModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setLogoutModalOpen(true);
  }

  return (
    <div className="flex h-full">
      <Sidebar pathname={pathname} openModal={openModal} />

      <div className="flex-1 flex flex-col">
        <Topbar title={title} isSubRoute={isSubRoute} returnRoute={returnRoute} />

        <main className={`flex-1 bg-[#f7f7f8] p-4`}>
          {children}
          <LogoutModal isModalOpen={isLogoutModalOpen} setIsModalOpen={setLogoutModalOpen} />
        </main>
      </div>
    </div>
  );
}
