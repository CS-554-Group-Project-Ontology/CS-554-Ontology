import mongoose, {Schema,Document,Model} from "mongoose";

interface TsLiabilities{
    rent?: number;
    insuranceDeductibles?: number;
    utilities?: number;
    other?: number;
}

interface TsEconomicProfile{
    income?: number;
    city?: string;
    neighborhood?: string;
    liabilities?: TsLiabilities;
}

export interface TypeUser extends Document{
        UUID: string;
        economic_profile?: TsEconomicProfile;
        createdAt: Date;
        updatedAt: Date;
}

const liabilitySchema = new Schema<TsLiabilities>(
    {
        rent: {
            type: Number,
            min:0
        },
        insuranceDeductibles: {
            type: Number,
            min:0
        },
        utilities: {
            type: Number,
            min:0
        },
        other: {
            type: Number,
            min:0
        },
    },
    {_id:false}
);

const economicProfileSchema = new Schema<TsEconomicProfile>(
    {
        income: {
            type: Number,
            min:0,
        },
        city:{
            type: String,
            trim: true
        },
        neighborhood:{
            type: String,
            trim: true
        },
        liabilities:{
            type: liabilitySchema,
            default: {}
        },
    },
    {_id:false}
);

const userSchema = new Schema<TypeUser>(
    {
        UUID: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        economic_profile: {
            type: economicProfileSchema,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

const User: Model<TypeUser> = mongoose.models.User || mongoose.model<TypeUser>("User",userSchema)

export default User