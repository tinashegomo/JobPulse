import { Outlet } from 'react-router-dom';
import TopNav from './TopNav';
import BottomNav from './BottomNav';

export default function MainLayout() {
  return (
    <div className="flex flex-col h-dvh w-full overflow-hidden bg-bg-subtle">
      <TopNav />

      <main className="flex-1 p-4 md:p-6 pt-6 md:pt-8 pb-80 lg:pb-8 overflow-y-auto scroll-smooth">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}
