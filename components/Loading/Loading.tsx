import { useEffect, useState } from "react"

import style from './Loading.module.css'
const Loading = () => {
    const [dots, setDots] = useState('.')

    useEffect(() => {
        setTimeout(() => {
            setDots(dots+'.')
        }, 300)
    }, [dots])

    return (
        <div className={style.Loading}>
            <span>Loading</span><span>{dots}</span>
        </div>
    )
}

export default Loading