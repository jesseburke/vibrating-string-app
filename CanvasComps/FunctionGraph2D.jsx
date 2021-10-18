import React, { useState, useRef, useEffect, useCallback } from 'react';
import { atom, useAtom } from 'jotai';

import { FunctionGraphPts2D } from '@jesseburke/math-utils';

// compArray is an array of arrays; each array is a chain of points to be drawn
export default function FunctionGraph2D({
    funcAtom,
    boundsAtom,
    color = '#800000',
    //color = '#8BC34A',
    lineWidth = 5,
    addFunc,
    removeFunc,
    canvasWidth = 1024,
    canvasHeight = 1024
}) {
    const [ctx] = useState(document.createElement('canvas').getContext('2d'));

    const [compArray, setCompArray] = useState();

    const bounds = useAtom(boundsAtom)[0];

    const func = useAtom(funcAtom)[0].func;

    useEffect(() => {
        if (!ctx) return;

        ctx.canvas.width = canvasWidth;
        ctx.canvas.height = canvasHeight;
    }, [ctx]);

    useEffect(() => {
        if (!ctx) return;

        ctx.strokeStyle = color;
    }, [color, ctx]);

    useEffect(() => {
        if (!ctx) return;

        ctx.lineWidth = lineWidth;
    }, [lineWidth, ctx]);

    useEffect(() => {
        const newBounds = { ...bounds, yMin: bounds.zMin, yMax: bounds.zMax };

        setCompArray(FunctionGraphPts2D({ func, bounds: newBounds }));
    }, [func, bounds]);

    const clearCanvas = useCallback(() => {
        if (!ctx) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }, [ctx]);

    useEffect(() => {
        if (!compArray || compArray.length === 0) return;

        clearCanvas();

        const { xMin, xMax, zMin, zMax } = bounds;

        const xRange = xMax - xMin;
        const zRange = zMax - zMin;

        const h = ctx.canvas.height;
        const w = ctx.canvas.width;

        const stc = ([x, z]) => [((x - xMin) / xRange) * w, (1 - (z - zMin) / zRange) * h];

        let curArray, l;

        for (let i = 0; i < compArray.length; i++) {
            curArray = compArray[i];
            l = curArray.length;

            ctx.beginPath();
            ctx.moveTo(...stc(curArray[0]));

            for (let i = 1; i < l; i++) {
                ctx.lineTo(...stc(curArray[i]));
            }
            ctx.stroke();
        }
        addFunc(ctx);

        return () => {
            if (ctx) removeFunc(ctx);
        };
    }, [compArray, bounds, clearCanvas, ctx, addFunc, removeFunc]);

    return null;
}
