'use client';

import React from 'react';
import { useWhiteboard } from '../hooks/useWhiteboard';

interface Props {
    hook: ReturnType<typeof useWhiteboard>;
}

// Build a minimal event-like object for the hook (works for both mouse and touch)
function mouseEvent(clientX: number, clientY: number, button = 0): React.MouseEvent<HTMLCanvasElement> {
    return { clientX, clientY, button } as React.MouseEvent<HTMLCanvasElement>;
}

export default function WhiteboardCanvas({ hook }: Props) {
    const { canvasRef, tool, onMouseDown, onMouseMove, onMouseUp, onWheel } = hook;

    const getCursor = () => {
        switch (tool) {
            case 'pen': return 'crosshair';
            case 'eraser': return 'cell';
            case 'text': return 'text';
            case 'sticky': return 'copy';
            case 'select': return 'default';
            default: return 'crosshair';
        }
    };

    // Touch support so pen/stylus and fingers work on tablets
    const onTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (e.touches.length === 1) {
            const t = e.touches[0];
            onMouseDown(mouseEvent(t.clientX, t.clientY, 0));
        }
    };
    const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (e.touches.length === 1) {
            const t = e.touches[0];
            onMouseMove(mouseEvent(t.clientX, t.clientY, 0));
        }
    };
    const onTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (e.touches.length === 0) {
            onMouseUp();
        }
    };
    const onTouchCancel = (e: React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        if (e.touches.length === 0) {
            onMouseUp();
        }
    };

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                display: 'block',
                cursor: getCursor(),
                touchAction: 'none',
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchCancel}
            onWheel={onWheel}
        />
    );
}
