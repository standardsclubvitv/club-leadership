import { ProfileData, PositionApplication } from '@/types';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateProfile = (profile: Partial<ProfileData>): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!profile.fullName || profile.fullName.trim().length < 2) {
    errors.push({ field: 'fullName', message: 'Please enter your full name (at least 2 characters)' });
  }

  if (!profile.regNumber || !/^\d{2}[A-Z]{3}\d{4}$/i.test(profile.regNumber)) {
    errors.push({ field: 'regNumber', message: 'Please enter a valid VIT registration number (e.g., 21BCE1234)' });
  }

  if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!profile.phone || !/^[6-9]\d{9}$/.test(profile.phone)) {
    errors.push({ field: 'phone', message: 'Please enter a valid 10-digit Indian mobile number (starting with 6-9)' });
  }

  if (!profile.branch || profile.branch.trim().length < 2) {
    errors.push({ field: 'branch', message: 'Please select your branch/department' });
  }

  if (!profile.year || !['1st Year', '2nd Year', '3rd Year', '4th Year'].includes(profile.year)) {
    errors.push({ field: 'year', message: 'Please select your current academic year' });
  }

  return errors;
};

export const validatePositionApplications = (
  positions: PositionApplication[]
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (positions.length === 0) {
    errors.push({ field: 'positions', message: 'Please select at least one position to apply for' });
    return errors;
  }

  if (positions.length > 3) {
    errors.push({ field: 'positions', message: 'You can apply for a maximum of 3 positions' });
    return errors;
  }

  positions.forEach((position, posIndex) => {
    position.answers.forEach((answer, ansIndex) => {
      const wordCount = answer.answer.trim().split(/\s+/).filter(Boolean).length;
      if (!answer.answer || answer.answer.trim().length === 0) {
        errors.push({
          field: `position_${posIndex}_answer_${ansIndex}`,
          message: `Please provide an answer for Question ${ansIndex + 1} in ${position.positionName}`,
        });
      } else if (wordCount < 50) {
        errors.push({
          field: `position_${posIndex}_answer_${ansIndex}`,
          message: `Your answer for Question ${ansIndex + 1} in ${position.positionName} needs at least 50 words (currently ${wordCount} words)`,
        });
      }
    });
  });

  return errors;
};

export const validateApplication = (
  profile: Partial<ProfileData>,
  positions: PositionApplication[]
): ValidationError[] => {
  return [...validateProfile(profile), ...validatePositionApplications(positions)];
};

export const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(Boolean).length;
};

export const validateWordCount = (
  text: string,
  minWords: number,
  maxWords: number
): { valid: boolean; count: number; message?: string } => {
  const count = getWordCount(text);
  
  if (count < minWords) {
    return {
      valid: false,
      count,
      message: `Minimum ${minWords} words required (current: ${count})`,
    };
  }
  
  if (count > maxWords) {
    return {
      valid: false,
      count,
      message: `Maximum ${maxWords} words allowed (current: ${count})`,
    };
  }
  
  return { valid: true, count };
};
