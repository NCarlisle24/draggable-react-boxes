import type { BoxCreatorProps } from './BoxCreator.tsx';

type BoxCreatorMenuProps = {
    isVisible: boolean,
    makeInvisible: () => any,
    createBoxCreator: (creatorProps: BoxCreatorProps) => any
};

export default function BoxCreatorMenu(props: BoxCreatorMenuProps) {
    const overlayStyle: React.CSSProperties = {
        visibility: props.isVisible ? "visible" : "hidden",
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newBoxCreator = {
            width: parseInt(e.target[0].value),
            height: parseInt(e.target[1].value),
            color: e.target[2].value,
        };

        props.createBoxCreator(newBoxCreator);
        props.makeInvisible();
    }

    return (
        <div className="fixed w-full h-full top-0 left-0 right-0 bottom-0 backdrop-blur-sm z-10000 flex items-center justify-center" style={overlayStyle}>
            <div className="w-100 h-100 bg-gray-300">
                <button onClick={props.makeInvisible} className="cursor-pointer">Close</button>
                <form onSubmit={handleSubmit}>
                    <label>
                        Width: 
                        <input type="number" name="width"></input>
                    </label>
                    <br />
                    <label>
                        Height: 
                        <input type="number" name="height"></input>
                    </label>
                    <br />
                    <label>
                        Color: 
                        <input type="color" name="color"></input>
                    </label>
                    <br />
                    <button type="submit" className="cursor-pointer">Submit</button>
                </form>
            </div>
        </div>
    )
}