import { axiosInstance } from '../client'
import { PDF_PARSER } from '../endpoints'

export const pdfParserApi = {
  listJobs: () => axiosInstance.get(PDF_PARSER.LIST_JOBS),
  preview: (jobId: string | number) => axiosInstance.get(PDF_PARSER.PREVIEW(jobId)),
  uploadExam: (formData: FormData) =>
    axiosInstance.post(PDF_PARSER.UPLOAD_EXAM, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  processExam: (jobId: string | number) => axiosInstance.post(PDF_PARSER.PROCESS_EXAM(jobId)),
  approveExam: (jobId: string | number, data: Record<string, unknown>) =>
    axiosInstance.post(PDF_PARSER.APPROVE_EXAM(jobId), data),
  uploadStudyPlan: (formData: FormData) =>
    axiosInstance.post(PDF_PARSER.UPLOAD_STUDY_PLAN, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  processStudyPlan: (jobId: string | number) =>
    axiosInstance.post(PDF_PARSER.PROCESS_STUDY_PLAN(jobId)),
  approveStudyPlan: (jobId: string | number, data: Record<string, unknown>) =>
    axiosInstance.post(PDF_PARSER.APPROVE_STUDY_PLAN(jobId), data),
}
