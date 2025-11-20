import React from "react"
import { Icon } from "@chakra-ui/react"
import * as Unicons from "@iconscout/react-unicons"

const UniIcon = ({ icon, size = "24px", color = "currentColor", ...props }) => {
    const IconComponent = Unicons[icon]
    if (!IconComponent) return null
    return (
        <Icon
            as={IconComponent}
            boxSize={size}
            color={color}
            _hover={{ color: 'primary.default', transition: 'all 0.2s ease-in-out' }}
            {...props}
        />
    )
}

export default UniIcon
