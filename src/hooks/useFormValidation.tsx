import { useState, useEffect } from 'react';
import { errorLogger } from '@/utils/errorLogger';

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationRules {
  [field: string]: ValidationRule;
}

interface ValidationErrors {
  [field: string]: string;
}

export const useFormValidation = (rules: ValidationRules) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: string, value: any): string | null => {
    const rule = rules[field];
    if (!rule) return null;

    try {
      // Required validation
      if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        return 'Este campo é obrigatório';
      }

      // Skip other validations if value is empty and not required
      if (!value && !rule.required) return null;

      // String validations
      if (typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          return `Deve ter pelo menos ${rule.minLength} caracteres`;
        }

        if (rule.maxLength && value.length > rule.maxLength) {
          return `Deve ter no máximo ${rule.maxLength} caracteres`;
        }

        if (rule.pattern && !rule.pattern.test(value)) {
          return 'Formato inválido';
        }
      }

      // Custom validation
      if (rule.custom) {
        const customError = rule.custom(value);
        if (customError) return customError;
      }

      return null;
    } catch (error) {
      errorLogger.logValidationError(field, value, error instanceof Error ? error.message : 'Unknown validation error');
      return 'Erro de validação';
    }
  };

  const validateForm = (data: Record<string, any>): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(rules).forEach(field => {
      const error = validateField(field, data[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const validateSingleField = (field: string, value: any): string | null => {
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
    return error;
  };

  const clearFieldError = (field: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  const markFieldTouched = (field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };

  const clearAllErrors = () => {
    setErrors({});
    setTouched({});
  };

  const hasErrors = Object.values(errors).some(error => error !== '');
  const isFieldTouched = (field: string) => touched[field] || false;
  const getFieldError = (field: string) => errors[field] || '';

  return {
    errors,
    touched,
    validateForm,
    validateSingleField,
    clearFieldError,
    markFieldTouched,
    clearAllErrors,
    hasErrors,
    isFieldTouched,
    getFieldError,
  };
};

// Common validation rules
export const validationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (value && !value.includes('@')) return 'Email deve conter @';
      return null;
    }
  },
  password: {
    required: true,
    minLength: 8,
    custom: (value: string) => {
      if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        return 'Senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número';
      }
      return null;
    }
  },
  phone: {
    required: true,
    pattern: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    custom: (value: string) => {
      if (value && value.replace(/\D/g, '').length < 10) {
        return 'Telefone deve ter pelo menos 10 dígitos';
      }
      return null;
    }
  },
  cpf: {
    required: true,
    pattern: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    custom: (value: string) => {
      if (!value) return null;
      const digits = value.replace(/\D/g, '');
      if (digits.length !== 11) return 'CPF deve ter 11 dígitos';
      
      // Basic CPF validation algorithm
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(digits[i]) * (10 - i);
      }
      let remainder = 11 - (sum % 11);
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(digits[9])) return 'CPF inválido';

      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(digits[i]) * (11 - i);
      }
      remainder = 11 - (sum % 11);
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(digits[10])) return 'CPF inválido';

      return null;
    }
  },
  cep: {
    required: true,
    pattern: /^\d{5}-?\d{3}$/,
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    custom: (value: string) => {
      if (value && value.trim().split(' ').length < 2) {
        return 'Digite nome e sobrenome';
      }
      return null;
    }
  },
  number: {
    required: true,
    custom: (value: any) => {
      if (value !== undefined && value !== null && isNaN(Number(value))) {
        return 'Deve ser um número válido';
      }
      return null;
    }
  },
  positiveNumber: {
    required: true,
    custom: (value: any) => {
      const num = Number(value);
      if (isNaN(num)) return 'Deve ser um número válido';
      if (num <= 0) return 'Deve ser um número maior que zero';
      return null;
    }
  }
};