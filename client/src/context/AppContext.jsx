import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AppContext = createContext()

const AppContextProvider = (props)=>{
    const [user,setUser] = useState(true)
    //Here we add a state variable for cross_icon in Login page
    const [showLogin,setShowLogin] = useState(false)
    //Backend State variable
    const [token,setToken] = useState(localStorage.getItem('token'))
    const [credit,setCredit] = useState(false)

    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const navigate = useNavigate()

    //Here we create a functionality for load credit
    const loadCreditsData = async () => {
        try {

            const {data} = await axios.get(backendUrl + '/api/user/credits', {headers: {token}})

            if (data.success) {
                setCredit(data.credits)
                setUser(data.user)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    //Here we create Image generator functionality
    const generateImage = async (prompt) => {
        try {

            const {data} = await axios.post(backendUrl + '/api/image/generate-image', {prompt}, {headers: {token}})

            if (data.success) {
                loadCreditsData()
                return data.resultImage
            } else {
                toast.error(data.message)
                loadCreditsData()
                if (data.creditBalance === 0) {
                    navigate('buy')
                }
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Here We Create a logout functionality
    const logout = ()=>{
        localStorage.removeItem('token')
        setToken('')
        setUser(null)
    }

    useEffect(()=>{
        if (token) {
         loadCreditsData()   
        }
    },[token])

    const value = {
        user,setUser,
        showLogin,setShowLogin,
        backendUrl,
        token,setToken,
        credit,setCredit,
        logout,loadCreditsData,
        generateImage
    }

    return (
        <AppContext.Provider value={value}>
           {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider