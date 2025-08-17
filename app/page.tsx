"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { ColumnSelector } from "@/components/column-selector"
import { ComparisonResults } from "@/components/comparison-results"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface FileData {
  name: string
  headers: string[]
  data: Record<string, any>[]
}

export interface ComparisonConfig {
  file1Column: string
  file2Column: string
  additionalColumns: {
    file1: string[]
    file2: string[]
  }
}

export default function ExcelComparisonApp() {
  const [file1, setFile1] = useState<FileData | null>(null)
  const [file2, setFile2] = useState<FileData | null>(null)
  const [comparisonConfig, setComparisonConfig] = useState<ComparisonConfig | null>(null)

  const handleFileUpload = (fileData: FileData, fileNumber: 1 | 2) => {
    if (fileNumber === 1) {
      setFile1(fileData)
    } else {
      setFile2(fileData)
    }
    // Reset comparison config when files change
    setComparisonConfig(null)
  }

  const canCompare = file1 && file2 && comparisonConfig

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4 py-8">
          <h1 className="font-sans font-bold text-4xl lg:text-5xl tracking-tight text-foreground">
            Excel File Comparison Tool
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload two Excel files and compare data with intelligent fuzzy matching. Perfect for business users who need
            reliable data analysis.
          </p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-12 bg-card border border-border">
            <TabsTrigger value="upload" className="font-sans font-medium">
              Upload Files
            </TabsTrigger>
            <TabsTrigger value="configure" disabled={!file1 || !file2} className="font-sans font-medium">
              Configure Comparison
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!canCompare} className="font-sans font-medium">
              View Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-8 mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="font-sans text-xl">File 1</CardTitle>
                  <CardDescription className="text-base">Upload your first Excel or CSV file</CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileUpload={(data) => handleFileUpload(data, 1)} fileData={file1} />
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="font-sans text-xl">File 2</CardTitle>
                  <CardDescription className="text-base">Upload your second Excel or CSV file</CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileUpload={(data) => handleFileUpload(data, 2)} fileData={file2} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="configure" className="space-y-6">
            {file1 && file2 && (
              <ColumnSelector
                file1={file1}
                file2={file2}
                onConfigChange={setComparisonConfig}
                currentConfig={comparisonConfig}
              />
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {canCompare && <ComparisonResults file1={file1} file2={file2} config={comparisonConfig} />}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
