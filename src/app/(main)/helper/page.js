import AIWorkspace from "../../../components/ai_helper/AIWorkspace"


export default function HelperPage(){

    return <div className="text-black mx-[50px] flex flex-col py-[12px] gap-[5px]">
        <div className="text-[25px] font-semibold text-gray-800">AI hỗ trợ truy vấn SQL</div>
        <AIWorkspace />
    </div>
}