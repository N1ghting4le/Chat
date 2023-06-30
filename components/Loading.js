import Image from "next/image"

export default function Loading() {
    return <Image src="/spinner.svg" alt="spinner" height={45} width={45}/>
}