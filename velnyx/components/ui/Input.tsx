"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => (
    <div className="space-y-2">
      {label && (
        <label className="text-zinc-400 text-xs uppercase tracking-[0.05em] font-medium">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn("input-dark w-full", className)}
        {...props}
      />
    </div>
  )
);
Input.displayName = "Input";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, ...props }, ref) => (
    <div className="space-y-2">
      {label && (
        <label className="text-zinc-400 text-xs uppercase tracking-[0.05em] font-medium">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn("input-dark w-full resize-none", className)}
        {...props}
      />
    </div>
  )
);
Textarea.displayName = "Textarea";

export default Input;
