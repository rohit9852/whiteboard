'use client';

import React from 'react';
import { useWhiteboard } from '../hooks/useWhiteboard';
import { StickyElement } from '../types';

interface Props {
    elements: ReturnType<typeof useWhiteboard>['elements'];
    viewTransform: ReturnType<typeof useWhiteboard>['viewTransform'];
}

export default function StickyOverlay({ elements, viewTransform }: Props) {
    const stickyNotes = elements.filter((el) => el.type === 'sticky') as StickyElement[];

    if (stickyNotes.length === 0) return null;

    return (
        <>
            {stickyNotes.map((sticky) => {
                const screenX = sticky.x * viewTransform.scale + viewTransform.offsetX;
                const screenY = sticky.y * viewTransform.scale + viewTransform.offsetY;
                const screenW = sticky.width * viewTransform.scale;
                const screenH = sticky.height * viewTransform.scale;
                const fontSize = Math.max(8, 13 * viewTransform.scale);

                return (
                    <div
                        key={sticky.id}
                        style={{
                            position: 'fixed',
                            left: screenX,
                            top: screenY,
                            width: screenW,
                            height: screenH,
                            backgroundColor: sticky.bgColor,
                            borderRadius: 4 * viewTransform.scale,
                            padding: 10 * viewTransform.scale,
                            boxShadow: `0 ${4 * viewTransform.scale}px ${16 * viewTransform.scale}px rgba(0,0,0,0.4)`,
                            display: 'flex',
                            flexDirection: 'column',
                            pointerEvents: 'none',
                            overflow: 'hidden',
                            zIndex: 10,
                        }}
                    >
                        {/* Header bar */}
                        <div
                            style={{
                                height: 8 * viewTransform.scale,
                                background: 'rgba(0,0,0,0.1)',
                                borderRadius: 2 * viewTransform.scale,
                                marginBottom: 8 * viewTransform.scale,
                                flexShrink: 0,
                            }}
                        />
                        <p
                            style={{
                                fontSize,
                                color: '#1a1a2e',
                                fontFamily: "'Inter', sans-serif",
                                fontWeight: 500,
                                lineHeight: 1.5,
                                wordBreak: 'break-word',
                                margin: 0,
                                overflow: 'hidden',
                            }}
                        >
                            {sticky.text}
                        </p>
                    </div>
                );
            })}
        </>
    );
}
