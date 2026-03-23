import { type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Input, type InputProps } from '../ui/Input';
import { Label, type LabelProps } from '../ui/Label';
import { Textarea, type TextareaProps } from '../ui/Textarea';

export type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  description?: string;
  error?: string;
  className?: string;
  labelProps?: Omit<LabelProps, 'htmlFor' | 'children'>;
};

export function FormFieldDescription({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p id={id} className={cn('text-xs text-slate-500', className)}>
      {children}
    </p>
  );
}

export function FormFieldError({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      id={id}
      role="alert"
      className={cn('text-xs font-medium text-rose-600', className)}
    >
      {children}
    </p>
  );
}

export type FormFieldSlotProps = FormFieldProps & {
  children: (props: {
    'aria-invalid': boolean | undefined;
    'aria-describedby': string | undefined;
  }) => ReactNode;
};

/** Headless wrapper: use children render prop for custom controls */
export function FormFieldSlot({
  id,
  label,
  required,
  description,
  error,
  className,
  labelProps,
  children,
}: FormFieldSlotProps) {
  const descId = description ? `${id}-description` : undefined;
  const errId = error ? `${id}-error` : undefined;
  const describedBy = [descId, errId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} required={required} {...labelProps}>
        {label}
      </Label>
      {description ? (
        <FormFieldDescription id={descId}>{description}</FormFieldDescription>
      ) : null}
      {children({
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
      })}
      {error ? <FormFieldError id={errId}>{error}</FormFieldError> : null}
    </div>
  );
}

export type FormFieldInputFieldProps = FormFieldProps &
  Omit<InputProps, 'id' | 'error'> & {
    id: string;
  };

export function FormFieldInput({
  id,
  label,
  required,
  description,
  error,
  className,
  labelProps,
  ...inputProps
}: FormFieldInputFieldProps) {
  const descId = description ? `${id}-description` : undefined;
  const errId = error ? `${id}-error` : undefined;
  const describedBy = [descId, errId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} required={required} {...labelProps}>
        {label}
      </Label>
      {description ? (
        <FormFieldDescription id={descId}>{description}</FormFieldDescription>
      ) : null}
      <Input
        id={id}
        error={Boolean(error)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...inputProps}
      />
      {error ? <FormFieldError id={errId}>{error}</FormFieldError> : null}
    </div>
  );
}

export type FormFieldTextareaProps = FormFieldProps &
  Omit<TextareaProps, 'id' | 'error'> & {
    id: string;
  };

export function FormFieldTextarea({
  id,
  label,
  required,
  description,
  error,
  className,
  labelProps,
  ...textareaProps
}: FormFieldTextareaProps) {
  const descId = description ? `${id}-description` : undefined;
  const errId = error ? `${id}-error` : undefined;
  const describedBy = [descId, errId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id} required={required} {...labelProps}>
        {label}
      </Label>
      {description ? (
        <FormFieldDescription id={descId}>{description}</FormFieldDescription>
      ) : null}
      <Textarea
        id={id}
        error={Boolean(error)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...textareaProps}
      />
      {error ? <FormFieldError id={errId}>{error}</FormFieldError> : null}
    </div>
  );
}
