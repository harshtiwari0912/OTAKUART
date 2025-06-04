const mongoose = require('mongoose');
const userSchema = mongoose.Schema(
    {
        fullname:String,
        email:String,
        password:String,
        cart:
        {
            type:Array,
            default:[]
        },
        isadmin:
        {
            type:Boolean,
            default:false
        },
        orders:
        {
            type:Array,
            default:[]
        },
        contact : Number,
        picture:
        {
            type:String,
        }
    }
)
module.exports = mongoose.model('user',userSchema); 