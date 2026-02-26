'use client';

import React, { useCallback, useEffect, useRef } from 'react';

interface InlineTextInputProps {
    screenX: number;
    screenY: number;
    color: string;
    fontSize: number;
    onSubmit: (text: string) => void;
    onCancel: () => void;
}

const PADDING = 4;

export default function InlineTextInput({
    screenX,
    screenY,
    color,
    fontSize,
    onSubmit,
    onCancel,
}: InlineTextInputProps) {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = useCallback(() => {
        const value = inputRef.current?.value ?? '';
        onSubmit(value);
    }, [onSubmit]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onCancel();
            }
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
            }
        },
        [onCancel, handleSubmit]
    );

    const handleBlur = useCallback(() => {
        handleSubmit();
    }, [handleSubmit]);

    return (
        <textarea
            ref={inputRef}
            defaultValue=""
            placeholder="Type here..."
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
                position: 'fixed',
                left: screenX + PADDING,
                top: screenY + PADDING,
                minWidth: 120,
                maxWidth: 400,
                padding: '4px 8px',
                font: `${fontSize}px 'Inter', sans-serif`,
                color,
                background: 'rgba(26, 26, 46, 0.85)',
                border: '1px solid rgba(124, 58, 237, 0.6)',
                borderRadius: 8,
                outline: 'none',
                resize: 'none',
                zIndex: 200,
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                lineHeight: 1.4,
            }}
            rows={1}
        />
    );
}
