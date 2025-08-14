import * as Sentry from '@sentry/react';

export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: '', // You'll need to add your Sentry DSN
      environment: import.meta.env.MODE,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      beforeSend(event) {
        // Filter out known non-critical errors
        if (event.exception) {
          const error = event.exception.values?.[0];
          if (error?.value?.includes('Non-Error promise rejection captured')) {
            return null;
          }
          if (error?.value?.includes('Script error')) {
            return null;
          }
        }
        return event;
      },
    });
  }
};

export const captureError = (error: Error, context?: Record<string, unknown>) => {
  if (import.meta.env.PROD) {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('additional_info', context);
      }
      Sentry.captureException(error);
    });
  } else {
    console.error('Error captured for Sentry:', error, context);
  }
};

export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  if (import.meta.env.PROD) {
    Sentry.captureMessage(message, level);
  } else {
    console.log(`Sentry message (${level}):`, message);
  }
};