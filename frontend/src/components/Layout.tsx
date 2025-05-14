import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <header>
                <Navbar />
            </header>

            <main className="p-2 md:p-4 mt-16 flex-grow">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};

export default Layout;