"use client";
import { Button } from "@/components/ui/button";
import {
  useLazyGetTaskResultQuery,
  useStartEmployeeProcedureTaskMutation,
} from "@/redux/services/employees";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  // const { data: getEmployeesByDepartmentData } =
  //   useGetEmployeesByDepartmentQuery({ deptId: 30 });

  const [startTask] = useStartEmployeeProcedureTaskMutation();
  const [triggerResult, { data: taskResult, isLoading: isPolling }] =
    useLazyGetTaskResultQuery();

  const [taskId, setTaskId] = useState<string | null>(null);
  const [intervalId, setIntervalId] = useState<any>(null);
  const [resultData, setResultData] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [completedTaskData, setCompletedTaskData] = useState<any>(null);

  const startPolling = (id: string) => {
    return setInterval(async () => {
      try {
        const result = await triggerResult({ taskId: id }, true).unwrap();
        setResultData(result);
        clearInterval(intervalId); // ✅ stop polling when done
        localStorage.removeItem("taskId"); // ✅ clear storage
      } catch (err: any) {
        if (err?.status !== 202) {
          console.error("Error polling:", err);
          clearInterval(intervalId);
        }
      }
    }, 3000);
  };

  const startAsyncTask = async () => {
    const res = await startTask({ deptId: 30 }).unwrap();
    setTaskId(res.taskId);
    localStorage.setItem("taskId", res.taskId); // 🔥 store taskId

    const id = startPolling(res.taskId);
    setIntervalId(id);
  };

  const checkTaskStatus = async (taskId: string) => {
    try {
      const result = await triggerResult({ taskId }, true).unwrap();
      setCompletedTaskData(result);
      setShowPopup(true); // 🚀 show popup if completed
      localStorage.removeItem("taskId");
    } catch (err: any) {
      if (err?.status === 202) {
        setShowPopup(true); // Task still running
      } else {
        console.error("Error checking task:", err);
      }
    }
  };

  useEffect(() => {
    const savedTaskId = localStorage.getItem("taskId");
    if (savedTaskId) {
      setTaskId(savedTaskId);
      const id = startPolling(savedTaskId);
      setIntervalId(id);
    }
  }, []);

  useEffect(() => {
    const savedTaskId = localStorage.getItem("taskId");
    if (savedTaskId) {
      checkTaskStatus(savedTaskId);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("taskId");
    fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        router.push("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {showPopup && (
          <div className="fixed bottom-8 right-8 bg-white border shadow-lg p-4 rounded-lg z-50">
            <p className="font-semibold">
              {completedTaskData
                ? "Your data is ready!"
                : "Your task is still processing..."}
            </p>
            {completedTaskData && (
              <Button
                className="mt-2"
                onClick={() => {
                  setResultData(completedTaskData);
                  setShowPopup(false);
                }}
              >
                View Data
              </Button>
            )}
            {!completedTaskData && (
              <Button className="mt-2" onClick={() => setShowPopup(false)}>
                Close
              </Button>
            )}
          </div>
        )}

        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div className="flex gap-4">
          <Button onClick={startAsyncTask}>Load Employees</Button>
          <Button onClick={logout}>Logout</Button>
        </div>
        {isPolling && <p>Polling for task result...</p>}

        {resultData?.employees && (
          <div className="overflow-x-auto mt-4">
            {/* exceute time */}
            <div className="text-sm text-gray-500 mb-2">
              <p className="font-bold text-black">Excecute time : </p>
              {resultData?.executeTime}
            </div>
            <table className="min-w-full text-sm text-left border border-gray-300 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Phone</th>
                  <th className="px-4 py-2 border">Hire Date</th>
                  <th className="px-4 py-2 border">Job ID</th>
                  <th className="px-4 py-2 border">Salary</th>
                </tr>
              </thead>
              <tbody>
                {resultData.employees.map((emp: any) => (
                  <tr key={emp.employeeId} className="even:bg-gray-50">
                    <td className="px-4 py-2 border">{emp.employeeId}</td>
                    <td className="px-4 py-2 border">
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="px-4 py-2 border">{emp.email}</td>
                    <td className="px-4 py-2 border">{emp.phoneNumber}</td>
                    <td className="px-4 py-2 border">{emp.hireDate}</td>
                    <td className="px-4 py-2 border">{emp.jobId}</td>
                    <td className="px-4 py-2 border">${emp.salary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file-text.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
