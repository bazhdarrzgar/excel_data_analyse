"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { ColumnSelector } from "@/components/column-selector"
import { ComparisonResults } from "@/components/comparison-results"
import { ExportOptions } from "@/components/export-options"
import { ComparisonSettings, type ComparisonSettings as ComparisonSettingsType } from "@/components/comparison-settings"
import { ThemeToggle } from "@/components/theme-toggle"
import { FileHistory } from "@/components/file-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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
  const [comparisonSettings, setComparisonSettings] = useState<ComparisonSettingsType>({
    fuzzyThreshold: 0.6,
    caseSensitive: false,
    ignoreWhitespace: true,
    maxResults: 1
  })
  const [comparisonData, setComparisonData] = useState<any>(null)

  const handleFileUpload = (fileData: FileData, fileNumber: 1 | 2) => {
    if (fileNumber === 1) {
      setFile1(fileData)
    } else {
      setFile2(fileData)
    }
    // Reset comparison config when files change
    setComparisonConfig(null)
    setComparisonData(null)
  }

  const canConfigure = file1 && file2
  const canCompare = file1 && file2 && comparisonConfig

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="font-sans font-bold text-2xl tracking-tight text-foreground">
              Excel Comparison Tool
            </h1>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              v2.0
            </Badge>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4 py-8">
          <h2 className="font-sans font-bold text-4xl lg:text-5xl tracking-tight text-foreground">
            Intelligent File Comparison
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload two Excel or CSV files and compare data with advanced fuzzy matching algorithms. 
            Perfect for data analysis, deduplication, and business intelligence.
          </p>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-12 bg-card border border-border">
            <TabsTrigger value="upload" className="font-sans font-medium">
              Upload Files
            </TabsTrigger>
            <TabsTrigger value="configure" disabled={!canConfigure} className="font-sans font-medium">
              Configure Comparison
            </TabsTrigger>
            <TabsTrigger value="settings" disabled={!canConfigure} className="font-sans font-medium">
              Advanced Settings
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!canCompare} className="font-sans font-medium">
              View Results
            </TabsTrigger>
            <TabsTrigger value="export" disabled={!comparisonData} className="font-sans font-medium">
              Export Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-8 mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="font-sans text-xl flex items-center justify-between">
                    File 1 - Source
                    {file1 && <Badge variant="secondary" className="text-xs">Ready</Badge>}
                  </CardTitle>
                  <CardDescription className="text-base">Upload your primary Excel or CSV file</CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileUpload={(data) => handleFileUpload(data, 1)} fileData={file1} />
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="font-sans text-xl flex items-center justify-between">
                    File 2 - Target
                    {file2 && <Badge variant="secondary" className="text-xs">Ready</Badge>}
                  </CardTitle>
                  <CardDescription className="text-base">Upload your comparison Excel or CSV file</CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileUpload={(data) => handleFileUpload(data, 2)} fileData={file2} />
                </CardContent>
              </Card>
            </div>

            {canConfigure && (
              <Card className="bg-accent/5 border-accent/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center space-x-4">
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                      Files Ready
                    </Badge>
                    <Separator orientation="vertical" className="h-6" />
                    <p className="text-sm text-muted-foreground">
                      Both files uploaded successfully. Proceed to configure comparison settings.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
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

          <TabsContent value="settings" className="space-y-6">
            <ComparisonSettings 
              onSettingsChange={setComparisonSettings}
              defaultSettings={comparisonSettings}
            />
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {canCompare && (
              <ComparisonResults 
                file1={file1} 
                file2={file2} 
                config={comparisonConfig}
                settings={comparisonSettings}
                onDataReady={setComparisonData}
              />
            )}
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            {comparisonData && file1 && file2 && comparisonConfig && (
              <ExportOptions
                comparisonData={comparisonData}
                config={comparisonConfig}
                file1={file1}
                file2={file2}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}