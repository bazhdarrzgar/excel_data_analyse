"use client"

import { useState, useCallback } from "react"
import Fuse from "fuse.js"
import * as XLSX from "xlsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Download, Users, UserX, Eye, Play } from "lucide-react"
import type { FileData, ComparisonConfig } from "@/app/page"

interface ComparisonResultsProps {
  file1: FileData
  file2: FileData
  config: ComparisonConfig
  settings?: {
    fuzzyThreshold: number
    caseSensitive: boolean
    ignoreWhitespace: boolean
    maxResults: number
  }
  onDataReady?: (data: ComparisonData) => void
}

interface MatchResult {
  file1Row: Record<string, any>
  file2Row: Record<string, any>
  score: number
  file1Value: string
  file2Value: string
}

interface ComparisonData {
  matches: MatchResult[]
  file1Only: Record<string, any>[]
  file2Only: Record<string, any>[]
}

export function ComparisonResults({ file1, file2, config, settings, onDataReady }: ComparisonResultsProps) {
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [previewMatches, setPreviewMatches] = useState<MatchResult[]>([])
  const [showPreview, setShowPreview] = useState(false)

  const performComparison = useCallback(async () => {
    console.log("[v0] Starting comparison process")
    setIsProcessing(true)
    setProgress(0)
    setCurrentStep("Initializing fuzzy search...")
    setPreviewMatches([])
    setShowPreview(false)

    try {
      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

      await delay(100)
      setProgress(10)
      setCurrentStep("Preparing search data...")

      const file2SearchData = file2.data
        .map((row, index) => ({
          value: String(row[config.file2Column] || "").trim(),
          originalRow: row,
          index,
        }))
        .filter((item) => item.value !== "")

      console.log("[v0] Prepared search data:", file2SearchData.length, "items")

      await delay(100)
      setProgress(20)
      setCurrentStep("Setting up Fuse.js fuzzy matcher...")

      const fuse = new Fuse(file2SearchData, {
        keys: ["value"],
        includeScore: true,
        threshold: 1.0, // Allow all matches, we'll always return the best one
        ignoreLocation: true,
        findAllMatches: false, // Only return the best match
      })

      await delay(100)
      setProgress(30)
      setCurrentStep(`Processing ${file1.data.length} records...`)

      const matches: MatchResult[] = []
      const file1Only: Record<string, any>[] = []
      const file2Only: Record<string, any>[] = []
      const usedFile2Indices = new Set<number>()
      const previewResults: MatchResult[] = []

      const totalRows = file1.data.length
      let processedRows = 0

      console.log("[v0] Starting to process", totalRows, "rows")

      for (let i = 0; i < file1.data.length; i++) {
        const file1Row = file1.data[i]
        const file1Value = String(file1Row[config.file1Column] || "").trim()

        if (file1Value === "") {
          file1Only.push(file1Row)
          processedRows++
          continue
        }

        const searchResults = fuse.search(file1Value)

        if (searchResults.length > 0) {
          const bestMatch = searchResults[0]
          const file2Row = bestMatch.item.originalRow

          const matchResult = {
            file1Row,
            file2Row,
            score: 1 - (bestMatch.score || 0),
            file1Value,
            file2Value: bestMatch.item.value,
          }

          matches.push(matchResult)

          // Add to preview if we have less than 5 items
          if (previewResults.length < 5) {
            previewResults.push(matchResult)
          }

          usedFile2Indices.add(bestMatch.item.index)
        } else {
          file1Only.push(file1Row)
        }

        processedRows++

        // Update progress and preview every 10 items or at the end
        if (processedRows % 10 === 0 || processedRows === totalRows) {
          const progressPercent = 30 + (processedRows / totalRows) * 60
          setProgress(progressPercent)
          setCurrentStep(`Processed ${processedRows}/${totalRows} records...`)

          // Show preview after processing first 10 items
          if (processedRows >= 10 && previewResults.length > 0) {
            setPreviewMatches(previewResults)
            setShowPreview(true)
          }

          // Yield control to prevent freezing
          await delay(10)
        }
      }

      console.log("[v0] Finished processing. Found", matches.length, "matches")

      await delay(100)
      setProgress(95)
      setCurrentStep("Finalizing results...")

      file2.data.forEach((row, index) => {
        if (!usedFile2Indices.has(index)) {
          file2Only.push(row)
        }
      })

      await delay(200)
      setProgress(100)
      setCurrentStep("Complete!")

      setComparisonData({
        matches,
        file1Only,
        file2Only,
      })

      console.log("[v0] Comparison complete")

      await delay(500)
      setIsProcessing(false)
      setShowPreview(false)
    } catch (error) {
      console.error("[v0] Error during comparison:", error)
      setIsProcessing(false)
      setCurrentStep("Error occurred during processing")
    }
  }, [file1.data, file2.data, config.file1Column, config.file2Column])

  const downloadExcel = (data: any[], filename: string, sheetName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.writeFile(workbook, filename)
  }

  const downloadMatches = () => {
    if (!comparisonData) return

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

    downloadExcel(exportData, "matched_data.xlsx", "Matches")
  }

  const downloadFile1Only = () => {
    if (!comparisonData) return

    const exportData = comparisonData.file1Only.map((row) => {
      const exportRow: Record<string, any> = {
        [config.file1Column]: row[config.file1Column] || "",
      }

      config.additionalColumns.file1.forEach((col) => {
        exportRow[col] = row[col] || ""
      })

      return exportRow
    })

    downloadExcel(exportData, "file1_only_data.xlsx", "File1 Only")
  }

  const downloadFile2Only = () => {
    if (!comparisonData) return

    const exportData = comparisonData.file2Only.map((row) => {
      const exportRow: Record<string, any> = {
        [config.file2Column]: row[config.file2Column] || "",
      }

      config.additionalColumns.file2.forEach((col) => {
        exportRow[col] = row[col] || ""
      })

      return exportRow
    })

    downloadExcel(exportData, "file2_only_data.xlsx", "File2 Only")
  }

  if (!comparisonData && !isProcessing) {
    return (
      <Card className="border-border shadow-sm">
        <CardContent className="p-12 text-center">
          <div className="space-y-6">
            <div className="mx-auto w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
              <Play className="h-10 w-10 text-accent" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-sans font-bold">Ready to Compare</h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                Click the button below to start the fuzzy matching comparison between your files.
              </p>
            </div>
            <Button onClick={performComparison} size="lg" className="px-8 py-3 text-base font-sans font-semibold">
              <Play className="h-5 w-5 mr-2" />
              Start Comparison
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isProcessing) {
    return (
      <div className="space-y-8">
        <Card className="border-border shadow-sm">
          <CardContent className="p-12">
            <div className="text-center space-y-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto"></div>
              <div className="space-y-3">
                <h3 className="text-xl font-sans font-bold">Processing comparison...</h3>
                <p className="text-muted-foreground">{currentStep}</p>
              </div>
              <div className="w-full max-w-md mx-auto space-y-3">
                <Progress value={progress} className="w-full h-3" />
                <p className="text-sm text-muted-foreground font-medium">{Math.round(progress)}% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {showPreview && previewMatches.length > 0 && (
          <Card className="border-accent/20 bg-accent/5 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-full">
                  <Eye className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg font-sans">Fuzzy Match Preview</CardTitle>
                  <CardDescription>Here's a sample of what Fuse.js is finding while processing...</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {previewMatches.map((match, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-background/50 shadow-sm">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2 flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{match.file1Value}</p>
                        <p className="text-xs text-muted-foreground truncate">↔ {match.file2Value}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs font-medium">
                        {Math.round(match.score * 100)}% match
                      </Badge>
                    </div>
                  </div>
                ))}
                <p className="text-xs text-center text-muted-foreground font-medium pt-2">
                  Processing continues in background...
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  if (!comparisonData) return null

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <p className="text-3xl font-sans font-bold">{comparisonData.matches.length.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground font-medium">Matches Found</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <UserX className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <p className="text-3xl font-sans font-bold">{comparisonData.file1Only.length.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground font-medium">
                  From {file1.name} - Not Found in {file2.name}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <UserX className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-sans font-bold">{comparisonData.file2Only.length.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground font-medium">From {file2.name} - Never Matched</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="matches" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-12 bg-card border border-border">
          <TabsTrigger value="matches" className="font-sans font-medium">
            Matches ({comparisonData.matches.length.toLocaleString()})
          </TabsTrigger>
          <TabsTrigger value="file1-only" className="font-sans font-medium">
            {file1.name} Not Found ({comparisonData.file1Only.length.toLocaleString()})
          </TabsTrigger>
          <TabsTrigger value="file2-only" className="font-sans font-medium">
            {file2.name} Unused ({comparisonData.file2Only.length.toLocaleString()})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matches" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Matched Records</CardTitle>
                  <CardDescription>Records found in both files using fuzzy matching</CardDescription>
                </div>
                <Button onClick={downloadMatches} disabled={comparisonData.matches.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Matches
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {comparisonData.matches.map((match, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-medium">{match.file1Value}</p>
                        <p className="text-sm text-muted-foreground">↔ {match.file2Value}</p>
                      </div>
                      <Badge variant="secondary">{Math.round(match.score * 100)}% match</Badge>
                    </div>
                    {(config.additionalColumns.file1.length > 0 || config.additionalColumns.file2.length > 0) && (
                      <div className="text-xs text-muted-foreground space-y-1">
                        {config.additionalColumns.file1.map((col) => (
                          <div key={col}>
                            <span className="font-medium">{col}:</span> {match.file1Row[col] || "N/A"}
                          </div>
                        ))}
                        {config.additionalColumns.file2.map((col) => (
                          <div key={col}>
                            <span className="font-medium">{col}:</span> {match.file2Row[col] || "N/A"}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {comparisonData.matches.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No matches found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="file1-only" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>
                    Records from {file1.name} Not Found in {file2.name}
                  </CardTitle>
                  <CardDescription>
                    These records from your source file ({file1.name}) had no fuzzy matches in the target file (
                    {file2.name})
                  </CardDescription>
                </div>
                <Button onClick={downloadFile1Only} disabled={comparisonData.file1Only.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Unmatched from {file1.name}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {comparisonData.file1Only.map((row, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <p className="font-medium">{row[config.file1Column] || "N/A"}</p>
                    {config.additionalColumns.file1.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1 space-y-1">
                        {config.additionalColumns.file1.map((col) => (
                          <div key={col}>
                            <span className="font-medium">{col}:</span> {row[col] || "N/A"}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {comparisonData.file1Only.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No unique records found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="file2-only" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Unused Records from {file2.name}</CardTitle>
                  <CardDescription>
                    These records from your target file ({file2.name}) were never matched against any source records
                  </CardDescription>
                </div>
                <Button onClick={downloadFile2Only} disabled={comparisonData.file2Only.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Unused from {file2.name}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {comparisonData.file2Only.map((row, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <p className="font-medium">{row[config.file2Column] || "N/A"}</p>
                    {config.additionalColumns.file2.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1 space-y-1">
                        {config.additionalColumns.file2.map((col) => (
                          <div key={col}>
                            <span className="font-medium">{col}:</span> {row[col] || "N/A"}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {comparisonData.file2Only.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No unique records found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
