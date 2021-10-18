import { atom } from 'jotai';

import { MainDataComp } from '@jesseburke/jotai-data-setup';
import { LabelDataComp } from '@jesseburke/jotai-data-setup';
import { FunctionDataComp } from '@jesseburke/jotai-data-setup';
import { AxesDataComp } from '@jesseburke/jotai-data-setup';
import { BoundsDataComp } from '@jesseburke/jotai-data-setup';
import { AnimationData } from '@jesseburke/jotai-data-setup';
import { PerspCameraData } from '@jesseburke/jotai-data-setup';

import { ObjectPoint2, Bounds, CurveData2, LabelStyle, AxesDataT } from '../../my-types';

//------------------------------------------------------------------------
//
// initial constants

const colors = {
    arrows: '#B01A46', //'#C2374F'
    solutionCurve: '#4e6d87', //'#C2374F'
    tick: '#cf6c28' //#e19662'
};

const initBounds: Bounds = { xMin: -1, xMax: 30, yMin: -10, yMax: 10, zMin: -5, zMax: 5 };

const initFuncStr: string = '4*e^(-(x-2*t^2)^2)+sin(x+t)-cos(x-t)'; //'4*e^(-(x-2*t)^2)+sin(x+t)-cos(x-t)';

const initAxesData: AxesDataT = {
    radius: 0.02,
    show: true,
    tickLabelDistance: 0
};

const initXLength = initBounds.xMax - initBounds.xMin;
const initYLength = initBounds.yMax - initBounds.yMin;

const initCameraData = {
    target: [5.06, 1.65, 0],
    //[initXLength * (10.15 / 20), initYLength * (4.39 / 20), 0],
    position: [-19.73, -22.32, 24.65] //[(-16.7 / 20) * initXLength, (-26.1 / 20) * initYLength, 6.65]
};

export const labelStyle: LabelStyle = {
    color: 'black',
    padding: '.1em',
    margin: '.5em',
    fontSize: '1.5em'
};

const tickLabelStyle = Object.assign(Object.assign({}, labelStyle), {
    fontSize: '1.5em',
    color: colors.tick
});

//------------------------------------------------------------------------
//
// atoms

export const labelData = LabelDataComp({ yLabel: 't', twoD: true });
export const axesData = AxesDataComp({
    ...initAxesData,
    tickLabelStyle
});

const functionLabelAtom = atom(
    (get) => 's(' + get(labelData.atom).x + ', ' + get(labelData.atom).y + ') = '
);

export const funcData = FunctionDataComp({
    initVal: initFuncStr,
    functionLabelAtom,
    labelAtom: labelData.atom,
    inputSize: 40
});

export const boundsData = BoundsDataComp({
    initBounds,
    labelAtom: labelData.atom
});

const xCanvOverhang = 0;

export const canvasBoundsAtom = atom((get) => {
    const { xMin, xMax, zMin, zMax } = get(boundsData.atom);

    return {
        xMin: xMin - xCanvOverhang,
        xMax,
        yMin: zMin,
        yMax: zMax
    };
});

const gridOverhang = 2;

export const gridBoundsAtom = atom((get) => {
    const { xMin, xMax, yMin, yMax } = get(boundsData.atom);

    return {
        xMin: xMin - gridOverhang,
        xMax: xMax + gridOverhang,
        yMin: yMin - gridOverhang,
        yMax: yMax + gridOverhang
    };
});

export const animationData = AnimationData({
    minMaxAtom: atom((get) => {
        return { min: get(boundsData.atom).yMin, max: get(boundsData.atom).yMax };
    })
});

export const animationValueAtom = atom((get) => get(animationData.atom).t);

const planeOverhang = 0;

export const planeHeightAndWidthAtom = atom((get) => {
    const { xMin, xMax, zMin, zMax } = get(boundsData.atom);

    return { width: xMax - xMin + planeOverhang, height: zMax - zMin };
});

export const planeCenterAtom = atom((get) => {
    const { xMin, xMax } = get(boundsData.atom);

    return [(xMax - xMin) / 2 + xMin, get(animationValueAtom)];
});

export const twoDFuncAtom = atom((get) => {
    const t = get(animationValueAtom);

    return { func: (x) => get(funcData.funcAtom).func(x, t) };
});

export const cameraData = PerspCameraData(initCameraData);

export const atomStoreAtom = atom({
    ls: labelData.readWriteAtom,
    ax: axesData.readWriteAtom,
    fn: funcData.readWriteAtom,
    bd: boundsData.readWriteAtom,
    cd: cameraData.readWriteAtom,
    ad: animationData.readWriteAtom
});

export const DataComp = MainDataComp(atomStoreAtom);
