"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnalysisResultView } from "@/components/analysis/analysis-result-view";
import type { AnalysisResult, AnalysisMode, WorkType, Student } from "@/lib/types";
import { Upload, FileText, Loader2, CheckCircle, X, File } from "lucide-react";

type AnalysisStep = "input" | "analyzing" | "complete";

export default function AnalyzePage() {
  const [step, setStep] = useState<AnalysisStep>("input");
  const [text, setText] = useState("");
  const [studentId, setStudentId] = useState("");
  const [workTitle, setWorkTitle] = useState("");
  const [workType, setWorkType] = useState<WorkType>("essay");
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("highschool");
  const [mentalMonitoringEnabled, setMentalMonitoringEnabled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number } | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load students from API
  useEffect(() => {
    fetch("/api/students")
      .then((r) => r.json())
      .then(setStudents)
      .catch(() => {});
  }, []);

  // Handle file reading
  const handleFileRead = useCallback((file: globalThis.File) => {
    setUploadedFile({ name: file.name, size: file.size });

    if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    } else if (file.type === "text/csv" || file.name.endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    } else {
      // For PDF, DOCX, images: show file info, text extraction coming later
      setText(`[File uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]\n\nAutomatic text extraction for ${file.type || "this file type"} is coming soon.\nFor now, please paste the text content below.`);
    }
  }, []);

  // Drag & drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileRead(file);
  }, [handleFileRead]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileRead(file);
  }, [handleFileRead]);

  const clearFile = useCallback(() => {
    setUploadedFile(null);
    setText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const canAnalyze = text.trim().length >= 20 && studentId && workTitle.trim();

  async function handleAnalyze() {
    if (!canAnalyze) return;
    setStep("analyzing");
    setError("");
    setProgress(0);
    setProgressMessage("Starting analysis...");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          work_title: workTitle,
          work_type: workType,
          text,
          analysis_mode: analysisMode,
          mental_monitoring_enabled: mentalMonitoringEnabled,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      // Read streaming response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });

          // Parse SSE events
          const lines = fullText.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.type === "progress") {
                  setProgress(data.percent);
                  setProgressMessage(data.message);
                } else if (data.type === "complete") {
                  setResult(data.result);
                  setStep("complete");
                } else if (data.type === "error") {
                  throw new Error(data.message);
                }
              } catch {
                // Not valid JSON yet, continue
              }
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setStep("input");
    }
  }

  function handleReset() {
    setStep("input");
    setText("");
    setWorkTitle("");
    setResult(null);
    setProgress(0);
    setError("");
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <>
      <Header title="Analyze" subtitle="Upload student work for AI-powered analysis" />

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {step === "input" && (
          <>
            {error && (
              <Card className="border-destructive">
                <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
              </Card>
            )}

            {/* Student Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">1. Select Student</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={studentId} onValueChange={setStudentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.first_name} {s.last_name} — {s.class_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Work Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">2. Work Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Title</label>
                  <input
                    type="text"
                    placeholder="e.g. The Fall of the Roman Empire"
                    value={workTitle}
                    onChange={(e) => setWorkTitle(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Type</label>
                  <Select value={workType} onValueChange={(v) => setWorkType(v as WorkType)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="essay">Essay</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="homework">Homework</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Text Input / File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">3. Student&apos;s Work</CardTitle>
                <CardDescription>Drag &amp; drop a file, upload, or paste text directly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drag & Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors
                    ${isDragOver
                      ? "border-primary bg-primary/5"
                      : "border-input hover:border-primary/50 hover:bg-muted/30"
                    }
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md,.csv,.pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className={`h-8 w-8 ${isDragOver ? "text-primary" : "text-muted-foreground"}`} />
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      {isDragOver ? "Drop file here" : "Drop file here or click to browse"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      TXT, PDF, DOCX, Images — Max 10 MB
                    </p>
                  </div>
                </div>

                {/* Uploaded file indicator */}
                {uploadedFile && (
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 border px-3 py-2">
                    <File className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); clearFile(); }} className="text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">or paste text</span></div>
                </div>

                {/* Textarea */}
                <textarea
                  placeholder="Paste the student's work here... (minimum 20 characters)"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={8}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-y font-mono"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{text.length} characters</span>
                  {text.length > 0 && text.length < 20 && (
                    <span className="text-destructive">Minimum 20 characters required</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">4. Analysis Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-1.5">Education Level</p>
                  <Select value={analysisMode} onValueChange={(v) => setAnalysisMode(v as AnalysisMode)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elementary">
                        Elementary School (Ages 6-12)
                      </SelectItem>
                      <SelectItem value="highschool">
                        High School (Ages 13-18)
                      </SelectItem>
                      <SelectItem value="university">
                        University (Ages 18+)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Adjusts analysis criteria and language to the appropriate level
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">Mental Monitoring</p>
                      <Badge variant="secondary" className="text-[10px]">Beta</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Screen for potential mental health indicators (opt-in)
                    </p>
                  </div>
                  <Switch checked={mentalMonitoringEnabled} onCheckedChange={setMentalMonitoringEnabled} />
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              size="lg"
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              Analyze Work
            </Button>
          </>
        )}

        {step === "analyzing" && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-6">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium">Analyzing...</h3>
                <p className="text-sm text-muted-foreground">{progressMessage}</p>
              </div>
              <div className="w-full max-w-md space-y-2">
                <Progress value={progress} />
                <p className="text-center text-sm font-medium">{progress}%</p>
              </div>
            </CardContent>
          </Card>
        )}

        {step === "complete" && result && (
          <>
            <Card className="border-green-500/50 bg-green-500/5">
              <CardContent className="flex items-center gap-3 p-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Analysis Complete</p>
                  <p className="text-xs text-muted-foreground">
                    &ldquo;{workTitle}&rdquo; — {analysisMode === "elementary" ? "Elementary" : analysisMode === "highschool" ? "High School" : "University"} Mode
                  </p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto" onClick={handleReset}>
                  New Analysis
                </Button>
              </CardContent>
            </Card>

            <AnalysisResultView
              result={result}
              mode={analysisMode}
            />
          </>
        )}
      </div>
    </>
  );
}
