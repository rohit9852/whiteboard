'use client';

import React from 'react';
import { Tool } from '../types';

interface ToolbarProps {
    tool: Tool;
    setTool: (t: Tool) => void;
    color: string;
    setColor: (c: string) => void;
    strokeWidth: number;
    setStrokeWidth: (w: number) => void;
    fillShape: boolean;
    setFillShape: (f: boolean) => void;
    onUndo: () => void;
    onRedo: () => void;
    onClear: () => void;
    onExport: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const PRESET_COLORS = [
    '#f8fafc', // white
    '#f87171', // red
    '#fb923c', // orange
    '#facc15', // yellow
    '#4ade80', // green
    '#34d399', // emerald
    '#38bdf8', // sky
    '#818cf8', // indigo
    '#c084fc', // purple
    '#f472b6', // pink
];

const TOOLS: { id: Tool; label: string; icon: string; title: string }[] = [
    { id: 'select', label: 'S', icon: '⬡', title: 'Select (V)' },
    { id: 'pen', label: 'P', icon: '✏️', title: 'Pen (P)' },
    { id: 'eraser', label: 'E', icon: '🧹', title: 'Eraser (E)' },
    { id: 'rectangle', label: 'R', icon: '▭', title: 'Rectangle (R)' },
    { id: 'circle', label: 'C', icon: '◯', title: 'Circle (C)' },
    { id: 'line', label: 'L', icon: '╱', title: 'Line (L)' },
    { id: 'arrow', label: 'A', icon: '→', title: 'Arrow (A)' },
    { id: 'text', label: 'T', icon: 'T', title: 'Text (T)' },
    { id: 'sticky', label: 'N', icon: '🗒️', title: 'Sticky Note (N)' },
];

export default function Toolbar({
    tool,
    setTool,
    color,
    setColor,
    strokeWidth,
    setStrokeWidth,
    fillShape,
    setFillShape,
    onUndo,
    onRedo,
    onClear,
    onExport,
    canUndo,
    canRedo,
}: ToolbarProps) {
    return (
        <div style={styles.toolbar}>
            {/* Logo */}
            <div style={styles.logo}>
                <span style={styles.logoIcon}>⬡</span>
                <span style={styles.logoText}>Board</span>
            </div>

            <div style={styles.divider} />

            {/* Tools */}
            <div style={styles.section}>
                <span style={styles.sectionLabel}>TOOLS</span>
                <div style={styles.toolGrid}>
                    {TOOLS.map((t) => (
                        <button
                            key={t.id}
                            title={t.title}
                            onClick={() => setTool(t.id)}
                            style={{
                                ...styles.toolBtn,
                                ...(tool === t.id ? styles.toolBtnActive : {}),
                            }}
                        >
                            <span style={styles.toolIcon}>{t.icon}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div style={styles.divider} />

            {/* Colors */}
            <div style={styles.section}>
                <span style={styles.sectionLabel}>COLOR</span>
                <div style={styles.colorGrid}>
                    {PRESET_COLORS.map((c) => (
                        <button
                            key={c}
                            title={c}
                            onClick={() => setColor(c)}
                            style={{
                                ...styles.colorDot,
                                backgroundColor: c,
                                boxShadow:
                                    color === c
                                        ? `0 0 0 2px #1a1a2e, 0 0 0 4px ${c}, 0 0 12px ${c}80`
                                        : 'none',
                            }}
                        />
                    ))}
                </div>
                {/* Custom color picker */}
                <div style={styles.customColorWrap}>
                    <label style={styles.customColorLabel} title="Custom color">
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            style={styles.colorInput}
                        />
                        <span style={{ ...styles.colorDot, backgroundColor: color, width: 28, height: 28 }} />
                        <span style={styles.customColorText}>Custom</span>
                    </label>
                </div>
            </div>

            <div style={styles.divider} />

            {/* Stroke width */}
            <div style={styles.section}>
                <span style={styles.sectionLabel}>STROKE</span>
                <div style={styles.strokeRow}>
                    {[2, 5, 10].map((w) => (
                        <button
                            key={w}
                            title={`${w}px`}
                            onClick={() => setStrokeWidth(w)}
                            style={{
                                ...styles.strokeBtn,
                                ...(strokeWidth === w ? styles.strokeBtnActive : {}),
                            }}
                        >
                            <span
                                style={{
                                    display: 'block',
                                    width: w + 8,
                                    height: w,
                                    borderRadius: w,
                                    backgroundColor: strokeWidth === w ? '#7c3aed' : '#94a3b8',
                                    transition: 'all 0.2s',
                                }}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div style={styles.divider} />

            {/* Fill toggle */}
            <div style={styles.section}>
                <span style={styles.sectionLabel}>OPTIONS</span>
                <button
                    onClick={() => setFillShape(!fillShape)}
                    style={{
                        ...styles.optionBtn,
                        ...(fillShape ? styles.optionBtnActive : {}),
                    }}
                >
                    <span style={{ marginRight: 6 }}>◈</span> Fill Shape
                </button>
            </div>

            <div style={styles.divider} />

            {/* Actions */}
            <div style={styles.section}>
                <span style={styles.sectionLabel}>ACTIONS</span>
                <div style={styles.actionCol}>
                    <div style={styles.actionRow}>
                        <button
                            onClick={onUndo}
                            disabled={!canUndo}
                            title="Undo (Ctrl+Z)"
                            style={{ ...styles.actionBtn, opacity: canUndo ? 1 : 0.3 }}
                        >
                            ↩ Undo
                        </button>
                        <button
                            onClick={onRedo}
                            disabled={!canRedo}
                            title="Redo (Ctrl+Y)"
                            style={{ ...styles.actionBtn, opacity: canRedo ? 1 : 0.3 }}
                        >
                            ↪ Redo
                        </button>
                    </div>
                    <button onClick={onClear} title="Clear Canvas" style={styles.dangerBtn}>
                        🗑 Clear
                    </button>
                    <button onClick={onExport} title="Export PNG" style={styles.exportBtn}>
                        ⬇ Export PNG
                    </button>
                </div>
            </div>

            {/* Keyboard hint */}
            <div style={styles.hint}>Scroll to pan · Ctrl+Scroll to zoom · Draw near edge to auto-scroll</div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    toolbar: {
        position: 'fixed',
        left: 16,
        top: 16,
        bottom: 16,
        width: 200,
        background: 'rgba(16, 20, 40, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        zIndex: 100,
        overflowY: 'auto',
        boxShadow: '0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        scrollbarWidth: 'none',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
        paddingLeft: 4,
    },
    logoIcon: {
        fontSize: 22,
        color: '#7c3aed',
    },
    logoText: {
        fontSize: 18,
        fontWeight: 700,
        color: '#f1f5f9',
        letterSpacing: '-0.5px',
    },
    divider: {
        height: 1,
        background: 'rgba(255,255,255,0.06)',
        margin: '10px 0',
        borderRadius: 1,
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    sectionLabel: {
        fontSize: 10,
        fontWeight: 700,
        color: 'rgba(148,163,184,0.6)',
        letterSpacing: '1.5px',
        paddingLeft: 4,
    },
    toolGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 6,
    },
    toolBtn: {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: '8px 4px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
        color: '#94a3b8',
    },
    toolBtnActive: {
        background: 'rgba(124,58,237,0.25)',
        border: '1px solid rgba(124,58,237,0.6)',
        color: '#a78bfa',
        boxShadow: '0 0 12px rgba(124,58,237,0.25)',
    },
    toolIcon: {
        fontSize: 16,
        lineHeight: 1,
    },
    colorGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 6,
    },
    colorDot: {
        width: 26,
        height: 26,
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.15s',
    },
    customColorWrap: {
        marginTop: 4,
    },
    customColorLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        padding: '6px 8px',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.06)',
    },
    colorInput: {
        width: 0,
        height: 0,
        opacity: 0,
        position: 'absolute',
    },
    customColorText: {
        fontSize: 12,
        color: '#94a3b8',
    },
    strokeRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '4px 8px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: 10,
        border: '1px solid rgba(255,255,255,0.05)',
    },
    strokeBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4px',
        borderRadius: 6,
        flex: 1,
    },
    strokeBtnActive: {
        background: 'rgba(124,58,237,0.15)',
    },
    optionBtn: {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 8,
        padding: '7px 10px',
        cursor: 'pointer',
        fontSize: 12,
        color: '#94a3b8',
        textAlign: 'left',
        transition: 'all 0.15s',
    },
    optionBtnActive: {
        background: 'rgba(124,58,237,0.2)',
        border: '1px solid rgba(124,58,237,0.5)',
        color: '#a78bfa',
    },
    actionCol: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
    },
    actionRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 6,
    },
    actionBtn: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        padding: '7px 4px',
        cursor: 'pointer',
        fontSize: 11,
        color: '#cbd5e1',
        textAlign: 'center',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
    },
    dangerBtn: {
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: 8,
        padding: '8px 10px',
        cursor: 'pointer',
        fontSize: 12,
        color: '#fca5a5',
        textAlign: 'center',
        transition: 'all 0.15s',
    },
    exportBtn: {
        background: 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(139,92,246,0.4))',
        border: '1px solid rgba(124,58,237,0.5)',
        borderRadius: 8,
        padding: '8px 10px',
        cursor: 'pointer',
        fontSize: 12,
        color: '#c4b5fd',
        textAlign: 'center',
        transition: 'all 0.15s',
        boxShadow: '0 0 16px rgba(124,58,237,0.15)',
    },
    hint: {
        marginTop: 'auto',
        paddingTop: 12,
        fontSize: 10,
        color: 'rgba(148,163,184,0.4)',
        textAlign: 'center',
        lineHeight: 1.5,
    },
};
