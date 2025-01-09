import HelperTextarea from "@/components/HelperTextArea";


export default function HelperPage(){

    return <div className="w-full text-black mx-[50px] mb-[20px] flex flex-col py-[22px] gap-[22px]">
        <div className="text-[25px] font-semibold text-gray-800">Làm việc với dữ liệu của bạn cùng AI!</div>
        <HelperTextarea />
        
    </div>
}