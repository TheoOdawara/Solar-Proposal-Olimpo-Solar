import { captureError, captureMessage } from './sentry';

interface ErrorLogData {
  message: string;
  stack?: string;
  context?: Record<string, any>;
  userId?: string;
  timestamp: string;
  url: string;
  userAgent: string;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private isProduction = window.location.hostname !== 'localhost';

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  private setupGlobalErrorHandlers() {
    // Capture unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        context: { reason: event.reason },
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      });
    });
  }

  public logError(errorData: Partial<ErrorLogData> & { message: string }) {
    const fullErrorData: ErrorLogData = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...errorData,
    };

    // Log to console in development
    if (!this.isProduction) {
      console.error('Error logged:', fullErrorData);
    }

    // Send to Sentry in production
    if (this.isProduction) {
      captureError(new Error(fullErrorData.message), fullErrorData.context);
    }
    
    // Store locally as fallback
    this.storeErrorLocally(fullErrorData);
  }

  private storeErrorLocally(errorData: ErrorLogData) {
    try {
      const errors = this.getStoredErrors();
      errors.push(errorData);
      
      // Keep only last 50 errors to prevent storage overflow
      const recentErrors = errors.slice(-50);
      localStorage.setItem('app_errors', JSON.stringify(recentErrors));
    } catch (error) {
      console.error('Failed to store error locally:', error);
    }
  }

  public getStoredErrors(): ErrorLogData[] {
    try {
      const stored = localStorage.getItem('app_errors');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public clearStoredErrors() {
    localStorage.removeItem('app_errors');
  }

  // Method to manually log errors with context
  public logAuthError(error: any, context?: Record<string, any>) {
    this.logError({
      message: `Auth Error: ${error.message || error}`,
      stack: error.stack,
      context: { ...context, errorType: 'auth' },
    });
  }

  public logDatabaseError(error: any, context?: Record<string, any>) {
    this.logError({
      message: `Database Error: ${error.message || error}`,
      stack: error.stack,
      context: { ...context, errorType: 'database' },
    });
  }

  public logValidationError(field: string, value: any, error: string) {
    this.logError({
      message: `Validation Error: ${error}`,
      context: { 
        errorType: 'validation',
        field,
        value: typeof value === 'object' ? JSON.stringify(value) : value,
      },
    });
  }
}

export const errorLogger = ErrorLogger.getInstance();
