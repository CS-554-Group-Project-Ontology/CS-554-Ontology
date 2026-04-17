import { GraphQLError } from 'graphql';
import mongoose from 'mongoose';
import User from "../data_model_layer/User.ts";
import type { typeUser } from "../data_model_layer/User.ts"
import { verifyFirebaseToken } from '../Config/FirebaseAdmin.ts';

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

type ResolverContext = {
    token: string;
}

export const userResolver = {
    Query:{
        users: async() =>{
            const cache = await User.find()
            if (cache.length==0){
                throw new GraphQLError("Users Not Found"),{
                    extensions: {code: 'NOT_FOUND'}
                }
            }
            return await User.find()
        },
        //Change getUserByID to using UUID
        getUserByID: async (_:unknown, context: ResolverContext) => {
            console.log("getUser resolver hit");
            if (!context.token){
                throw new GraphQLError('Unauthorized',{
                    extensions: {code: 'INVALID_ACCESS'}
                });
            }
            const decodedToken = await verifyFirebaseToken(context.token);
            const UUID = decodedToken.uid;

            const found = await User.find({UUID: UUID})

            if (!found){
                throw new GraphQLError("User Not Found",{
                    extensions: {code: 'NOT_FOUND'}
                });
            }

            return found;
        }
    },

    Mutation: {
        addUser: async(_:unknown,__:unknown,context: ResolverContext) =>{
            console.log("register resolver hit");
            console.log("incoming args:", args);
            if (!context.token){
                throw new GraphQLError('Unauthorized',{
                    extensions: {code: 'INVALID_ACCESS'}
                });
            }
            const decodedToken = await verifyFirebaseToken(context.token);
            const UUID = decodedToken.uid;

            let inputUser: Partial<typeUser> = {
                UUID,
            };
            const resultUser = new User(inputUser);
            await resultUser.save();
            return resultUser;
        },
        
        editUser: async(_:unknown,args:{economic_profile: TsEconomicProfile}, context: ResolverContext) => {

            console.log("edit resolver hit");
            console.log("incoming args:", args);
            
            if (!context.token){
                throw new GraphQLError('Unauthorized',{
                    extensions: {code: 'INVALID_ACCESS'}
                });
            }
            const decodedToken = await verifyFirebaseToken(context.token);
            const UUID = decodedToken.uid;

            let inputUser: Record<string,unknown> = {};

            if(args.economic_profile){
                const econProf = args.economic_profile;
                if(econProf.income !== undefined){
                    if(typeof econProf.income !== 'number' || econProf.income<0 || Number.isNaN(econProf.income)){
                        throw new GraphQLError('Invalid Income Input',{
                            extensions: {code: 'BAD_USER_INPUT'}
                        });
                    }
                    inputUser["economic_profile.income"] = econProf.income;
                }
                if(econProf.address !== undefined){
                    if(typeof econProf.address !== 'string' || econProf.address.trim().length === 0){
                        throw new GraphQLError('Invalid Address Input',{
                            extensions: {code: 'BAD_USER_INPUT'}
                        });
                    }
                    const cleanAddress= econProf.address.trim();

                    inputUser["economic_profile.address"] = cleanAddress;
                }
                if(econProf.liabilities !== undefined){
                    const debt = econProf.liabilities; 
                    if (debt.insuranceDeductibles !== undefined){
                        if(typeof debt.insuranceDeductibles !== 'number' || debt.insuranceDeductibles<0 || Number.isNaN(debt.insuranceDeductibles)){
                            throw new GraphQLError('Invalid Insurance Deductible Input',{
                                extensions: {code: 'BAD_USER_INPUT'}
                            });
                        }
                        inputUser["economic_profile.liabilities.insuranceDeductibles"] = debt.insuranceDeductibles;
                    }
                    
                    if (debt.rent !== undefined){
                        if(typeof debt.rent !== 'number' || debt.rent<0 || Number.isNaN(debt.rent)){
                            throw new GraphQLError('Invalid Rent Input',{
                                extensions: {code: 'BAD_USER_INPUT'}
                            });
                        }
                        inputUser["economic_profile.liabilities.rent"] = debt.rent;
                    }
                    
                    if(debt.utilities !== undefined){
                        if(typeof debt.utilities !== 'number' || debt.utilities<0 || Number.isNaN(debt.utilities)){
                            throw new GraphQLError('Invalid Utilities Input',{
                                extensions: {code: 'BAD_USER_INPUT'}
                            });
                        }
                        inputUser["economic_profile.liabilities.utilities"] = debt.utilities;
                    }
                    
                    if(debt.other !== undefined){
                        if(typeof debt.other !== 'number' || debt.other<0 || Number.isNaN(debt.other)){
                            throw new GraphQLError('Invalid Other Input',{
                                extensions: {code: 'BAD_USER_INPUT'}
                            });
                        }
                        inputUser["economic_profile.liabilities.other"] = debt.other;
                    }
                }
            }
            if (Object.keys(inputUser).length===0){
                throw new GraphQLError('Empty Input',{
                    extensions: {code: 'BAD_USER_INPUT'}
                });
            }
            const updated = await User.findOneAndUpdate(
                { UUID },
                { $set: inputUser},
                { new: true, runValidators: true}
            );

            if (!updated){
                throw new GraphQLError('User not found',{
                    extensions: {code: 'NOT_FOUND'}
                });
            }

            return updated;
        },
        
        removeUser: async(_:unknown,args:{_id: string}, context: ResolverContext) => {
            
            console.log("remove resolver hit");
            console.log("incoming args:", args);

            if (!context.token){
                throw new GraphQLError('Unauthorized',{
                    extensions: {code: 'INVALID_ACCESS'}
                });
            }
            const decodedToken = await verifyFirebaseToken(context.token);
            const UUID = decodedToken.uid;

            const result = await User.findOneAndDelete({UUID});

            if(!result){
                throw new GraphQLError('Unauthorized',{
                    extensions: {code: 'INVALID_ACCESS'}
                });
            }

            return result;
        }
    }
}