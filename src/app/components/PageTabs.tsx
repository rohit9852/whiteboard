'use client';

import React from 'react';
import type { WhiteboardPageState } from '../types';

interface PageTabsProps {
    pages: WhiteboardPageState[];
    currentPageIndex: number;
    onSelectPage: (index: number) => void;
    onAddPage: () => void;
    onRemovePage: (index: number) => void;
}

export default function PageTabs({
    pages,
    currentPageIndex,
    onSelectPage,
    onAddPage,
    onRemovePage,
}: PageTabsProps) {
    return (
        <div
            style={{
                position: 'fixed',
                top: 16,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'rgba(16, 20, 40, 0.92)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '6px 8px',
                zIndex: 101,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
        >
            {pages.map((page, index) => (
                <div
                    key={page.id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        background: index === currentPageIndex ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${index === currentPageIndex ? 'rgba(124,58,237,0.6)' : 'rgba(255,255,255,0.06)'}`,
                        borderRadius: 8,
                        overflow: 'hidden',
                    }}
                >
                    <button
                        type="button"
                        onClick={() => onSelectPage(index)}
                        style={{
                            padding: '8px 14px',
                            background: 'none',
                            border: 'none',
                            color: index === currentPageIndex ? '#c4b5fd' : '#94a3b8',
                            fontSize: 13,
                            fontWeight: index === currentPageIndex ? 600 : 500,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {page.name}
                    </button>
                    {pages.length > 1 && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemovePage(index);
                            }}
                            title="Remove page"
                            style={{
                                padding: '4px 8px',
                                background: 'rgba(239,68,68,0.15)',
                                border: 'none',
                                color: '#fca5a5',
                                fontSize: 14,
                                cursor: 'pointer',
                                lineHeight: 1,
                            }}
                        >
                            ×
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={onAddPage}
                title="Add page"
                style={{
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px dashed rgba(255,255,255,0.2)',
                    borderRadius: 8,
                    color: '#94a3b8',
                    fontSize: 18,
                    cursor: 'pointer',
                    lineHeight: 1,
                }}
            >
                +
            </button>
        </div>
    );
}
