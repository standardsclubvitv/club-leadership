'use client';

import { Position, PositionApplication, PositionAnswer } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Textarea } from '@/components/ui';
import { FileText } from 'lucide-react';

interface QuestionFormProps {
  position: Position;
  application: PositionApplication;
  onChange: (application: PositionApplication) => void;
  errors: Record<string, string>;
}

export default function QuestionForm({
  position,
  application,
  onChange,
  errors,
}: QuestionFormProps) {
  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers: PositionAnswer[] = position.questions.map((question, index) => {
      const existingAnswer = application.answers.find((a) => a.question === question);
      if (index === questionIndex) {
        return { question, answer };
      }
      return existingAnswer || { question, answer: '' };
    });

    onChange({
      ...application,
      answers: newAnswers,
    });
  };

  const getAnswer = (question: string): string => {
    return application.answers.find((a) => a.question === question)?.answer || '';
  };

  return (
    <Card variant="outlined" className="border-blue-100 bg-blue-50/30">
      <CardHeader className="flex flex-row items-center gap-3 pb-4 border-b border-blue-100">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <CardTitle className="text-blue-900">{position.title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-8">
        {position.questions.map((question, index) => {
          const errorKey = `position_${position.id}_answer_${index}`;
          return (
            <div key={index} className="space-y-3">
              <div className="space-y-2">
                <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 text-white text-sm font-semibold rounded-full">
                  {index + 1}
                </span>
                <p className="text-gray-800 font-medium leading-relaxed">
                  {question}
                </p>
              </div>
              <Textarea
                label="Your Answer"
                placeholder="Type your answer here..."
                value={getAnswer(question)}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                error={errors[errorKey]}
                showWordCount
                minWords={50}
                maxWords={500}
                rows={6}
                required
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
