import React, {useState, useEffect, useRef} from "react";
import "./space.css";
import space1 from "../../img/space/space1.png";
import space2 from "../../img/space/space2.png";
import space5 from "../../img/space/space5.png";
import space6 from "../../img/space/space6.png";

function Space() {
    const [currentSpace, setCurrentSpace] = useState(space1);
    const images = [space1, space2, space5, space6];
    const currentIndexRef = useRef(0);
    const spaceBlockRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            currentIndexRef.current = (currentIndexRef.current + 1) % images.length;
            setCurrentSpace(images[currentIndexRef.current]);
        }, 150);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const spaceBlock = spaceBlockRef.current;
        if (spaceBlock) {
            const animationInterval = setInterval(() => {
                spaceBlock.classList.add('animation');
                setTimeout(() => {
                    spaceBlock.classList.remove('animation');
                }, 750);
            }, 1500);

            return () => clearInterval(animationInterval);
        }
    }, []);

    return (
        <div ref={spaceBlockRef} className="spaceBlock">
            {images.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt="Space"
                    className={image === currentSpace ? "active" : ""}
                />
            ))}
        </div>
    );
}

export default Space;


