import { useRef } from 'react';

export type BoxCreatorMinProps = {
    width: number,
    height: number,
    color: string
}

export type BoxCreatorProps = BoxCreatorMinProps & {
    boxCreatorKey: number,
    onMouseDown: (e: React.MouseEvent, boxCreator: BoxCreatorProps, boxX: number, boxY: number) => any
}

export default function BoxCreator(props: BoxCreatorProps) {
    const boxCreatorRef: React.RefObject<HTMLDivElement | null> = useRef(null);

    const boxStyle = {
        width: props.width,
        height: props.height,
        backgroundColor: props.color
    };

    const handleMouseDown = (e: React.MouseEvent): void => {
        const creatorRect = boxCreatorRef.current!.getBoundingClientRect();
        const creatorX = creatorRect.left;
        const creatorY = creatorRect.top;
        props.onMouseDown(e, props, creatorX, creatorY);
    }

    return (
        <div className="rounded-sm flex flex-col cursor-grab justify-evenly items-center border-2 border-black"
             style={boxStyle} onMouseDown={handleMouseDown} ref={boxCreatorRef}>
        </div>
    )
}