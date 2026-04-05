import mongoose, {Schema,Document,Model} from "mongoose";

interface TsLiabilities{
    rent?: number;
    insuranceDeductibles?: number;
    utilities?: number;
    other?: number;
}

interface TsEconomicProfile{
    income?: number;
    address?: string;
    liabilities?: TsLiabilities;
}

export interface typeUser extends Document{
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
        address:{
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

const userSchema = new Schema<typeUser>(
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

const User: Model<typeUser> = mongoose.models.User || mongoose.model<typeUser>("User",userSchema)

export default User