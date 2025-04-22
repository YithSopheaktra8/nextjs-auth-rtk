import { NextJsApi } from "../api";

export const employeeApi = NextJsApi.injectEndpoints({
    endpoints: (builder) => ({
      startEmployeeProcedureTask: builder.mutation<any, { deptId: number }>({
        query: ({ deptId }) => ({
          url: `employees/department/${deptId}/start-task`,
          method: "POST",
        }),
      }),
      getTaskResult: builder.query<any, { taskId: string }>({
        query: ({ taskId }) => `employees/tasks/${taskId}/result`,
      }),
    }),
  });
  
  export const {
    useStartEmployeeProcedureTaskMutation,
    useLazyGetTaskResultQuery,
  } = employeeApi;
  