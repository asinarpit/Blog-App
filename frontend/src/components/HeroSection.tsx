import { FaPenAlt } from "react-icons/fa";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";


const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="min-h-[80vh] sm:min-h-[90vh] bg-gray-100 dark:bg-gray-800 flex items-center py-6 sm:py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl flex flex-col-reverse md:flex-row items-center gap-6 sm:gap-8 md:gap-12">

        <div className="flex-1 text-center md:text-left relative z-10 mt-2 md:mt-0">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-600 dark:text-gray-300 leading-tight">
            Welcome to My<br />
            <span className="text-red-500 dark:text-red-400">Digital Notebook</span><br className="hidden xs:block" />
            <span className="inline xs:hidden"> - </span>Where Ideas Meet Code
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-4 sm:mb-8 mx-auto md:mx-0 max-w-md sm:max-w-xl
              rounded-xl p-2 sm:p-6 bg-gray-100 dark:bg-gray-800 
              shadow-neumorphic dark:shadow-dark-neumorphic">
            Join me as I share lessons learned, coding adventures, and
            personal reflections on building things for the web.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/blogs")}
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base md:text-lg
                shadow-neumorphic dark:shadow-dark-neumorphic
                hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                active:scale-95 transition-shadow duration-300 
                text-gray-600 dark:text-gray-300
                flex items-center gap-2"
            >
              Explore Articles
              <MdOutlineKeyboardDoubleArrowRight className="text-xl" />
            </button>

            {
              user?.role === "admin" && (
                <button
                  onClick={() => navigate("/admin/blogs")}
                  className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base md:text-lg
                shadow-neumorphic dark:shadow-dark-neumorphic
                hover:shadow-neumorphic-inset dark:hover:shadow-dark-neumorphic-inset
                active:scale-95 transition-shadow duration-300 
                text-gray-600 dark:text-gray-300
                flex items-center gap-2"
                >
                  Create Post
                  <FaPenAlt className="text-lg" />
                </button>
              )
            }
          </div>
        </div>

        <div className="flex-1 w-full max-w-sm sm:max-w-md md:max-w-none mx-auto">
          <div className="relative rounded-[43%_57%_54%_46%/40%_49%_51%_60%] p-3 sm:p-4
              bg-gray-100 dark:bg-gray-800 
              shadow-neumorphic-lg dark:shadow-dark-neumorphic-lg 
              hover:shadow-neumorphic-lg-hover dark:hover:shadow-dark-neumorphic-lg-hover
              transition-shadow duration-300">
            <div className="rounded-[43%_57%_54%_46%/40%_49%_51%_60%] overflow-hidden 
                shadow-neumorphic-inset dark:shadow-dark-neumorphic-inset">
              <img
                src="https://img.freepik.com/free-photo/aerial-view-man-using-computer-laptop-wooden-table_53876-20657.jpg?uid=R157075104&ga=GA1.1.1688572313.1717767199&semt=ais_hybrid&w=740"
                alt="Web Development Illustration"
                className="w-full h-auto object-cover scale-105 hover:scale-100 
                  transition-transform duration-300 min-h-[250px] sm:min-h-[350px] md:min-h-[450px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;