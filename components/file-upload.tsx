"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DataPreview } from "@/components/data-preview"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react"
import type { FileData } from "@/app/page"

interface FileUploadProps {
  onFileUpload: (data: FileData) => void
  fileData: FileData | null
}

export function FileUpload({ onFileUpload, fileData }: FileUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processFile = useCallback(
    async (file: File) => {
      setIsProcessing(true)
      setError(null)

      try {
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: "buffer" })

        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[worksheetName]

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]

        if (jsonData.length === 0) {
          throw new Error("File appears to be empty")
        }

        // Extract headers and data
        const headers = jsonData[0].map((header, index) => (header ? String(header).trim() : `Column_${index + 1}`))

        const data = jsonData
          .slice(1)
          .map((row, rowIndex) => {
            const rowData: Record<string, any> = {}
            headers.forEach((header, colIndex) => {
              rowData[header] = row[colIndex] || ""
            })
            rowData._rowIndex = rowIndex + 2 // +2 because we start from row 1 and skip header
            return rowData
          })
          .filter((row) => {
            // Filter out completely empty rows
            return Object.values(row).some((value) => value !== "" && value !== null && value !== undefined)
          })

        onFileUpload({
          name: file.name,
          headers,
          data,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to process file")
      } finally {
        setIsProcessing(false)
      }
    },
    [onFileUpload],
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        processFile(acceptedFiles[0])
      }
    },
    [processFile],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    multiple: false,
    disabled: isProcessing,
  })

  if (fileData) {
    return (
      <Card className="border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans font-semibold text-emerald-900 dark:text-emerald-100 truncate">{fileData.name}</p>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                {fileData.data.length.toLocaleString()} rows • {fileData.headers.length} columns
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DataPreview fileData={fileData} title="Uploaded File" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFileUpload(fileData)}
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300 font-sans"
              >
                Change File
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed cursor-pointer transition-all duration-200 shadow-sm ${
          isDragActive
            ? "border-accent bg-accent/5 shadow-md scale-[1.02]"
            : "border-border hover:border-accent/50 hover:bg-accent/5"
        } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <CardContent className="p-12 text-center">
          <input {...getInputProps()} />
          <div className="space-y-6">
            <div className="flex justify-center">
              {isProcessing ? (
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent"></div>
              ) : (
                <div className="p-4 bg-accent/10 rounded-full">
                  <Upload className="h-12 w-12 text-accent" />
                </div>
              )}
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-sans font-semibold">
                {isProcessing
                  ? "Processing file..."
                  : isDragActive
                    ? "Drop the file here"
                    : "Drag & drop your file here"}
              </h3>
              <p className="text-muted-foreground">Supports Excel (.xlsx, .xls) and CSV files up to 10MB</p>
            </div>
            {!isProcessing && (
              <Button variant="outline" size="lg" className="mt-6 font-sans font-medium bg-transparent">
                <FileSpreadsheet className="h-5 w-5 mr-2" />
                Browse Files
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-900 dark:text-red-100 font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
