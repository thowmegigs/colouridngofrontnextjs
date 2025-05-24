"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, Download, FileText, CheckCircle, AlertCircle } from "lucide-react"

export default function ImportProductsForm() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      validateAndSetFile(droppedFile)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0]
      validateAndSetFile(selectedFile)
    }
  }

  const validateAndSetFile = (file: File) => {
    // Check file type
    const fileType = file.name.split(".").pop()?.toLowerCase()
    if (fileType !== "csv" && fileType !== "xlsx" && fileType !== "xls") {
      setUploadStatus("error")
      setErrorMessage("Please upload a CSV or Excel file")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus("error")
      setErrorMessage("File size should be less than 5MB")
      return
    }

    setFile(file)
    setUploadStatus("idle")
    setErrorMessage("")
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsUploading(false)
    setUploadStatus("success")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Import Products</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium">Import Products from Excel or CSV</h2>
            <p className="mt-1 text-sm text-gray-500">Upload your product data in bulk using an Excel or CSV file.</p>
          </div>

          <div className="border-t border-b py-6">
            <h3 className="text-sm font-medium mb-4">Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Download our template file to ensure your data is formatted correctly.</li>
              <li>Fill in your product information in the template.</li>
              <li>Save the file as Excel (.xlsx) or CSV (.csv).</li>
              <li>Upload the file using the form below.</li>
              <li>Review any errors and fix them in your file if needed.</li>
              <li>Confirm the import to add the products to your store.</li>
            </ol>

            <div className="mt-4">
              <button type="button" className="flex items-center text-sm text-pink-600 hover:text-pink-700">
                <Download size={16} className="mr-1" />
                Download Template
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-4">Upload File</h3>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? "border-pink-500 bg-pink-50" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {uploadStatus === "success" ? (
                <div className="flex flex-col items-center">
                  <CheckCircle size={48} className="text-green-500 mb-2" />
                  <p className="text-lg font-medium text-green-600">Upload Successful!</p>
                  <p className="mt-1 text-sm text-gray-500">Your file has been uploaded and is ready for import.</p>
                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <FileText size={16} className="mr-1" />
                    <span>{file?.name}</span>
                  </div>
                </div>
              ) : uploadStatus === "error" ? (
                <div className="flex flex-col items-center">
                  <AlertCircle size={48} className="text-red-500 mb-2" />
                  <p className="text-lg font-medium text-red-600">Upload Failed</p>
                  <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
                  <button
                    type="button"
                    className="mt-4 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    onClick={() => setUploadStatus("idle")}
                  >
                    Try Again
                  </button>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center">
                  <FileText size={48} className="text-gray-400 mb-2" />
                  <p className="text-lg font-medium">{file.name}</p>
                  <p className="mt-1 text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                  <div className="mt-4 flex space-x-2">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      onClick={() => {
                        setFile(null)
                        setUploadStatus("idle")
                      }}
                    >
                      Change File
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
                      onClick={handleUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Upload File"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload size={48} className="text-gray-400 mb-2" />
                  <p className="text-lg font-medium">Drag and drop your file here</p>
                  <p className="mt-1 text-sm text-gray-500">
                    or <span className="text-pink-600">browse</span> to upload
                  </p>
                  <p className="mt-2 text-xs text-gray-500">Supported formats: .xlsx, .xls, .csv (max 5MB)</p>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="file-upload"
                    className="mt-4 px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    Select File
                  </label>
                </div>
              )}
            </div>
          </div>

          {uploadStatus === "success" && (
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 text-sm bg-pink-600 text-white rounded-md hover:bg-pink-700"
                onClick={() => router.push("/vendor/products")}
              >
                Complete Import
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
