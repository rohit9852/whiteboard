'use client';

import { useCallback, useRef, useState } from 'react';
import { ViewTransform } from '../types';
import type { WhiteboardPageState } from '../types';
import { useWhiteboard } from './useWhiteboard';

const defaultViewTransform: ViewTransform = {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
};

function createPage(id: string, name: string): WhiteboardPageState {
    return {
        id,
        name,
        elements: [],
        history: [[]],
        historyIndex: 0,
        viewTransform: { ...defaultViewTransform },
    };
}

let pageCounter = 1;

export function useWhiteboardPages() {
    const [pages, setPages] = useState<WhiteboardPageState[]>(() => [
        createPage(`page-${pageCounter++}`, 'Page 1'),
    ]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const currentPageIndexRef = useRef(currentPageIndex);
    currentPageIndexRef.current = currentPageIndex;

    const currentPage = pages[currentPageIndex] ?? pages[0];

    const onStateChange = useCallback((state: Omit<WhiteboardPageState, 'id' | 'name'>) => {
        setPages((prev) => {
            const idx = currentPageIndexRef.current;
            if (idx < 0 || idx >= prev.length) return prev;
            const next = [...prev];
            next[idx] = { ...next[idx], ...state };
            return next;
        });
    }, []);

    const whiteboard = useWhiteboard({
        initialPageState: currentPage,
        onStateChange,
    });

    const addPage = useCallback(() => {
        const newPage = createPage(`page-${pageCounter++}`, `Page ${pages.length + 1}`);
        setPages((prev) => [...prev, newPage]);
        setCurrentPageIndex(pages.length);
    }, [pages.length]);

    const removePage = useCallback((index: number) => {
        if (pages.length <= 1) return;
        setPages((prev) => prev.filter((_, i) => i !== index));
        setCurrentPageIndex((i) => {
            if (i === index) return Math.max(0, index - 1);
            if (i > index) return i - 1;
            return i;
        });
    }, [pages.length]);

    const setPageName = useCallback((index: number, name: string) => {
        setPages((prev) => {
            const next = [...prev];
            if (next[index]) next[index] = { ...next[index], name };
            return next;
        });
    }, []);

    return {
        ...whiteboard,
        pages,
        currentPageIndex,
        setCurrentPageIndex,
        currentPage,
        addPage,
        removePage,
        setPageName,
    };
}
