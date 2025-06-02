"use client";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal, Pencil, Square } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { format } from "sql-formatter";
import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { sql } from "@codemirror/lang-sql";
import CodeMirror from "@uiw/react-codemirror";
import ReuseTable from "../ReuseTable";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { EditorState } from "@codemirror/state";
import { generateSQL, executeSQL } from "@/lib/api/ai";
import { filterIdColumns } from "@/lib/utils";

function formatSQL(text) {
  return format(text, { language: "mysql" });
}

export default function AiUI() {
  const [sqlQuery, setSqlQuery] = useState(""); // Giá trị SQL hiện tại
  const [openSQL, setOpenSQL] = useState(false);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentData, setCurrentData] = useState(null); // Dữ liệu hiện tại tương ứng với câu lệnh SQL
  const [totalRecords, setTotalRecords] = useState(0); // Tổng số lượng dữ liệu khi chưa limit
  const [isEditing, setIsEditing] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0); // Trigger rerender khi lưu thay đổi sau khi chỉnh sửa câu lệnh SQL
  const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi nếu có
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại của dữ liệu - trang 1 tương ứng LIMIT 8 OFFSET 0
  const originalQueryRef = useRef(""); // Lưu giá trị SQL gốc
  const tempQueryRef = useRef(""); // Lưu giá trị SQL tạm thời khi chỉnh sửa
  const pageSize = 9;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const filteredData = filterIdColumns(currentData);

  const updateHeight = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setQuestion(event.target.value);
  };

  const handleQuestion = async () => {
    if (!question.trim()) {
      toast.error("Please enter your question.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await generateSQL(question);
      console.log(data);
      if (typeof data.data === "string") {
        setCurrentData(data.data);
      } else {
        setSqlQuery(formatSQL(data.data.limited_sql_query));
        setCurrentData(data.data.result);
        setTotalRecords(data.data.total_count);
      }
    } catch (e) {
      setErrorMessage(e.message || "Internal sever error");
      toast.error(
        "An error occurred while creating the SQL query. Please try again or contact the administrator."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecution = async () => {
    setErrorMessage("");
    if (!sqlQuery.trim()) {
      toast.error("Please enter your SQL query.");
      return;
    }
    setIsExecuting(true);
    try {
      const data = await executeSQL(sqlQuery, 0, false);
      setQuestion("");
      setCurrentData(data.data.result);
      setTotalRecords(data.data.total_count);
      setSqlQuery(data.data.limited_sql_query);
      setOpenSQL(false);
    } catch (e) {
      setErrorMessage(e.message || "Internal sever error");
      toast.error(
        "An error occurred while creating the SQL query. Please try again or contact the administrator."
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const getNextPage = async (page) => {
    const offset = (page - 1) * 8;
    try {
      const data = await executeSQL(sqlQuery, offset, true);
      setCurrentData(data.data.result);
      setCurrentPage(page);
      setSqlQuery(data.data.limited_sql_query);
    } catch (e) {
      setErrorMessage(e.message || "Internal sever error");
      toast.error(
        "An error occurred while creating the SQL query. Please try again or contact the administrator."
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 min-h-[550px] bg-white px-4 py-2 rounded-xl border shadow-sm">
      <Toaster />
      <div className="border border-input rounded-xl shadow-sm flex p-3 w-full bg-white">
        <Textarea
          value={question}
          className="min-h-[40px] resize-none overflow-hidden border-0 shadow-none focus-visible:ring-0 px-0 py-0"
          placeholder="Enter your question..."
          onChange={updateHeight}
          
        />
        <button
          className="size-[40px] p-2 rounded-[50%] text-white flex items-center justify-center hover:bg-blue-700 bg-blue-500"
          onClick={handleQuestion}
          disabled={isLoading}
        >
          {isLoading ? (
            <Square
              strokeWidth={1.5}
              size={20}
              className="bg-white rounded-sm"
            />
          ) : (
            <SendHorizonal strokeWidth={1.5} />
          )}
        </button>
      </div>
      <div className="w-full flex">
        <div className="text-xs text-gray-600 text-center grow">
          AI can make mistake when generating SQL query, please double check the
          generated SQL query for better result.
        </div>
        <HoverCard openDelay={1}>
          <HoverCardTrigger className="ml-auto border-2 border-blue-500 rounded-lg text-blue-500 hover:text-white hover:bg-blue-500">
            <button
              className="p-2 rounded-xl"
              onClick={() => {
                setOpenSQL(true);
                setIsEditing(false);
                originalQueryRef.current = sqlQuery; // Lưu query gốc
                tempQueryRef.current = sqlQuery;
              }}
            >
              <Pencil strokeWidth={2.5} size={20} />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="size-fit text-sm">
            Edit the SQL query
          </HoverCardContent>
        </HoverCard>
      </div>
      {typeof currentData === "string" ? (
        <div className="w-full text-center text-black/75">{currentData}</div>
      ) : (
        currentData && (
          <ReuseTable
            columns={filteredData.columns}
            rows={filteredData.rows}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={getNextPage}
            currentPage={currentPage}
          />
        )
      )}

      {openSQL && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-stone-50 rounded-2xl p-[20px] flex flex-col items-center gap-2">
            <CodeMirror
              key={forceUpdate}
              value={formatSQL(tempQueryRef.current)}
              extensions={[
                sql(),
                !isEditing ? EditorState.readOnly.of(true) : [],
              ]}
              height="300px"
              width="500px"
              onChange={(value) => (tempQueryRef.current = value)}
            />
            {errorMessage && (
              <div className="text-red-500 text-sm w-[500px]">
                {errorMessage}
              </div>
            )}
            <div className="w-full flex justify-between">
              <div className="flex self-end gap-2">
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-700"
                  onClick={() => {
                    if (isEditing) {
                      tempQueryRef.current = originalQueryRef.current;
                      setForceUpdate((prev) => prev + 1);
                    }
                    setIsEditing(!isEditing);
                  }}
                >
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
                {isEditing && (
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-700"
                    onClick={() => {
                      originalQueryRef.current = tempQueryRef.current;
                      setIsEditing(false);
                      setSqlQuery(tempQueryRef.current);
                    }}
                  >
                    Save
                  </Button>
                )}
              </div>
              <div className="flex self-end gap-2">
                <Button
                  className="w-[90px] bg-white border-[1px] hover:bg-blue-700 hover:text-white border-blue-500 text-blue-500"
                  onClick={() => {
                    setOpenSQL(false);
                    setIsEditing(false);
                    tempQueryRef.current = originalQueryRef.current;
                  }}
                >
                  Close
                </Button>
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-700"
                  onClick={handleExecution}
                  disabled={isExecuting || isEditing}
                >
                  {isExecuting ? "Executing..." : "Execute"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
