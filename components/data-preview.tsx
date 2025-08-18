"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Eye, 
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Database
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { FileData } from "@/app/page"

interface DataPreviewProps {
  fileData: FileData
  title: string
}

export function DataPreview({ fileData, title }: DataPreviewProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const rowsPerPage = 5
  const totalPages = Math.ceil(fileData.data.length / rowsPerPage)

  const getCurrentPageData = () => {
    const startIndex = currentPage * rowsPerPage
    const endIndex = startIndex + rowsPerPage
    return fileData.data.slice(startIndex, endIndex)
  }

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Preview Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            {title} - Data Preview
          </DialogTitle>
          <DialogDescription>
            Showing {fileData.data.length.toLocaleString()} rows × {fileData.headers.length} columns from {fileData.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* File Stats */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {fileData.data.length.toLocaleString()} total rows
            </Badge>
            <Badge variant="secondary">
              {fileData.headers.length} columns
            </Badge>
            <Badge variant="outline">
              Page {currentPage + 1} of {totalPages}
            </Badge>
          </div>

          {/* Data Table */}
          <ScrollArea className="h-[400px] w-full border rounded-md">
            <div className="p-4">
              <div className="grid gap-4">
                {/* Headers */}
                <div className="grid gap-2 p-3 bg-muted/50 rounded-lg font-medium text-sm">
                  <div className="grid grid-cols-1 gap-2">
                    {fileData.headers.map((header, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{header}</span>
                        <Badge variant="outline" className="text-xs">
                          Column {index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Data Rows */}
                <div className="space-y-3">
                  {getCurrentPageData().map((row, rowIndex) => (
                    <div key={rowIndex} className="grid gap-2 p-3 border rounded-lg bg-background hover:bg-muted/20 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-xs">
                          Row {currentPage * rowsPerPage + rowIndex + 1}
                        </Badge>
                      </div>
                      
                      <div className="grid gap-2">
                        {fileData.headers.map((header, colIndex) => (
                          <div key={colIndex} className="grid grid-cols-3 gap-2 items-center text-sm">
                            <div className="font-medium text-muted-foreground truncate">
                              {header}:
                            </div>
                            <div className="col-span-2 text-foreground">
                              {row[header] !== undefined && row[header] !== null && row[header] !== '' 
                                ? String(row[header]) 
                                : <span className="text-muted-foreground italic">Empty</span>
                              }
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={prevPage}
                      disabled={currentPage === 0}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Showing {currentPage * rowsPerPage + 1}-{Math.min((currentPage + 1) * rowsPerPage, fileData.data.length)} of {fileData.data.length}
                      </span>
                      {totalPages > 10 && (
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={nextPage}
                      disabled={currentPage === totalPages - 1}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          {/* Column Headers Summary */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Column Headers ({fileData.headers.length})</h4>
            <div className="flex flex-wrap gap-1">
              {fileData.headers.map((header, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {header}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}