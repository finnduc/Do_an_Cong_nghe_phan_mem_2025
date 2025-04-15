import AIWorkspace from "../../../components/AIWorkspace/AIWorkspace"


export default function HelperPage(){

    return <div className="w-full text-black mx-[50px] flex flex-col py-[12px] gap-[5px]">
        <div className="text-[25px] font-semibold text-gray-800">AI hỗ trợ truy vấn SQL</div>
        <AIWorkspace />
    </div>
}