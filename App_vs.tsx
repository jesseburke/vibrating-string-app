import React, { useState, useRef, useEffect, useCallback } from 'react';

import { Provider as JotaiProvider } from 'jotai';

import * as THREE from 'three';

import './styles.css';

import { ThreeSceneComp } from '@jesseburke/three-scene-with-react';
import CanvasComp from './CanvasComps/CanvasComp.jsx';
import Axes2DCanv from './CanvasComps/Axes2D.jsx';
import FunctionGraph2D from './CanvasComps/FunctionGraph2D.jsx';

import { OptionsTabComp } from '@jesseburke/components';

import { Grid } from '@jesseburke/three-scene-with-react';
import { Plane } from '@jesseburke/three-scene-with-react';
import { Axes3D } from '@jesseburke/three-scene-with-react';
import { FunctionGraph3D } from '@jesseburke/three-scene-with-react';
import { CameraControls } from '@jesseburke/three-scene-with-react';

import {
    boundsData,
    canvasBoundsAtom,
    gridBoundsAtom,
    funcData,
    twoDFuncAtom,
    labelData,
    axesData,
    cameraData,
    animationData,
    planeHeightAndWidthAtom,
    planeCenterAtom,
    DataComp
} from './App_vs_atoms';

const initControlsData = {
    mouseButtons: { LEFT: THREE.MOUSE.ROTATE },
    touches: { ONE: THREE.MOUSE.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN },
    enableRotate: true,
    enablePan: true,
    enabled: true,
    keyPanSpeed: 50,
    screenSpacePanning: false
};

const fixedCameraData = {
    up: [0, 0, 1],
    near: 0.1,
    far: 100,
    orthographic: false
};

const btnClassStr =
    'absolute left-8 p-2 border med:border-2 rounded-md border-solid border-persian_blue-900 bg-gray-200 cursor-pointer text-lg';

const saveBtnClassStr = btnClassStr + ' bottom-24';

const resetBtnClassStr = btnClassStr + ' bottom-8';

const canvasClassStr = 'absolute left-1/2 w-6/12 h-full block border-l-2 border-white';

//------------------------------------------------------------------------

export default function App() {
    return (
        <JotaiProvider>
            <div className='full-screen-base'>
                <header
                    className='control-bar bg-royalblue-900 font-sans
		    p-8 text-white'
                >
                    <funcData.component />
                    <animationData.component />
                    <OptionsTabComp
                        className={'w-32 bg-gray-50 text-persian_blue-900 p-2 rounded'}
                        nameComponentArray={[
                            ['Bounds', boundsData.component],
                            ['Camera', cameraData.component]
                        ]}
                    />
                </header>

                <main className='flex-grow relative p-0'>
                    <ThreeSceneComp
                        halfWidth={true}
                        fixedCameraData={fixedCameraData}
                        controlsData={initControlsData}
                    >
                        <Axes3D
                            boundsAtom={boundsData.atom}
                            axesDataAtom={axesData.atom}
                            labelAtom={labelData.atom}
                        />
                        <Grid boundsAtom={gridBoundsAtom} gridShow={true} />
                        <FunctionGraph3D
                            funcAtom={funcData.funcAtom}
                            boundsAtom={boundsData.atom}
                            meshNormal={true}
                        />
                        <Plane
                            heightAndWidthAtom={planeHeightAndWidthAtom}
                            centerAtom={planeCenterAtom}
                        />
                        <CameraControls cameraDataAtom={cameraData.atom} />
                    </ThreeSceneComp>
                    <CanvasComp classStr={canvasClassStr}>
                        <Axes2DCanv boundsAtom={canvasBoundsAtom} lineWidth={5} yLabel='z' />
                        <FunctionGraph2D funcAtom={twoDFuncAtom} boundsAtom={boundsData.atom} />
                    </CanvasComp>
                    <DataComp
                        resetBtnClassStr={resetBtnClassStr}
                        saveBtnClassStr={saveBtnClassStr}
                    />
                </main>
            </div>
        </JotaiProvider>
    );
}
