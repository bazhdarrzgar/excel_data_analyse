"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Download, 
  FileSpreadsheet, 
  BarChart3,
  CheckCircle2,
  XCircle,
  Users,
  TrendingUp,
  FileText
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

interface ComparisonStatisticsProps {
  file1: FileData
  file2: FileData
  comparisonData: ComparisonData
  config: ComparisonConfig
}

export function ComparisonStatistics({ file1, file2, comparisonData, config }: ComparisonStatisticsProps) {
  const [exportStatus, setExportStatus] = useState<string | null>(null)

  const showStatus = (message: string) => {
    setExportStatus(message)
    setTimeout(() => setExportStatus(null), 3000)
  }

  // Calculate statistics
  const file1Stats = {
    totalRows: file1.data.length,
    matchedRows: comparisonData.matches.length,
    unmatchedRows: comparisonData.file1Only.length,
    matchPercentage: file1.data.length > 0 ? (comparisonData.matches.length / file1.data.length) * 100 : 0
  }

  const file2Stats = {
    totalRows: file2.data.length,
    matchedRows: comparisonData.matches.length, // Same as file1 since matches are pairs
    unmatchedRows: comparisonData.file2Only.length,
    matchPercentage: file2.data.length > 0 ? (comparisonData.matches.length / file2.data.length) * 100 : 0
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

  // Prepare matched rows data for File 1
  const getFile1MatchedData = () => {
    return comparisonData.matches.map((match) => {
      const row: Record<string, any> = {
        [config.file1Column]: match.file1Value,
        [`Matched_With_${config.file2Column}`]: match.file2Value,
        Similarity_Score: Math.round(match.score * 100) + "%",
      }

      // Add all columns from file1
      file1.headers.forEach((header) => {
        if (header !== config.file1Column) {
          row[header] = match.file1Row[header] || ""
        }
      })

      return row
    })
  }

  // Prepare matched rows data for File 2
  const getFile2MatchedData = () => {
    return comparisonData.matches.map((match) => {
      const row: Record<string, any> = {
        [config.file2Column]: match.file2Value,
        [`Matched_With_${config.file1Column}`]: match.file1Value,
        Similarity_Score: Math.round(match.score * 100) + "%",
      }

      // Add all columns from file2
      file2.headers.forEach((header) => {
        if (header !== config.file2Column) {
          row[header] = match.file2Row[header] || ""
        }
      })

      return row
    })
  }

  // Prepare unmatched rows data for File 1
  const getFile1UnmatchedData = () => {
    return comparisonData.file1Only.map((row) => {
      const exportRow: Record<string, any> = {}
      file1.headers.forEach((header) => {
        exportRow[header] = row[header] || ""
      })
      exportRow.Status = "No Match Found"
      return exportRow
    })
  }

  // Prepare unmatched rows data for File 2
  const getFile2UnmatchedData = () => {
    return comparisonData.file2Only.map((row) => {
      const exportRow: Record<string, any> = {}
      file2.headers.forEach((header) => {
        exportRow[header] = row[header] || ""
      })
      exportRow.Status = "Never Matched"
      return exportRow
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-border shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">Comparison Statistics</CardTitle>
                <CardDescription className="text-base">
                  Detailed breakdown of matching results for both files
                </CardDescription>
              </div>
            </div>
            {exportStatus && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {exportStatus}
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Statistics Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* File 1 Statistics */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              {file1.name} Statistics
            </CardTitle>
            <CardDescription>Source file analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Total Rows */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Rows:</span>
              <Badge variant="outline" className="text-lg font-bold">
                {file1Stats.totalRows.toLocaleString()}
              </Badge>
            </div>

            {/* Matched Rows */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Rows with Matches:
                </span>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  {file1Stats.matchedRows.toLocaleString()}
                </Badge>
              </div>
              <Progress value={file1Stats.matchPercentage} className="h-2" />
              <div className="text-xs text-muted-foreground text-right">
                {file1Stats.matchPercentage.toFixed(1)}% match rate
              </div>
            </div>

            {/* Unmatched Rows */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <XCircle className="h-4 w-4 text-orange-600" />
                Rows without Matches:
              </span>
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                {file1Stats.unmatchedRows.toLocaleString()}
              </Badge>
            </div>

            <Separator />

            {/* Download Options for File 1 */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Download Options:</h4>
              <div className="grid gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="justify-start" disabled={file1Stats.matchedRows === 0}>
                      <Download className="h-3 w-3 mr-2" />
                      Matched Rows ({file1Stats.matchedRows})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => downloadAsExcel(getFile1MatchedData(), `${file1.name}_matched_rows.xlsx`, "Matched")}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel Format
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => downloadAsCSV(getFile1MatchedData(), `${file1.name}_matched_rows.csv`)}>
                      <FileText className="h-4 w-4 mr-2" />
                      CSV Format
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="justify-start" disabled={file1Stats.unmatchedRows === 0}>
                      <Download className="h-3 w-3 mr-2" />
                      Unmatched Rows ({file1Stats.unmatchedRows})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => downloadAsExcel(getFile1UnmatchedData(), `${file1.name}_unmatched_rows.xlsx`, "Unmatched")}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel Format
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => downloadAsCSV(getFile1UnmatchedData(), `${file1.name}_unmatched_rows.csv`)}>
                      <FileText className="h-4 w-4 mr-2" />
                      CSV Format
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File 2 Statistics */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-purple-600" />
              {file2.name} Statistics
            </CardTitle>
            <CardDescription>Target file analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Total Rows */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Rows:</span>
              <Badge variant="outline" className="text-lg font-bold">
                {file2Stats.totalRows.toLocaleString()}
              </Badge>
            </div>

            {/* Matched Rows */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Rows with Matches:
                </span>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  {file2Stats.matchedRows.toLocaleString()}
                </Badge>
              </div>
              <Progress value={file2Stats.matchPercentage} className="h-2" />
              <div className="text-xs text-muted-foreground text-right">
                {file2Stats.matchPercentage.toFixed(1)}% match rate
              </div>
            </div>

            {/* Unmatched Rows */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-1">
                <XCircle className="h-4 w-4 text-blue-600" />
                Rows without Matches:
              </span>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {file2Stats.unmatchedRows.toLocaleString()}
              </Badge>
            </div>

            <Separator />

            {/* Download Options for File 2 */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Download Options:</h4>
              <div className="grid gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="justify-start" disabled={file2Stats.matchedRows === 0}>
                      <Download className="h-3 w-3 mr-2" />
                      Matched Rows ({file2Stats.matchedRows})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => downloadAsExcel(getFile2MatchedData(), `${file2.name}_matched_rows.xlsx`, "Matched")}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel Format
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => downloadAsCSV(getFile2MatchedData(), `${file2.name}_matched_rows.csv`)}>
                      <FileText className="h-4 w-4 mr-2" />
                      CSV Format
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="justify-start" disabled={file2Stats.unmatchedRows === 0}>
                      <Download className="h-3 w-3 mr-2" />
                      Unmatched Rows ({file2Stats.unmatchedRows})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => downloadAsExcel(getFile2UnmatchedData(), `${file2.name}_unmatched_rows.xlsx`, "Unmatched")}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Excel Format
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => downloadAsCSV(getFile2UnmatchedData(), `${file2.name}_unmatched_rows.csv`)}>
                      <FileText className="h-4 w-4 mr-2" />
                      CSV Format
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Comparison Summary */}
      <Card className="border-border shadow-sm bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall Comparison Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-emerald-600">{comparisonData.matches.length}</div>
              <div className="text-xs text-muted-foreground">Total Matches</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-orange-600">{file1Stats.unmatchedRows}</div>
              <div className="text-xs text-muted-foreground">{file1.name} Unique</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-blue-600">{file2Stats.unmatchedRows}</div>
              <div className="text-xs text-muted-foreground">{file2.name} Unique</div>
            </div>
            <div className="text-center space-y-1">
              <div className="text-2xl font-bold text-purple-600">
                {((file1Stats.matchPercentage + file2Stats.matchPercentage) / 2).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">Avg Match Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}