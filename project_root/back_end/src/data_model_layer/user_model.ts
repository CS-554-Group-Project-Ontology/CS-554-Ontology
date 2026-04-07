import mongoose, {Schema, Document} from "mongoose"; 



// Change the model to use UUID instead of regular 
export interface UserAuthDetails { 
    email: String, 
    password: String, 
    createdAt: Date, 
    role: String, 
    updateAt: Date
}

export interface UserEconomicProfile { 
    income: Number, 
    neighborhood: String, 
    city: String, 
    debt: Number,
}

export interface User extends Document {
    meta_details: UserAuthDetails, 
    economic_profile:  UserEconomicProfile,  
} 

export const UserSchema = new Schema<User>({ 
    meta_details:{ 
        email:{
            type: String,
            trim: true, 
            required: true
        }, 
        password:{
            String, 
            trim: true, 
            required: true 
        },
        role:{ 
            type: String, 
            trim: true, 
            enum: ['regular_user','admin_user']
        }, 
    },
    economic_profile:{ 
        income:{
            Number,
            min: 0,
        }, 
        neighborhood:{
            String,
            trim: true,
        }, 
        city:{
            String,
            trim: true 
        }, 
        debt:{
            Number, 
            min: 0 
        } ,
    }, 
    
},{
    timestamps: true, 
    collection: 'Users_collection'

},

)


const UserModel = mongoose.model<User>("User", UserSchema )

export default UserModel; 