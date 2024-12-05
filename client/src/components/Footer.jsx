import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className=' flex items-center justify-between gap-4 py-3 mt-20'>

       <img src={assets.logo} alt="logo" width={150} />

       <p className=' flex-1 border-l border-gray-400 pl-4 text-sm text-gray-500 max-sm:hidden'>Copyright &copy;Mayank | All right reserved.</p>

       {/*</div><div className=' flex gap-2.5 fixed bottom-0 items-center py-5 px-5 right-0'>*/}
       <div className=' flex gap-2.5'>
        <img src={assets.facebook_icon} alt="facebook_icon" width={35} />
        <img src={assets.twitter_icon} alt="twitter_icon" width={35} />
        <img src={assets.instagram_icon} alt="instagram_icon" width={35} />
       </div>
      
    </div>
  )
}

export default Footer
