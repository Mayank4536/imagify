import jwt from 'jsonwebtoken'

const userAuth = async (req, res, nexxt) => {
    const {token} = req.headers

    if (!token) {
        return res.json({success:false, message: 'Not Authorized. Login Again'})
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)

        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id
        } else {
            return res.json({ success:false, message:'NOT Authorized. Login Again'})
        }

        nexxt()

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

export default userAuth