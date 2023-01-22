import {Box} from "@mui/material"
import {styled} from "@mui/system"

const FlexBetween = styled(Box)({
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center"
})

export default FlexBetween

//Allows us to reuse styled components to pass around commonly used styles