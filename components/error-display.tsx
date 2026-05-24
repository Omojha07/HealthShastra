'use client';

import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorDisplayProps {
  message?: string;
  title?: string;
  onRetry?: () => void;
}

export function ErrorDisplay({
  message = 'Something went wrong. Please try again.',
  title = 'Error',
  onRetry,
}: ErrorDisplayProps) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900">{title}</h3>
            <p className="text-sm text-red-700 mt-1">{message}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-sm text-red-600 hover:text-red-700 underline mt-2"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
