"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Search, Calendar } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getUserTestResults } from "@/lib/statistics-engine"

export function TestHistory() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [languageFilter, setLanguageFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const allResults = useMemo(() => {
    return getUserTestResults(user?.id)
  }, [user?.id])

  const filteredAndSortedResults = useMemo(() => {
    let filtered = allResults

    // Apply filters
    if (languageFilter !== "all") {
      filtered = filtered.filter((result) => result.language === languageFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((result) => result.testType === typeFilter)
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(
        (result) =>
          result.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
          result.testType.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortBy) {
        case "date":
          aValue = new Date(a.completedAt).getTime()
          bValue = new Date(b.completedAt).getTime()
          break
        case "wpm":
          aValue = a.wpm
          bValue = b.wpm
          break
        case "accuracy":
          aValue = a.accuracy
          bValue = b.accuracy
          break
        case "errors":
          aValue = a.errors
          bValue = b.errors
          break
        default:
          aValue = new Date(a.completedAt).getTime()
          bValue = new Date(b.completedAt).getTime()
      }

      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    })

    return filtered
  }, [allResults, searchTerm, languageFilter, typeFilter, sortBy, sortOrder])

  const exportResults = () => {
    const csvContent = [
      ["Date", "WPM", "Accuracy", "Errors", "Type", "Language", "Duration"].join(","),
      ...filteredAndSortedResults.map((result) =>
        [
          new Date(result.completedAt).toLocaleDateString(),
          result.wpm,
          result.accuracy,
          result.errors,
          result.testType,
          result.language,
          Math.round(result.timeElapsed),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `typing-test-results-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const uniqueLanguages = [...new Set(allResults.map((r) => r.language))]
  const uniqueTypes = [...new Set(allResults.map((r) => r.testType))]

  if (allResults.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Test History</h3>
            <p className="text-muted-foreground">Your completed typing tests will appear here.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Test History ({filteredAndSortedResults.length} results)
            </span>
            <Button onClick={exportResults} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {uniqueLanguages.map((lang) => (
                  <SelectItem key={lang} value={lang} className="capitalize">
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type}-based
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="wpm">WPM</SelectItem>
                <SelectItem value="accuracy">Accuracy</SelectItem>
                <SelectItem value="errors">Errors</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>WPM</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Errors</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(result.completedAt).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">{new Date(result.completedAt).toLocaleTimeString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={result.wpm >= 60 ? "default" : result.wpm >= 40 ? "secondary" : "outline"}>
                        {result.wpm} WPM
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={result.accuracy >= 95 ? "default" : result.accuracy >= 90 ? "secondary" : "outline"}
                      >
                        {result.accuracy}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={result.errors === 0 ? "text-green-500" : result.errors > 5 ? "text-red-500" : ""}
                      >
                        {result.errors}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {result.testType} ({result.testValue})
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {result.language}
                      </Badge>
                    </TableCell>
                    <TableCell>{Math.round(result.timeElapsed)}s</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
