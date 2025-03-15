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

function formatSQL(text) {
  return format(text, { language: "mysql" });
}

export default function AIWorkspace() {
  const [sqlQuery, setSqlQuery] = useState("");
  const [openSQL, setOpenSQL] = useState(false);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  const originalQueryRef = useRef(""); // Lưu giá trị SQL gốc
  const tempQueryRef = useRef(""); // Lưu giá trị SQL tạm thời khi chỉnh sửa

  const updateHeight = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setQuestion(event.target.value);
  };

  const handleQuestion = async () => {
    if (!question.trim()) {
      toast.error("Vui lòng nhập yêu cầu.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);

      setSqlQuery(formatSQL(data.sql_statement));
      setCurrentData(data.data);
    } catch {
      toast.error("The request failed due to an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecution = async () => {
    if (!sqlQuery.trim()) {
      toast.error("Truy vấn SQL chưa được nhập.");
      return;
    }

    try {
      setIsExecuting(true);
      const response = await fetch("http://localhost:8000/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql: sqlQuery }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);

      setCurrentData(data.data);
    } catch {
      toast.error("The request failed due to an error. Please try again.");
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg flex flex-col p-5 border border-input gap-2 h-[550px]">
      <Toaster />
      <div className="border border-input rounded-xl shadow-sm flex p-3 w-full">
        <Textarea
          className="min-h-[40px] resize-none overflow-hidden border-0 shadow-none focus-visible:ring-0 px-0 py-0"
          placeholder="Nhập yêu cầu của bạn để tạo truy vấn SQL."
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

      <HoverCard openDelay={1}>
        <HoverCardTrigger className="self-end border-2 border-blue-500 rounded-lg text-blue-500 hover:text-white hover:bg-blue-500">
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
          Chỉnh sửa truy vấn SQL
        </HoverCardContent>
      </HoverCard>

      {currentData && (
        <ReuseTable columns={currentData.columns} rows={currentData.rows} />
      )}

      {openSQL && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-stone-50 rounded-2xl p-[20px] flex flex-col items-center gap-2">
            <CodeMirror
              key={forceUpdate}
              value={tempQueryRef.current}
              extensions={[
                sql(),
                !isEditing ? EditorState.readOnly.of(true) : [],
              ]}
              height="300px"
              width="500px"
              onChange={(value) => (tempQueryRef.current = value)}
            />
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
                  {isEditing ? "Hủy" : "Chỉnh sửa"}
                </Button>
                {isEditing && (
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-700"
                    onClick={() => {
                      setIsEditing(false);
                      setSqlQuery(tempQueryRef.current);
                    }}
                  >
                    Lưu
                  </Button>
                )}
              </div>
              <div className="flex self-end gap-2">
                <Button
                  className="w-[90px] bg-white border-[1px] hover:bg-blue-700 hover:text-white border-blue-500 text-blue-500"
                  onClick={() => {
                    setOpenSQL(false);
                    setIsEditing(false);
                    tempQueryRef.current = originalQueryRef.current; // Không thay đổi query nếu chưa lưu
                  }}
                >
                  Đóng
                </Button>
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-700"
                  onClick={handleExecution}
                >
                  {isExecuting ? "Đang chạy" : "Chạy lệnh"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
