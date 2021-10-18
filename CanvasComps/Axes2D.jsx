import React, { useState, useRef, useEffect, useCallback } from 'react';

import { atom, useAtom } from 'jotai';

export default function Axes2D({
    addFunc,
    removeFunc,
    boundsAtom,
    color = '#000000', //'#006E31', //'#8BC34A',
    lineWidth = 1,
    showLabels = true,
    labelEps = 0.5,
    xLabel = 'x',
    yLabel = 'y',
    canvasWidth = 1024,
    canvasHeight = 1024
}) {
    //console.log('axes2drecoil called');

    const bounds = useAtom(boundsAtom)[0];

    const [ctx] = useState(document.createElement('canvas').getContext('2d'));

    useEffect(() => {
        if (!ctx) return;

        ctx.canvas.width = canvasWidth;
        ctx.canvas.height = canvasHeight;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
    }, [ctx, canvasWidth, canvasHeight, color, lineWidth]);

    const clearCanvas = useCallback(() => {
        if (!ctx) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }, [ctx]);

    useEffect(() => {
        clearCanvas();

        const { xMin, xMax, yMin, yMax } = bounds;

        const xRange = xMax - xMin;
        const yRange = yMax - yMin;

        const h = ctx.canvas.height;
        const w = ctx.canvas.width;

        // scene to canvas
        const stc = (x, y) => [((x - xMin) / xRange) * w, (1 - (y - yMin) / yRange) * h];

        const oldColor = ctx.strokeStyle;
        ctx.strokeStyle = color;

        //ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        //console.log('Axes2DC with non-null ctx; color is ', color);

        if (showLabels) {
            const oldFont = ctx.font;
            ctx.font = '3em sans-serif';

            const oldColor = ctx.fillStyle;
            ctx.fillStyle = color;

            const xCoords = stc(xMax - labelEps, -labelEps);
            ctx.fillText(xLabel, xCoords[0], xCoords[1]);

            const yCoords = stc(-labelEps, yMax - labelEps);
            ctx.fillText(yLabel, yCoords[0], yCoords[1]);

            ctx.font = oldFont;
            ctx.fillStyle = oldColor;
        }

        const oldLineWidth = ctx.lineWidth;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.moveTo(...stc(xMin, 0));
        ctx.lineTo(...stc(xMax, 0));
        ctx.stroke();

        ctx.moveTo(...stc(0, yMin));
        ctx.lineTo(...stc(0, yMax));
        ctx.stroke();

        for (let i = xMin - 1; i < xMax; i++) {
            // make sphere here
        }

        ctx.strokeStyle = oldColor;
        ctx.lineWidth = oldLineWidth;

        addFunc(ctx);

        return () => {
            if (ctx) removeFunc(ctx);
        };
    }, [bounds, ctx, showLabels, addFunc, removeFunc]);

    return null;
}
