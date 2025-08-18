"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Database,
  CheckCircle2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { FileData, ComparisonConfig } from "@/app/page"

interface ComparisonData {
  matches: any[]
  file1Only: any[]
  file2Only: any[]
}

interface ExportOptionsProps {
  comparisonData: ComparisonData
  config: ComparisonConfig
  file1: FileData
  file2: FileData
}

export function ExportOptions({ comparisonData, config, file1, file2 }: ExportOptionsProps) {
  const [exportStatus, setExportStatus] = useState<string | null>(null)

  const showStatus = (message: string) => {
    setExportStatus(message)
    setTimeout(() => setExportStatus(null), 3000)
  }

  const downloadAsExcel = (data: any[], filename: string, sheetName: string) => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
      XLSX.writeFile(workbook, filename)
      showStatus(`Downloaded ${filename}`)
    } catch (error) {
      showStatus("Export failed")
    }
  }

  const downloadAsCSV = (data: any[], filename: string) => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data)
      const csv = XLSX.utils.sheet_to_csv(worksheet)
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      window.URL.revokeObjectURL(url)
      showStatus(`Downloaded ${filename}`)
    } catch (error) {
      showStatus("Export failed")
    }
  }

  const exportMatchesData = () => {
    const exportData = comparisonData.matches.map((match) => {
      const row: Record<string, any> = {
        [`${config.file1Column}_File1`]: match.file1Value,
        [`${config.file2Column}_File2`]: match.file2Value,
        Similarity_Score: Math.round(match.score * 100) + "%",
      }

      config.additionalColumns.file1.forEach((col) => {
        row[`${col}_File1`] = match.file1Row[col] || ""
      })

      config.additionalColumns.file2.forEach((col) => {
        row[`${col}_File2`] = match.file2Row[col] || ""
      })

      return row
    })
    return exportData
  }

  const exportFile1OnlyData = () => {
    return comparisonData.file1Only.map((row) => {
      const exportRow: Record<string, any> = {
        [config.file1Column]: row[config.file1Column] || "",
      }

      config.additionalColumns.file1.forEach((col) => {
        exportRow[col] = row[col] || ""
      })

      return exportRow
    })
  }

  const exportFile2OnlyData = () => {
    return comparisonData.file2Only.map((row) => {
      const exportRow: Record<string, any> = {
        [config.file2Column]: row[config.file2Column] || "",
      }

      config.additionalColumns.file2.forEach((col) => {
        exportRow[col] = row[col] || ""
      })

      return exportRow
    })
  }

  const downloadAllInOne = () => {
    try {
      const matchesData = exportMatchesData()
      const file1OnlyData = exportFile1OnlyData()  
      const file2OnlyData = exportFile2OnlyData()

      const workbook = XLSX.utils.book_new()
      
      // Add matches sheet
      const matchesSheet = XLSX.utils.json_to_sheet(matchesData)
      XLSX.utils.book_append_sheet(workbook, matchesSheet, "Matches")
      
      // Add file1 only sheet
      const file1Sheet = XLSX.utils.json_to_sheet(file1OnlyData)
      XLSX.utils.book_append_sheet(workbook, file1Sheet, `${file1.name}_Only`)
      
      // Add file2 only sheet
      const file2Sheet = XLSX.utils.json_to_sheet(file2OnlyData)
      XLSX.utils.book_append_sheet(workbook, file2Sheet, `${file2.name}_Only`)

      XLSX.writeFile(workbook, "complete_comparison_results.xlsx")
      showStatus("Downloaded complete results")
    } catch (error) {
      showStatus("Export failed")
    }
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Results
            </CardTitle>
            <CardDescription>
              Download your comparison results in various formats
            </CardDescription>
          </div>
          {exportStatus && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {exportStatus}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={downloadAllInOne} className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Download Complete Results
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Matches ({comparisonData.matches.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => downloadAsExcel(exportMatchesData(), "matches.xlsx", "Matches")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Excel Format
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadAsCSV(exportMatchesData(), "matches.csv")}>
                  <FileText className="h-4 w-4 mr-2" />
                  CSV Format
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  {file1.name} Only ({comparisonData.file1Only.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => downloadAsExcel(exportFile1OnlyData(), `${file1.name}_only.xlsx`, "File1_Only")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Excel Format
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadAsCSV(exportFile1OnlyData(), `${file1.name}_only.csv`)}>
                  <FileText className="h-4 w-4 mr-2" />
                  CSV Format
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  {file2.name} Only ({comparisonData.file2Only.length})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => downloadAsExcel(exportFile2OnlyData(), `${file2.name}_only.xlsx`, "File2_Only")}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Excel Format
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadAsCSV(exportFile2OnlyData(), `${file2.name}_only.csv`)}>
                  <FileText className="h-4 w-4 mr-2" />
                  CSV Format
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Separator />

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-emerald-600">{comparisonData.matches.length}</p>
              <p className="text-xs text-muted-foreground">Matches</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-orange-600">{comparisonData.file1Only.length}</p>
              <p className="text-xs text-muted-foreground">File 1 Only</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-blue-600">{comparisonData.file2Only.length}</p>
              <p className="text-xs text-muted-foreground">File 2 Only</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}