import React, { useState, useRef, useEffect, useCallback } from 'react';

// compArray is an array of arrays; each array is a chain of points to be drawn
export default function CurvedPath({
    compArray,
    bounds,
    color = '#8BC34A',
    lineWidth = 1,
    addFunc,
    removeFunc
}) {
    const [ctx] = useState(document.createElement('canvas').getContext('2d'));

    useEffect(() => {
        if (!ctx) return;

        ctx.canvas.width = 1024;
        ctx.canvas.height = 1024;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
    }, []);

    console.log('CurvedPathComp called with bounds = ', bounds);

    useEffect(() => {
        // should clear context here
        const { xMin, xMax, zMin, zMax } = bounds;

        const xRange = xMax - xMin;
        const zRange = zMax - zMin;

        const h = ctx.canvas.height;
        const w = ctx.canvas.width;

        const stc = ([x, z]) => [((x - xMin) / xRange) * w, (1 - (z - zMin) / zRange) * h];

        const oldColor = ctx.strokeStyle;
        ctx.strokeStyle = color;
        const oldLineWidth = ctx.lineWidth;
        ctx.lineWidth = lineWidth;

        let curve, curArray, nextPt, l, tempD;

        for (let i = 0; i < compArray.length; i++) {
            curArray = compArray[i];
            l = curArray.length;

            ctx.beginPath();
            ctx.moveTo(...stc(curArray[0]));

            for (let i = 1; i < l; i++) {
                ctx.lineTo(...stc(curArray[i]));
            }

            //ctx.closePath();
            ctx.stroke();
        }
        addFunc(ctx);

        return () => {
            if (ctx) removeFunc(ctx);
        };
    });

    return null;
}
