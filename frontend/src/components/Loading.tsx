import { FiLoader } from "react-icons/fi";


const Loading = () =>{
    return(
        <div className="w-full h-screen bg-black flex justify-center items-center">
            <div className="rounded-full  animate-spin text-white"><FiLoader size={40}/></div>
        </div>
    )
}

export default Loading;