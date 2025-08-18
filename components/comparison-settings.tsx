"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Settings, Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ComparisonSettingsProps {
  onSettingsChange: (settings: ComparisonSettings) => void
  defaultSettings?: ComparisonSettings
}

export interface ComparisonSettings {
  fuzzyThreshold: number
  caseSensitive: boolean
  ignoreWhitespace: boolean
  maxResults: number
}

export function ComparisonSettings({ onSettingsChange, defaultSettings }: ComparisonSettingsProps) {
  const [settings, setSettings] = useState<ComparisonSettings>(defaultSettings || {
    fuzzyThreshold: 0.6,
    caseSensitive: false,
    ignoreWhitespace: true,
    maxResults: 1
  })

  const updateSetting = <K extends keyof ComparisonSettings>(
    key: K,
    value: ComparisonSettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    onSettingsChange(newSettings)
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Advanced Comparison Settings
        </CardTitle>
        <CardDescription>
          Fine-tune the fuzzy matching algorithm for better results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fuzzy Threshold */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Similarity Threshold</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Controls how strict the matching is. Higher values require closer matches.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-2">
            <Slider
              value={[settings.fuzzyThreshold]}
              onValueChange={([value]) => updateSetting('fuzzyThreshold', value)}
              max={1}
              min={0.1}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>More matches (0.1)</span>
              <Badge variant="outline" className="text-xs">
                {Math.round(settings.fuzzyThreshold * 100)}% similarity required
              </Badge>
              <span>Exact matches (1.0)</span>
            </div>
          </div>
        </div>

        {/* Case Sensitivity */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium">Case Sensitive Matching</Label>
            <p className="text-xs text-muted-foreground">
              When enabled, "Apple" and "apple" are treated as different
            </p>
          </div>
          <Switch
            checked={settings.caseSensitive}
            onCheckedChange={(checked) => updateSetting('caseSensitive', checked)}
          />
        </div>

        {/* Ignore Whitespace */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm font-medium">Ignore Extra Whitespace</Label>
            <p className="text-xs text-muted-foreground">
              Treats "John Smith" and " John  Smith " as the same
            </p>
          </div>
          <Switch
            checked={settings.ignoreWhitespace}
            onCheckedChange={(checked) => updateSetting('ignoreWhitespace', checked)}
          />
        </div>

        {/* Max Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Maximum Matches Per Record</Label>
            <Badge variant="secondary">{settings.maxResults}</Badge>
          </div>
          <Slider
            value={[settings.maxResults]}
            onValueChange={([value]) => updateSetting('maxResults', value)}
            max={5}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Best match only</span>
            <span>Show multiple matches</span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Quick Presets</Label>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const preset = { fuzzyThreshold: 0.9, caseSensitive: false, ignoreWhitespace: true, maxResults: 1 }
                setSettings(preset)
                onSettingsChange(preset)
              }}
            >
              Exact Match
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const preset = { fuzzyThreshold: 0.6, caseSensitive: false, ignoreWhitespace: true, maxResults: 1 }
                setSettings(preset)
                onSettingsChange(preset)
              }}
            >
              Balanced
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const preset = { fuzzyThreshold: 0.3, caseSensitive: false, ignoreWhitespace: true, maxResults: 3 }
                setSettings(preset)
                onSettingsChange(preset)
              }}
            >
              Fuzzy Search
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}