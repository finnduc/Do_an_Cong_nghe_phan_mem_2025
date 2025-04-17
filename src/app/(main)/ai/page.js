import AiUI from "../../../components/ai/AiUI"

export default function HelperPage(){

    return <div className="text-black flex flex-col gap-[5px]">
        <div className="text-2xl font-semibold text-gray-800 mb-4">AI hỗ trợ truy vấn SQL</div>
        <AiUI />
    </div>
}