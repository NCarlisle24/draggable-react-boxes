import { useState } from 'react';
import type { BoxCreatorProps } from './BoxCreator.tsx';

export type BoxProps = Omit<BoxCreatorProps, 'onMouseDown'> & {
    boxKey: number,
    x: number,
    y: number,
    z: number,
    onMouseDown: (e: React.MouseEvent, box: BoxProps) => any
};

export default function Box(props: BoxProps) {
    const [cursor, setCursor] = useState<string>("grab");

    const boxStyle = {
        top: props.y,
        left: props.x,
        width: props.width,
        height: props.height,
        backgroundColor: props.color,
        cursor: cursor,
        zIndex: props.z
    };

    const handleMouseDown = (e: React.MouseEvent): void => {
        setCursor("move");
        props.onMouseDown(e, props);
    }

    const handleMouseUp = (e: React.MouseEvent): void => {
        setCursor("grab");
    }

    return (
        <div className="rounded-sm flex flex-col justify-evenly items-center absolute border-2 border-black"
             style={boxStyle} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
        </div>
    )
}