'use client';

import { Position } from '@/types';
import { Card, CardContent } from '@/components/ui';
import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils/helpers';

interface PositionSelectorProps {
  positions: Position[];
  selectedPositions: string[];
  onSelect: (positionId: string) => void;
  maxSelections?: number;
  error?: string;
}

export default function PositionSelector({
  positions,
  selectedPositions,
  onSelect,
  maxSelections = 3,
  error,
}: PositionSelectorProps) {
  const isSelected = (positionId: string) => selectedPositions.includes(positionId);
  const isMaxReached = selectedPositions.length >= maxSelections;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Select up to {maxSelections} positions you&apos;re interested in
        </p>
        <p
          className={cn(
            'text-sm font-medium',
            selectedPositions.length === 0 && 'text-gray-400',
            selectedPositions.length > 0 && selectedPositions.length < maxSelections && 'text-blue-600',
            selectedPositions.length === maxSelections && 'text-green-600'
          )}
        >
          {selectedPositions.length} / {maxSelections} selected
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {positions.map((position) => {
          const selected = isSelected(position.id);
          const disabled = !selected && isMaxReached;

          return (
            <Card
              key={position.id}
              variant={selected ? 'elevated' : 'default'}
              padding="none"
              className={cn(
                'cursor-pointer transition-all duration-200',
                selected && 'ring-2 ring-blue-500 border-blue-500',
                disabled && 'opacity-50 cursor-not-allowed',
                !selected && !disabled && 'hover:border-blue-300 hover:shadow-md'
              )}
              onClick={() => !disabled && onSelect(position.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {selected ? (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={cn(
                        'font-semibold text-base',
                        selected ? 'text-blue-600' : 'text-gray-900'
                      )}
                    >
                      {position.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-3">
                      {position.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
