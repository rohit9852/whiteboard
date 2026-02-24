'use client';

import React from 'react';
import { useWhiteboard } from '../hooks/useWhiteboard';

interface Props {
    hook: ReturnType<typeof useWhiteboard>;
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
            onWheel={onWheel}
        />
    );
}
