"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  History, 
  FileSpreadsheet, 
  Clock,
  X,
  RotateCcw
} from "lucide-react"
import type { FileData } from "@/app/page"

interface FileHistoryItem {
  id: string
  name: string
  uploadDate: Date
  rowCount: number
  columnCount: number
  headers: string[]
}

interface FileHistoryProps {
  onFileReuse: (fileData: FileData) => void
  currentFiles: (FileData | null)[]
}

export function FileHistory({ onFileReuse, currentFiles }: FileHistoryProps) {
  const [history, setHistory] = useState<FileHistoryItem[]>([])

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('excel-comparison-history')
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          uploadDate: new Date(item.uploadDate)
        }))
        setHistory(parsed)
      } catch (error) {
        console.error('Failed to load file history:', error)
      }
    }
  }, [])

  // Add new file to history when files change
  useEffect(() => {
    currentFiles.forEach(file => {
      if (file) {
        addToHistory(file)
      }
    })
  }, [currentFiles])

  const addToHistory = (fileData: FileData) => {
    const historyItem: FileHistoryItem = {
      id: `${fileData.name}-${Date.now()}`,
      name: fileData.name,
      uploadDate: new Date(),
      rowCount: fileData.data.length,
      columnCount: fileData.headers.length,
      headers: fileData.headers
    }

    setHistory(prevHistory => {
      // Check if file already exists in recent history (last 5 items)
      const recentFiles = prevHistory.slice(0, 5)
      const exists = recentFiles.some(item => 
        item.name === fileData.name && 
        item.columnCount === fileData.headers.length
      )

      if (!exists) {
        const newHistory = [historyItem, ...prevHistory.slice(0, 9)] // Keep last 10 items
        
        // Save to localStorage
        try {
          localStorage.setItem('excel-comparison-history', JSON.stringify(newHistory))
        } catch (error) {
          console.error('Failed to save file history:', error)
        }

        return newHistory
      }
      return prevHistory
    })
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('excel-comparison-history')
  }

  const removeFromHistory = (id: string) => {
    const newHistory = history.filter(item => item.id !== id)
    setHistory(newHistory)
    localStorage.setItem('excel-comparison-history', JSON.stringify(newHistory))
  }

  if (history.length === 0) {
    return null
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            <div>
              <CardTitle className="text-lg">Recent Files</CardTitle>
              <CardDescription>
                Quickly reuse previously uploaded files
              </CardDescription>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearHistory}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.slice(0, 5).map((item, index) => (
            <div key={item.id}>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <FileSpreadsheet className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {item.rowCount.toLocaleString()} rows
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {item.columnCount} cols
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.uploadDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Reconstruct FileData object (note: we don't store actual data for privacy)
                      const fileData: FileData = {
                        name: item.name,
                        headers: item.headers,
                        data: [] // We can't reuse actual data for security reasons
                      }
                      // For demo, we'll show a message that they need to re-upload
                      alert(`Please re-upload "${item.name}" to use this file. We don't store your actual data for privacy reasons.`)
                    }}
                    className="text-xs"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Reuse
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromHistory(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              {index < history.slice(0, 5).length - 1 && (
                <Separator className="mt-3" />
              )}
            </div>
          ))}
          
          {history.length > 5 && (
            <div className="text-center pt-2">
              <Badge variant="outline" className="text-xs">
                +{history.length - 5} more files in history
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}