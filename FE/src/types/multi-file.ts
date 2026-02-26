// Multi-File Processing Types for Bimbelio PDF System

// File Status Types
export type FileStatus =
  | 'pending'      // In queue, not started
  | 'uploading'    // Being uploaded
  | 'uploaded'     // Upload complete, ready for processing
  | 'processing'   // Currently being processed
  | 'completed'    // Successfully completed all stages
  | 'failed'       // Failed at some stage
  | 'cancelled'    // User cancelled
  | 'paused'       // Processing paused
  | 'retrying';    // Retrying after failure

// Processing Stage Result Type
export interface ProcessingStageResult {
  stage: ProcessingStage;
  success: boolean;
  data?: {
    vision?: string;
    extracted?: string;
    csv?: string;
    docx?: string;
  };
  error?: string;
  cost?: number;
  timestamp: string;
};

export type ProcessingStage = 'vision' | 'extraction' | 'conversion';

export interface ProcessingFile {
  id: string;                    // Unique identifier (UUID)
  backendId?: string;            // Backend-assigned file ID untuk SSE mapping
  file: File;                   // Original File object
  name: string;                 // Display name
  size: number;                 // File size in bytes
  status: FileStatus;           // Current status
  currentStage?: ProcessingStage; // Current processing stage
  progress: number;             // Progress percentage (0-100)
  queuePosition: number;        // Position in queue (0-based)
  currentMessage?: string;      // Current detailed progress message
  currentSubStep?: string;      // Current sub-step message
  pageProgress?: {
    current: number;
    total: number;
  };

  // Processing results per stage
  results: {
    vision?: {
      fileName: string;
      promptTokens: number;
      completionTokens: number;
      totalCost: number;
    };
    extraction?: {
      fileName: string;
      promptTokens: number;
      completionTokens: number;
      totalCost: number;
    };
    conversion?: {
      csvFileName: string;
      docxFileName: string;
    };
  };

  // Error handling
  error?: {
    stage: ProcessingStage;
    message: string;
    timestamp: Date;
  };

  // Progress tracking
  stageProgress: {
    vision: number;
    extraction: number;
    conversion: number;
  };

  // Timing
  startTime?: Date;
  completionTime?: Date;
  processingDuration?: number;
}

export interface BatchProcessing {
  id: string;                   // Batch UUID
  files: ProcessingFile[];      // All files in batch
  currentFileIndex: number;     // Currently processing file (0-based)
  status: 'idle' | 'processing' | 'paused' | 'completed' | 'failed';

  // Statistics
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  successfulFiles: number;

  // Progress
  overallProgress: number;      // Overall batch progress (0-100)

  // Timing
  startTime?: Date;
  estimatedCompletion?: Date;

  // Costs
  totalCost: number;
  averageCostPerFile: number;
}

export interface QueueControls {
  isPaused: boolean;
  canPause: boolean;
  canResume: boolean;
  canStop: boolean;
}

// Extended Provider Types
export interface MultiFileProviderType {
  // Multi-file management
  useMultiFile: {
    files: ProcessingFile[];
    setFiles: React.Dispatch<React.SetStateAction<ProcessingFile[]>>;
    addFiles: (files: File[]) => void;
    removeFile: (fileId: string) => void;
    clearFiles: () => void;
    updateFileStatus: (fileId: string, status: FileStatus) => void;
    updateFileProgress: (fileId: string, progress: number, stage?: ProcessingStage, message?: string, subStep?: string, pageProgress?: { current: number; total: number }) => void;
    updateFileResult: (fileId: string, stage: ProcessingStage, result: ProcessingStageResult) => void;
    setFileError: (fileId: string, stage: ProcessingStage, error: string) => void;
  };

  // Batch processing management
  useBatch: {
    batch: BatchProcessing | null;
    setBatch: React.Dispatch<React.SetStateAction<BatchProcessing | null>>;
    initializeBatch: (files: ProcessingFile[]) => void;
    startProcessing: () => void;
    pauseProcessing: () => void;
    resumeProcessing: () => void;
    stopProcessing: () => void;
    resetBatch: () => void;
    moveToNextFile: () => void;
  };

  // Queue controls
  useQueue: {
    controls: QueueControls;
    isProcessing: boolean;
    currentFile: ProcessingFile | null;
    remainingFiles: ProcessingFile[];
    completedFiles: ProcessingFile[];
    failedFiles: ProcessingFile[];
  };

