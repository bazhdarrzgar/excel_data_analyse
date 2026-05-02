import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FileData, ComparisonConfig } from "@/app/page"
import { useLanguage } from "@/components/language-provider"

interface ColumnSelectorProps {
  file1: FileData
  file2: FileData
  onConfigChange: (config: ComparisonConfig) => void
  currentConfig: ComparisonConfig | null
}

export function ColumnSelector({ file1, file2, onConfigChange, currentConfig }: ColumnSelectorProps) {
  const { t, dir } = useLanguage()
  const [file1Column, setFile1Column] = useState<string>("")
  const [file2Column, setFile2Column] = useState<string>("")
  const [file1AdditionalColumns, setFile1AdditionalColumns] = useState<string[]>([])
  const [file2AdditionalColumns, setFile2AdditionalColumns] = useState<string[]>([])
  const [file1WordCount, setFile1WordCount] = useState<string>("all")
  const [file2WordCount, setFile2WordCount] = useState<string>("all")

  useEffect(() => {
    if (currentConfig) {
      setFile1Column(currentConfig.file1Column)
      setFile2Column(currentConfig.file2Column)
      setFile1AdditionalColumns(currentConfig.additionalColumns.file1)
      setFile2AdditionalColumns(currentConfig.additionalColumns.file2)
      setFile1WordCount(currentConfig.file1WordCount?.toString() || "all")
      setFile2WordCount(currentConfig.file2WordCount?.toString() || "all")
    }
  }, [currentConfig])

  const handleSaveConfig = () => {
    if (file1Column && file2Column) {
      onConfigChange({
        file1Column,
        file2Column,
        file1WordCount: file1WordCount === "all" ? undefined : Number.parseInt(file1WordCount),
        file2WordCount: file2WordCount === "all" ? undefined : Number.parseInt(file2WordCount),
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

  const getMaxWords = (data: any[], column: string) => {
    if (!column) return 0
    let max = 0
    data.forEach((row) => {
      const val = String(row[column] || "").trim()
      if (val) {
        const count = val.split(/\s+/).filter(Boolean).length
        if (count > max) max = count
      }
    })
    return max
  }

  const file1MaxWords = getMaxWords(file1.data, file1Column)
  const file2MaxWords = getMaxWords(file2.data, file2Column)

  return (
    <div className="space-y-8" dir={dir}>
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-6 text-start">
          <CardTitle className="font-sans text-2xl">{t.selectComparisonColumns}</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            {t.comparisonDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="mb-6 p-4 bg-accent/5 border border-accent/20 rounded-lg text-start">
            <p className="text-sm font-medium text-accent-foreground">
              <span className="font-semibold">{t.comparisonDirection}:</span> {t.eachRecordFrom}{" "}
              <span className="font-semibold text-accent">{file1.name}</span> {t.willBeSearched}{" "}
              <span className="font-semibold text-accent">{file2.name}</span> {t.usingIntelligent}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-start">
            <div className="space-y-4">
              <Label htmlFor="file1-column" className="text-base font-sans font-semibold">
                {t.searchColumnFrom} {file1.name} ({t.source})
              </Label>
              <Select value={file1Column} onValueChange={setFile1Column}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder={t.selectColumnPlaceholder} />
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
                {t.matchAgainstColumn} {file2.name} ({t.target})
              </Label>
              <Select value={file2Column} onValueChange={setFile2Column}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder={t.selectColumnPlaceholder} />
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

          {canSave && (
            <div className="grid md:grid-cols-2 gap-8 text-start animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="space-y-4">
                <Label className="text-base font-sans font-semibold">
                  {t.wordCountComparison} ({file1.name})
                </Label>
                <Select value={file1WordCount} onValueChange={setFile1WordCount}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.all} {t.words}</SelectItem>
                    {Array.from({ length: file1MaxWords }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {t.compareFirst} {n} {t.words}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-sans font-semibold">
                  {t.wordCountComparison} ({file2.name})
                </Label>
                <Select value={file2WordCount} onValueChange={setFile2WordCount}>
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.all} {t.words}</SelectItem>
                    {Array.from({ length: file2MaxWords }, (_, i) => i + 1).map((n) => (
                      <SelectItem key={n} value={n.toString()}>
                        {t.compareFirst} {n} {t.words}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSaveConfig}
              disabled={!canSave}
              size="lg"
              className="px-8 py-3 text-base font-sans font-semibold"
            >
              {t.configureComparison}
            </Button>
          </div>
        </CardContent>
      </Card>

      {canSave && (
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-6 text-start">
            <CardTitle className="font-sans text-xl">{t.additionalColumnsOutput}</CardTitle>
            <CardDescription className="text-base">
              {t.additionalColumnsDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8 text-start">
              <div className="space-y-4">
                <Label className="text-base font-sans font-semibold">{t.additionalColumnsFrom} {file1.name}</Label>
                <div className="space-y-3 max-h-64 overflow-y-auto p-4 bg-muted/30 rounded-lg border">
                  {file1.headers
                    .filter((header) => header !== file1Column)
                    .map((header) => (
                      <div key={header} className="flex items-center gap-3">
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
                <Label className="text-base font-sans font-semibold">{t.additionalColumnsFrom} {file2.name}</Label>
                <div className="space-y-3 max-h-64 overflow-y-auto p-4 bg-muted/30 rounded-lg border">
                  {file2.headers
                    .filter((header) => header !== file2Column)
                    .map((header) => (
                      <div key={header} className="flex items-center gap-3">
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
