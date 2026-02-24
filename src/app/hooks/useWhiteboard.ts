'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
    ArrowElement,
    CircleElement,
    LineElement,
    Point,
    RectangleElement,
    StrokeElement,
    TextElement,
    Tool,
    ViewTransform,
    WhiteboardElement,
} from '../types';

const generateId = () => Math.random().toString(36).slice(2, 10);

export function useWhiteboard() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [elements, setElements] = useState<WhiteboardElement[]>([]);
    const [history, setHistory] = useState<WhiteboardElement[][]>([[]]);
    const [historyIndex, setHistoryIndex] = useState(0);
    const [tool, setTool] = useState<Tool>('pen');
    const [color, setColor] = useState('#f8fafc');
    const [strokeWidth, setStrokeWidth] = useState(3);
    const [fillShape, setFillShape] = useState(false);
    const [fontSize, setFontSize] = useState(20);
    const [viewTransform, setViewTransform] = useState<ViewTransform>({
        scale: 1,
        offsetX: 0,
        offsetY: 0,
    });

    const isDrawingRef = useRef(false);
    const isPanningRef = useRef(false);
    const currentElementRef = useRef<WhiteboardElement | null>(null);
    const startPointRef = useRef<Point>({ x: 0, y: 0 });
    const lastPanPointRef = useRef<Point>({ x: 0, y: 0 });
    const spaceDownRef = useRef(false);

    // Transform screen coords to canvas (world) coords
    const screenToWorld = useCallback(
        (sx: number, sy: number, vt: ViewTransform): Point => ({
            x: (sx - vt.offsetX) / vt.scale,
            y: (sy - vt.offsetY) / vt.scale,
        }),
        []
    );

    const pushHistory = useCallback(
        (newElements: WhiteboardElement[]) => {
            setHistory((prev) => {
                const trimmed = prev.slice(0, historyIndex + 1);
                return [...trimmed, newElements];
            });
            setHistoryIndex((i) => i + 1);
        },
        [historyIndex]
    );

    const undo = useCallback(() => {
        setHistoryIndex((i) => {
            const newIndex = Math.max(0, i - 1);
            setHistory((h) => {
                setElements(h[newIndex] ?? []);
                return h;
            });
            return newIndex;
        });
    }, []);

    const redo = useCallback(() => {
        setHistoryIndex((i) => {
            setHistory((h) => {
                const newIndex = Math.min(h.length - 1, i + 1);
                setElements(h[newIndex] ?? []);
                return h;
            });
            return Math.min(history.length - 1, i + 1);
        });
    }, [history.length]);

    const clearCanvas = useCallback(() => {
        const empty: WhiteboardElement[] = [];
        setElements(empty);
        pushHistory(empty);
    }, [pushHistory]);

    const exportPNG = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        // Render to offscreen at 1:1 scale for export
        const off = document.createElement('canvas');
        off.width = canvas.width;
        off.height = canvas.height;
        const ctx = off.getContext('2d')!;
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, off.width, off.height);
        ctx.drawImage(canvas, 0, 0);
        const link = document.createElement('a');
        link.download = `whiteboard-${Date.now()}.png`;
        link.href = off.toDataURL('image/png');
        link.click();
    }, []);

    // Drawing helpers
    const drawArrow = (
        ctx: CanvasRenderingContext2D,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        headLen: number
    ) => {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(
            x2 - headLen * Math.cos(angle - Math.PI / 6),
            y2 - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            x2 - headLen * Math.cos(angle + Math.PI / 6),
            y2 - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
    };

    const renderElements = useCallback(
        (ctx: CanvasRenderingContext2D, elems: WhiteboardElement[], vt: ViewTransform) => {
            ctx.save();
            ctx.setTransform(vt.scale, 0, 0, vt.scale, vt.offsetX, vt.offsetY);

            for (const el of elems) {
                ctx.globalAlpha = el.opacity;
                if (el.type === 'stroke') {
                    const s = el as StrokeElement;
                    if (s.points.length < 2) continue;
                    ctx.strokeStyle = s.color;
                    ctx.lineWidth = s.lineWidth;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    ctx.beginPath();
                    ctx.moveTo(s.points[0].x, s.points[0].y);
                    for (let i = 1; i < s.points.length - 1; i++) {
                        const mx = (s.points[i].x + s.points[i + 1].x) / 2;
                        const my = (s.points[i].y + s.points[i + 1].y) / 2;
                        ctx.quadraticCurveTo(s.points[i].x, s.points[i].y, mx, my);
                    }
                    ctx.lineTo(
                        s.points[s.points.length - 1].x,
                        s.points[s.points.length - 1].y
                    );
                    ctx.stroke();
                } else if (el.type === 'rectangle') {
                    const r = el as RectangleElement;
                    ctx.strokeStyle = r.color;
                    ctx.lineWidth = r.lineWidth;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                    if (r.fill) {
                        ctx.fillStyle = r.fill;
                        ctx.fillRect(r.x, r.y, r.width, r.height);
                    }
                    ctx.strokeRect(r.x, r.y, r.width, r.height);
                } else if (el.type === 'circle') {
                    const c = el as CircleElement;
                    ctx.strokeStyle = c.color;
                    ctx.lineWidth = c.lineWidth;
                    ctx.beginPath();
                    ctx.ellipse(c.cx, c.cy, Math.abs(c.rx), Math.abs(c.ry), 0, 0, 2 * Math.PI);
                    if (c.fill) {
                        ctx.fillStyle = c.fill;
                        ctx.fill();
                    }
                    ctx.stroke();
                } else if (el.type === 'line') {
                    const l = el as LineElement;
                    ctx.strokeStyle = l.color;
                    ctx.lineWidth = l.lineWidth;
                    ctx.lineCap = 'round';
                    ctx.beginPath();
                    ctx.moveTo(l.x1, l.y1);
                    ctx.lineTo(l.x2, l.y2);
                    ctx.stroke();
                } else if (el.type === 'arrow') {
                    const a = el as ArrowElement;
                    ctx.strokeStyle = a.color;
                    ctx.fillStyle = a.color;
                    ctx.lineWidth = a.lineWidth;
                    ctx.lineCap = 'round';
                    drawArrow(ctx, a.x1, a.y1, a.x2, a.y2, 16 + a.lineWidth * 2);
                } else if (el.type === 'text') {
                    const t = el as TextElement;
                    ctx.fillStyle = t.color;
                    ctx.font = `${t.fontSize}px 'Inter', sans-serif`;
                    ctx.textBaseline = 'top';
                    const lines = t.text.split('\n');
                    lines.forEach((line, i) => {
                        ctx.fillText(line, t.x, t.y + i * (t.fontSize * 1.4));
                    });
                }
                ctx.globalAlpha = 1;
            }
            ctx.restore();
        },
        []
    );

    // Main render loop
    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Grid
        ctx.save();
        const gridSize = 40 * viewTransform.scale;
        const startX = viewTransform.offsetX % gridSize;
        const startY = viewTransform.offsetY % gridSize;
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        for (let x = startX; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = startY; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
        ctx.restore();

        const allElems = currentElementRef.current
            ? [...elements, currentElementRef.current]
            : elements;
        renderElements(ctx, allElems, viewTransform);
    }, [elements, viewTransform, renderElements]);

    useEffect(() => {
        render();
    }, [render]);

    // Canvas resize
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        };
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, [render]);

    // Keyboard shortcuts
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space') spaceDownRef.current = true;
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) redo();
                else undo();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                redo();
            }
        };
        const onKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') spaceDownRef.current = false;
        };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
    }, [undo, redo]);

    // Mouse handlers
    const onMouseDown = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement>) => {
            if (e.button === 1 || spaceDownRef.current) {
                isPanningRef.current = true;
                lastPanPointRef.current = { x: e.clientX, y: e.clientY };
                return;
            }
            if (e.button !== 0) return;

            const wp = screenToWorld(e.clientX, e.clientY, viewTransform);
            startPointRef.current = wp;
            isDrawingRef.current = true;

            if (tool === 'eraser') return;

            if (tool === 'pen') {
                currentElementRef.current = {
                    id: generateId(),
                    type: 'stroke',
                    points: [wp],
                    color,
                    lineWidth: strokeWidth,
                    opacity: 1,
                } as StrokeElement;
            } else if (tool === 'rectangle') {
                currentElementRef.current = {
                    id: generateId(),
                    type: 'rectangle',
                    x: wp.x,
                    y: wp.y,
                    width: 0,
                    height: 0,
                    color,
                    lineWidth: strokeWidth,
                    fill: fillShape ? color + '33' : null,
                    opacity: 1,
                } as RectangleElement;
            } else if (tool === 'circle') {
                currentElementRef.current = {
                    id: generateId(),
                    type: 'circle',
                    cx: wp.x,
                    cy: wp.y,
                    rx: 0,
                    ry: 0,
                    color,
                    lineWidth: strokeWidth,
                    fill: fillShape ? color + '33' : null,
                    opacity: 1,
                };
            } else if (tool === 'line') {
                currentElementRef.current = {
                    id: generateId(),
                    type: 'line',
                    x1: wp.x,
                    y1: wp.y,
                    x2: wp.x,
                    y2: wp.y,
                    color,
                    lineWidth: strokeWidth,
                    opacity: 1,
                } as LineElement;
            } else if (tool === 'arrow') {
                currentElementRef.current = {
                    id: generateId(),
                    type: 'arrow',
                    x1: wp.x,
                    y1: wp.y,
                    x2: wp.x,
                    y2: wp.y,
                    color,
                    lineWidth: strokeWidth,
                    opacity: 1,
                } as ArrowElement;
            } else if (tool === 'text') {
                const text = window.prompt('Enter text:');
                if (text) {
                    const newEl: WhiteboardElement = {
                        id: generateId(),
                        type: 'text',
                        x: wp.x,
                        y: wp.y,
                        text,
                        color,
                        fontSize,
                        opacity: 1,
                    };
                    const updated = [...elements, newEl];
                    setElements(updated);
                    pushHistory(updated);
                }
                isDrawingRef.current = false;
                return;
            } else if (tool === 'sticky') {
                const text = window.prompt('Sticky note text:') ?? '';
                const colors = ['#fef08a', '#86efac', '#93c5fd', '#f9a8d4', '#fdba74'];
                const bgColor = colors[Math.floor(Math.random() * colors.length)];
                const newEl: WhiteboardElement = {
                    id: generateId(),
                    type: 'sticky',
                    x: wp.x,
                    y: wp.y,
                    width: 180,
                    height: 160,
                    text,
                    bgColor,
                    opacity: 1,
                };
                const updated = [...elements, newEl];
                setElements(updated);
                pushHistory(updated);
                isDrawingRef.current = false;
            }
        },
        [tool, color, strokeWidth, fillShape, fontSize, elements, viewTransform, screenToWorld, pushHistory]
    );

    const onMouseMove = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement>) => {
            if (isPanningRef.current) {
                const dx = e.clientX - lastPanPointRef.current.x;
                const dy = e.clientY - lastPanPointRef.current.y;
                lastPanPointRef.current = { x: e.clientX, y: e.clientY };
                setViewTransform((vt) => ({
                    ...vt,
                    offsetX: vt.offsetX + dx,
                    offsetY: vt.offsetY + dy,
                }));
                return;
            }
            if (!isDrawingRef.current || !currentElementRef.current) return;

            const wp = screenToWorld(e.clientX, e.clientY, viewTransform);

            if (tool === 'eraser') {
                const eraseRadius = strokeWidth * 8;
                setElements((prev) =>
                    prev.filter((el) => {
                        if (el.type === 'stroke') {
                            return !el.points.some(
                                (p) =>
                                    Math.hypot(p.x - wp.x, p.y - wp.y) < eraseRadius / viewTransform.scale
                            );
                        }
                        return true;
                    })
                );
                return;
            }

            const el = currentElementRef.current;
            const sp = startPointRef.current;

            if (el.type === 'stroke') {
                (el as StrokeElement).points = [...(el as StrokeElement).points, wp];
            } else if (el.type === 'rectangle') {
                const r = el as RectangleElement;
                r.x = Math.min(sp.x, wp.x);
                r.y = Math.min(sp.y, wp.y);
                r.width = Math.abs(wp.x - sp.x);
                r.height = Math.abs(wp.y - sp.y);
            } else if (el.type === 'circle') {
                const c = el as CircleElement;
                c.rx = Math.abs(wp.x - sp.x) / 2;
                c.ry = Math.abs(wp.y - sp.y) / 2;
                c.cx = (sp.x + wp.x) / 2;
                c.cy = (sp.y + wp.y) / 2;
            } else if (el.type === 'line' || el.type === 'arrow') {
                (el as LineElement).x2 = wp.x;
                (el as LineElement).y2 = wp.y;
            }

            render();
        },
        [tool, strokeWidth, viewTransform, screenToWorld, render]
    );

    const onMouseUp = useCallback(() => {
        if (isPanningRef.current) {
            isPanningRef.current = false;
            return;
        }
        if (!isDrawingRef.current) return;
        isDrawingRef.current = false;

        if (currentElementRef.current) {
            const el = currentElementRef.current;
            let valid = true;
            if (el.type === 'stroke' && (el as StrokeElement).points.length < 2) valid = false;
            if (el.type === 'rectangle') {
                const r = el as RectangleElement;
                if (r.width < 2 && r.height < 2) valid = false;
            }
            if (valid) {
                const updated = [...elements, el];
                setElements(updated);
                pushHistory(updated);
            }
            currentElementRef.current = null;
            render();
        }
    }, [elements, pushHistory, render]);

    const onWheel = useCallback((e: React.WheelEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const ZOOM_FACTOR = 0.001;
        const delta = -e.deltaY * ZOOM_FACTOR;
        setViewTransform((vt) => {
            const newScale = Math.min(10, Math.max(0.05, vt.scale * (1 + delta)));
            const ratio = newScale / vt.scale;
            return {
                scale: newScale,
                offsetX: e.clientX - ratio * (e.clientX - vt.offsetX),
                offsetY: e.clientY - ratio * (e.clientY - vt.offsetY),
            };
        });
    }, []);

    return {
        canvasRef,
        elements,
        tool,
        setTool,
        color,
        setColor,
        strokeWidth,
        setStrokeWidth,
        fillShape,
        setFillShape,
        fontSize,
        setFontSize,
        viewTransform,
        undo,
        redo,
        clearCanvas,
        exportPNG,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onWheel,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
    };
}