  // Multi-file results
  useMultiResult: {
    aggregateStats: {
      totalFiles: number;
      successCount: number;
      failedCount: number;
      totalCost: number;
      averageProcessingTime: number;
    };
    getSuccessfulFiles: () => ProcessingFile[];
    getFailedFiles: () => ProcessingFile[];
    getCompletedFiles: () => ProcessingFile[];
    canDownloadAll: boolean;
    canRetryFailed: boolean;
  };

  // Progress tracking
  useProgress: {
    overallProgress: number;
    currentFileProgress: number;
    stageProgress: Record<ProcessingStage, number>;
    estimatedTimeRemaining: number;
    progressText: string;
  };
}

// API Types for Multi-File Processing
export interface BatchUploadRequest {
  batchId: string;
  files: FormData;
  totalFiles: number;
}

export interface BatchStatusResponse {
  batchId: string;
  status: BatchProcessing['status'];
  currentFileIndex: number;
  totalFiles: number;
  completedFiles: number;
  failedFiles: number;
  overallProgress: number;
  files: Array<{
    fileId: string;
    fileName: string;
    status: FileStatus;
    progress: number;
    currentStage?: ProcessingStage;
    error?: string;
  }>;
}

export interface FileProcessingUpdate {
  type: 'batch_update' | 'file_update' | 'stage_update';
  batchId: string;
  fileId?: string;
  fileName?: string;
  queuePosition?: number;
  status?: FileStatus;
  progress?: number;
  stage?: ProcessingStage;
  text?: string;
  error?: string;
  result?: {
    vision?: string;
    extracted?: string;
    csv?: string;
    docx?: string;
  };
  overallProgress?: number;
  completedFiles?: number;
  estimatedTime?: number;
}

// Utility Types
export type FileValidationResult = {
  isValid: boolean;
  error?: string;
  warnings?: string[];
};

export type BatchValidationResult = {
  validFiles: File[];
  invalidFiles: Array<{ file: File; reason: string }>;
  totalSize: number;
  exceedsLimits: boolean;
};

// Multi-File Context Type
export interface MultiFileContextType {
  // File management
  files: ProcessingFile[];
  setFiles: React.Dispatch<React.SetStateAction<ProcessingFile[]>>;
  addFiles: (files: File[]) => void;
  removeFile: (fileId: string) => void;
  clearFiles: () => void;

  // File updates
  updateFileStatus: (fileId: string, status: FileStatus) => void;
  updateFileProgress: (fileId: string, progress: number, stage?: ProcessingStage, message?: string, subStep?: string, pageProgress?: { current: number; total: number }) => void;
  updateFileResult: (fileId: string, stage: ProcessingStage, result: Record<string, unknown>) => void;
  setFileError: (fileId: string, stage: ProcessingStage, error: string) => void;

  // Batch management
  batch: BatchProcessing | null;
  setBatch: React.Dispatch<React.SetStateAction<BatchProcessing | null>>;
  initializeBatch: (files: ProcessingFile[]) => Promise<BatchProcessing>;
  startProcessing: (targetBatch?: BatchProcessing) => Promise<void>;
  pauseProcessing: () => void;
  resumeProcessing: () => void;
  stopProcessing: () => void;
  resetBatch: () => void;
  moveToNextFile: () => void;

  // Queue state
  queueControls: QueueControls;
  isProcessing: boolean;
  currentFile: ProcessingFile | null;

  // Results and statistics
  aggregateStats: {
    totalFiles: number;
    successCount: number;
    failedCount: number;
    totalCost: number;
    averageProcessingTime: number;
  };

  // Utility functions
  validateFiles: (files: File[]) => BatchValidationResult;
  getSuccessfulFiles: () => ProcessingFile[];
  getFailedFiles: () => ProcessingFile[];
  canDownloadAll: boolean;
  canRetryFailed: boolean;

  // Configuration
  config: MultiFileConfig;
}

// Configuration Types
export interface MultiFileConfig {
  maxFiles: number;              // Maximum files per batch (default: 10)
  maxFileSize: number;           // Maximum size per file in bytes (default: 50MB)
  maxBatchSize: number;          // Maximum total batch size in bytes (default: 500MB)
  allowedTypes: string[];        // Allowed MIME types (default: ['application/pdf'])
  concurrentProcessing: boolean; // Allow concurrent processing (default: false for sequential)
  autoStartProcessing: boolean;  // Auto-start processing after upload (default: false)
  persistBatchState: boolean;    // Persist batch state to localStorage (default: true)
  showDetailedProgress: boolean; // Show detailed per-file progress (default: true)
  enableBulkDownload: boolean;   // Enable bulk download features (default: true)
  retryFailedFiles: boolean;     // Enable retry for failed files (default: true)
}
