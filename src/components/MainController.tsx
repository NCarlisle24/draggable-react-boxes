import { useState, useRef, useEffect } from 'react';

import Box from './Box.tsx';
import type { BoxProps } from "./Box.tsx";
import BoxCreator from './BoxCreator.tsx';
import type { BoxCreatorProps } from "./BoxCreator.tsx";
import BoxCreatorMenu from "./BoxCreatorMenu.tsx";

type BoxType = BoxProps;
type BoxCreatorType = BoxCreatorProps;

export default function MainController() {
    const [boxCreators, setBoxCreators] = useState<BoxCreatorType[]>([]);
    const [boxes, setBoxes] = useState<BoxType[]>([]);
    const [creatorSidebarZ, setCreatorSidebarZ] = useState<number>(1000);

    const boxCreatorsRef: React.RefObject<BoxCreatorType[]> = useRef(boxCreators);
    const boxesRef: React.RefObject<BoxType[]> = useRef(boxes);
    const numBoxesCreated: React.RefObject<number> = useRef(0);
    const numBoxCreatorsCreated: React.RefObject<number> = useRef(0);
    const highestZ: React.RefObject<number> = useRef(0);

    const [isCreatorMenuVisible, setCreatorMenuVisibility] = useState<boolean>(false);

    const boxAreaRef: React.RefObject<HTMLDivElement | null> = useRef(null);

    useEffect(() => { boxesRef.current = boxes }, [boxes]); // useState is asynchronous, so need this to get boxes at any time
    useEffect(() => { boxCreatorsRef.current = boxCreators }, [boxCreators]);

    const getNextZ = (): number => {
        return ++highestZ.current;
    }

    const convertWindowPosToBoxAreaPos = (x: number, y: number): [number, number] => {
        if (!boxAreaRef.current) return [-1, -1];
        const rect = boxAreaRef.current.getBoundingClientRect();
        return [x - rect.left, y - rect.top];
    };

    const getBoxIndex = (key: number): number => {
        return boxesRef.current.findIndex(box => box.boxKey == key);
    };

    const createBox = (box: BoxType): number => {
        const key = numBoxesCreated.current
        numBoxesCreated.current++;

        box.boxKey = key;
        box.z = getNextZ();
        box.onMouseDown = handleMouseDownOnBox;

        setBoxes((prevBoxes: BoxType[]): BoxType[] => {
            const newBoxes = [...prevBoxes, box];
            return newBoxes;
        });

        return key;
    }

    const createBoxCreator = (creator: BoxCreatorType): number => {
        const key = numBoxCreatorsCreated.current;
        numBoxCreatorsCreated.current++;

        creator.boxCreatorKey = key;
        creator.onMouseDown = handleMouseDownOnBoxCreator;

        setBoxCreators((prevCreators: BoxCreatorType[]): BoxCreatorType[] => {
            const newCreators = [...prevCreators, creator];
            return newCreators;
        });

        return key;
    }

    const removeBox = (key: number): void => {
        const boxIndex = getBoxIndex(key);
        if (boxIndex < 0) return;

        setBoxes((prevBoxes: BoxType[]) => {
            const newBoxes = [...prevBoxes];
            newBoxes.splice(boxIndex, 1);
            return newBoxes;
        });
    }

    const repositionBox = (key: number, x: number, y: number): void => {
        const boxIndex = getBoxIndex(key);
        if (boxIndex < 0) return;

        setBoxes((prevBoxes: BoxType[]) => {
            const newBoxes = [...prevBoxes]; // need a new reference or else react won't trigger a render
            newBoxes[boxIndex].x = x;
            newBoxes[boxIndex].y = y;
            return newBoxes;
        });
    }

    const setBoxZ = (key: number, z: number): void => {
        const boxIndex = getBoxIndex(key);
        if (boxIndex < 0) return;

        setBoxes((prevBoxes: BoxType[]) => {
            const newBoxes = [...prevBoxes];
            newBoxes[boxIndex].z = z;
            return newBoxes;
        });
    }

    // cancerous functional programming
    const handleMouseDownOnBox = (e: React.MouseEvent, box: BoxType) => {
        // if (isCreatorMenuVisible) return;

        const [startMouseX, startMouseY] = convertWindowPosToBoxAreaPos(e.clientX, e.clientY);
        const [startBoxX, startBoxY] = [box.x, box.y];

        const handleMouseMove = (e: MouseEvent) => {
            const [currentMouseX, currentMouseY] = convertWindowPosToBoxAreaPos(e.clientX, e.clientY);
            const newBoxX = startBoxX + (currentMouseX - startMouseX);
            const newBoxY = startBoxY + (currentMouseY - startMouseY);
            repositionBox(box.boxKey, newBoxX, newBoxY);
        }

        const handleMouseUp = (e: MouseEvent) => {
            const [currentMouseX, currentMouseY] = convertWindowPosToBoxAreaPos(e.clientX, e.clientY);
            if (currentMouseX < 0 || currentMouseY < 0) {
                removeBox(box.boxKey);
            }

            setCreatorSidebarZ(1000);

            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        const sidebarZ = getNextZ();
        const boxZ = getNextZ();
        setCreatorSidebarZ(sidebarZ);
        setBoxZ(box.boxKey, boxZ);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    // z index isn't set properly when this function is called
    // (race condition between native and react synthetic events???)
    const handleMouseDownOnBoxCreator = (e: React.MouseEvent, boxCreator: BoxCreatorType, boxX: number, boxY: number) => {
        // if (isCreatorMenuVisible) return;
        const boxProps = { ...boxCreator } as BoxType; // need a clone, not a reference
        [boxProps.x, boxProps.y] = convertWindowPosToBoxAreaPos(boxX, boxY);
        createBox(boxProps);

        handleMouseDownOnBox(e, boxProps);
    }

    const makeCreatorMenuVisible = () => {
        setCreatorMenuVisibility(true);
    }

    const makeCreatorMenuInvisible = () => {
        setCreatorMenuVisibility(false);
    }

    const creatorSidebarStyle = {
        zIndex: creatorSidebarZ
    };

    return (
        <>
            <BoxCreatorMenu isVisible={isCreatorMenuVisible} makeInvisible={makeCreatorMenuInvisible}
                            createBoxCreator={createBoxCreator} />
            <div className="grid grid-cols-3 grid-rows-1 h-screen">
                <div className="col-span-1 border-2 flex flex-col bg-gray-200" style={creatorSidebarStyle}>
                    <div className="flex flex-col grow">
                        {boxCreators.map((boxCreator) => <BoxCreator key={boxCreator.boxCreatorKey} {...boxCreator} />)}
                    </div>
                    <div className="flex flex-col">
                        <button onClick={makeCreatorMenuVisible} className="cursor-pointer">Add a box</button>
                        <button onClick={() => {
                            console.log("current box creators = " + JSON.stringify(boxCreatorsRef.current));
                        }}>Debug button</button>
                    </div>
                </div>
                <div className="col-span-2 relative" ref={boxAreaRef}>
                    {boxes.map((box) => <Box key={box.boxKey} {...box} />)}
                </div>
            </div>
        </>
    );
}