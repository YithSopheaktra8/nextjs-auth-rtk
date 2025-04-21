import { NextJsApi } from "../api";

export const employeeApi = NextJsApi.injectEndpoints({
    endpoints: (builder) => ({
        getEmployeesByDepartment: builder.query<any, {deptId : number}>({
            query: ({deptId}) => `employees/department/${deptId}`
        }),
    }),
});

export const { 
    useGetEmployeesByDepartmentQuery,
    useLazyGetEmployeesByDepartmentQuery,
 } = employeeApi;