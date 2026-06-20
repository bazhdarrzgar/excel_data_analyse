"use client"

import { useState } from "react"
import { FileUpload } from "@/components/file-upload"
import { ColumnSelector } from "@/components/column-selector"
import { ComparisonResults } from "@/components/comparison-results"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"
import { SettingsSwitcher } from "@/components/settings-switcher"

export interface FileData {
  name: string
  headers: string[]
  data: Record<string, any>[]
  originalFile: File
}

export interface ComparisonConfig {
  file1Column: string
  file2Column: string
  file1WordCount?: number
  file2WordCount?: number
  additionalColumns: {
    file1: string[]
    file2: string[]
  }
  searchEngine?: string
}

export default function ExcelComparisonApp() {
  const { t, dir } = useLanguage()
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 transition-colors duration-300">
      <div className="w-full px-4 py-6 space-y-6">
        <div className="flex justify-end pt-2">
          <SettingsSwitcher />
        </div>

        <div className="text-center space-y-4 py-8">
          <h1 className="font-sans font-bold text-4xl lg:text-5xl tracking-tight text-foreground">
            {t.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t.description}
          </p>
        </div>

        <Tabs defaultValue="upload" className="w-full" dir={dir}>
          <TabsList className="grid w-full grid-cols-3 h-12 bg-card border border-border">
            <TabsTrigger value="upload" className="font-sans font-medium">
              {t.uploadFiles}
            </TabsTrigger>
            <TabsTrigger value="configure" disabled={!file1 || !file2} className="font-sans font-medium">
              {t.configureComparison}
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!canCompare} className="font-sans font-medium">
              {t.viewResults}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-8 mt-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="font-sans text-xl">{t.file1}</CardTitle>
                  <CardDescription className="text-base">{t.uploadFirst}</CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileUpload={(data) => handleFileUpload(data, 1)} fileData={file1} />
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <CardTitle className="font-sans text-xl">{t.file2}</CardTitle>
                  <CardDescription className="text-base">{t.uploadSecond}</CardDescription>
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
