import Image from "next/image"

export default function Loading() {
    return (
        <div style={{'position': 'absolute', 'top': '0', 'bottom': '0', 'left': '0', 'right': '0', 'display': 'grid', 'placeItems': 'center'}}>
            <Image src="/loading.gif" alt="loading" height={200} width={200}/>
        </div>
    );
}