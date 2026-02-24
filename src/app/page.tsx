'use client';

import { useWhiteboard } from './hooks/useWhiteboard';
import Toolbar from './components/Toolbar';
import WhiteboardCanvas from './components/WhiteboardCanvas';
import StickyOverlay from './components/StickyOverlay';

export default function Home() {
  const hook = useWhiteboard();

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1a1a2e', overflow: 'hidden' }}>
      {/* Canvas layer */}
      <WhiteboardCanvas hook={hook} />

      {/* Sticky note DOM overlay */}
      <StickyOverlay elements={hook.elements} viewTransform={hook.viewTransform} />

      {/* Toolbar */}
      <Toolbar
        tool={hook.tool}
        setTool={hook.setTool}
        color={hook.color}
        setColor={hook.setColor}
        strokeWidth={hook.strokeWidth}
        setStrokeWidth={hook.setStrokeWidth}
        fillShape={hook.fillShape}
        setFillShape={hook.setFillShape}
        onUndo={hook.undo}
        onRedo={hook.redo}
        onClear={hook.clearCanvas}
        onExport={hook.exportPNG}
        canUndo={hook.canUndo}
        canRedo={hook.canRedo}
      />

      {/* Status bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(16,20,40,0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20,
          padding: '6px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          zIndex: 100,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <span style={{ fontSize: 12, color: 'rgba(148,163,184,0.6)' }}>
          🔍 {Math.round(hook.viewTransform.scale * 100)}%
        </span>
        <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ fontSize: 12, color: 'rgba(148,163,184,0.6)' }}>
          {hook.elements.length} object{hook.elements.length !== 1 ? 's' : ''}
        </span>
        <span style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.08)' }} />
        <span style={{
          fontSize: 12,
          color: '#a78bfa',
          textTransform: 'capitalize',
          fontWeight: 600,
        }}>
          {hook.tool}
        </span>
      </div>
    </div>
  );
}
