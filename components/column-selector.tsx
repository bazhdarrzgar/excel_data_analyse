"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FileData, ComparisonConfig } from "@/app/page"

interface ColumnSelectorProps {
  file1: FileData
  file2: FileData
  onConfigChange: (config: ComparisonConfig) => void
  currentConfig: ComparisonConfig | null
}

export function ColumnSelector({ file1, file2, onConfigChange, currentConfig }: ColumnSelectorProps) {
  const [file1Column, setFile1Column] = useState<string>("")
  const [file2Column, setFile2Column] = useState<string>("")
  const [file1AdditionalColumns, setFile1AdditionalColumns] = useState<string[]>([])
  const [file2AdditionalColumns, setFile2AdditionalColumns] = useState<string[]>([])

  useEffect(() => {
    if (currentConfig) {
      setFile1Column(currentConfig.file1Column)
      setFile2Column(currentConfig.file2Column)
      setFile1AdditionalColumns(currentConfig.additionalColumns.file1)
      setFile2AdditionalColumns(currentConfig.additionalColumns.file2)
    }
  }, [currentConfig])

  const handleSaveConfig = () => {
    if (file1Column && file2Column) {
      onConfigChange({
        file1Column,
        file2Column,
        additionalColumns: {
          file1: file1AdditionalColumns,
          file2: file2AdditionalColumns,
        },
      })
    }
  }

  const toggleAdditionalColumn = (column: string, fileNumber: 1 | 2) => {
    if (fileNumber === 1) {
      setFile1AdditionalColumns((prev) =>
        prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column],
      )
    } else {
      setFile2AdditionalColumns((prev) =>
        prev.includes(column) ? prev.filter((c) => c !== column) : [...prev, column],
      )
    }
  }

  const canSave = file1Column && file2Column

  return (
    <div className="space-y-8">
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-6">
          <CardTitle className="font-sans text-2xl">Select Comparison Columns</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Choose which columns to compare between the two files. The comparison will use fuzzy matching to find
            similar data with intelligent scoring.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="mb-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
            <p className="text-sm font-medium text-accent-foreground">
              <span className="font-semibold">Comparison Direction:</span> Each record from{" "}
              <span className="font-semibold text-accent">{file1.name}</span> will be searched for matches in{" "}
              <span className="font-semibold text-accent">{file2.name}</span> using intelligent fuzzy matching.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Label htmlFor="file1-column" className="text-base font-sans font-semibold">
                Search Column from {file1.name} (Source)
              </Label>
              <Select value={file1Column} onValueChange={setFile1Column}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select column to compare" />
                </SelectTrigger>
                <SelectContent>
                  {file1.headers.map((header) => (
                    <SelectItem key={header} value={header} className="text-base">
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label htmlFor="file2-column" className="text-base font-sans font-semibold">
                Match Against Column from {file2.name} (Target)
              </Label>
              <Select value={file2Column} onValueChange={setFile2Column}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select column to compare" />
                </SelectTrigger>
                <SelectContent>
                  {file2.headers.map((header) => (
                    <SelectItem key={header} value={header} className="text-base">
                      {header}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSaveConfig}
              disabled={!canSave}
              size="lg"
              className="px-8 py-3 text-base font-sans font-semibold"
            >
              Configure Comparison
            </Button>
          </div>
        </CardContent>
      </Card>

      {canSave && (
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-6">
            <CardTitle className="font-sans text-xl">Additional Columns for Output</CardTitle>
            <CardDescription className="text-base">
              Select additional columns to include in the comparison results and download files.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-base font-sans font-semibold">Additional columns from {file1.name}</Label>
                <div className="space-y-3 max-h-64 overflow-y-auto p-4 bg-muted/30 rounded-lg border">
                  {file1.headers
                    .filter((header) => header !== file1Column)
                    .map((header) => (
                      <div key={header} className="flex items-center space-x-3">
                        <Checkbox
                          id={`file1-${header}`}
                          checked={file1AdditionalColumns.includes(header)}
                          onCheckedChange={() => toggleAdditionalColumn(header, 1)}
                        />
                        <Label htmlFor={`file1-${header}`} className="text-sm font-normal cursor-pointer flex-1">
                          {header}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-sans font-semibold">Additional columns from {file2.name}</Label>
                <div className="space-y-3 max-h-64 overflow-y-auto p-4 bg-muted/30 rounded-lg border">
                  {file2.headers
                    .filter((header) => header !== file2Column)
                    .map((header) => (
                      <div key={header} className="flex items-center space-x-3">
                        <Checkbox
                          id={`file2-${header}`}
                          checked={file2AdditionalColumns.includes(header)}
                          onCheckedChange={() => toggleAdditionalColumn(header, 2)}
                        />
                        <Label htmlFor={`file2-${header}`} className="text-sm font-normal cursor-pointer flex-1">
                          {header}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
