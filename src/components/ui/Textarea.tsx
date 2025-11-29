'use client';

import { forwardRef, TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/helpers';
import { getWordCount } from '@/lib/utils/validation';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showWordCount?: boolean;
  maxWords?: number;
  minWords?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      showWordCount = false,
      maxWords,
      minWords,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const wordCount = typeof value === 'string' ? getWordCount(value) : 0;

    const isUnderMin = minWords !== undefined && wordCount < minWords;
    const isOverMax = maxWords !== undefined && wordCount > maxWords;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1.5"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={inputId}
            value={value}
            className={cn(
              'block w-full rounded-lg border border-gray-300 bg-white px-4 py-3',
              'text-gray-900 placeholder:text-gray-400',
              'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none',
              'transition-all duration-200 resize-y min-h-[120px]',
              'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
              className
            )}
            {...props}
          />
        </div>
        <div className="flex justify-between items-center mt-1.5">
          <div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {helperText && !error && (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}
          </div>
          {showWordCount && (
            <p
              className={cn(
                'text-sm',
                isUnderMin && 'text-amber-600',
                isOverMax && 'text-red-600',
                !isUnderMin && !isOverMax && 'text-gray-500'
              )}
            >
              {wordCount}
              {maxWords && ` / ${maxWords}`} words
              {minWords && wordCount < minWords && ` (min: ${minWords})`}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
