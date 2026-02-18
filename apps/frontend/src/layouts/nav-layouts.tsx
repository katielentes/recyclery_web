import { Outlet } from 'react-router-dom';
import TopBanner from '../components/cms/TopBanner.tsx';
import Footer from '../components/footer/footer.tsx';
import NavBar from '../components/navigation/nav-bar.tsx';

export default function NavLayout() {
  return (
    <div className="h-[100vh] flex flex-col bg-background">
      <TopBanner />
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}
