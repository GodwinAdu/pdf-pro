import React from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

const ConfettiComponent = () => {
    const { width, height } = useWindowSize()
    return (
        <Confetti
            numberOfPieces={200}
            width={width}
            height={height}
            
        />
    )
}

export default ConfettiComponent
