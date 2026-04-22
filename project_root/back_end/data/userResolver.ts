import { GraphQLError } from 'graphql';
import { setCache, getCache, cleanKey } from '../EconProfRedis.ts';
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
  city?: string;
  neighborhood?: string;
  liabilities?: TsLiabilities;
}

type ResolverContext = {
  token: string;
}

export const userResolver = {
    Query:{
        users: async() =>{
      const users = await User.find();
            if (users.length==0){
                throw new GraphQLError("Users Not Found"),{
                    extensions: {code: 'NOT_FOUND'}
                }
      }
      return users;
    },
        getMe: async (_:unknown,__:unknown, context: ResolverContext) => {
            if (!context.token){
                throw new GraphQLError('Unauthorized',{
                    extensions: {code: 'INVALID_ACCESS'}
        });
      }
      const decodedToken = await verifyFirebaseToken(context.token);
      const UUID = decodedToken.uid;

      const cache = await getCache(UUID);
            if (cache){
                return cache
      }

      const found = await User.findOneAndUpdate(
        { UUID },
        { $setOnInsert: { UUID } },
                { upsert: true, returnDocument: 'after' }
      );

      await setCache(UUID, found!.toObject());
      return found;
    },

    getCostOfLivingByCityAndNeighborhood: async (
      _: unknown,
      args: { city: string; neighborhood: string },
      context: ResolverContext,
    ) => {
      if (!context.token) {
        throw new GraphQLError('Unauthorized', {
          extensions: { code: 'INVALID_ACCESS' },
        });
      }

      const city = args.city.trim();
      const neighborhood = args.neighborhood.trim();

      if (!city || !neighborhood) {
        throw new GraphQLError('City and Neighborhood are required', {
          extensions: { code: 'BAD_USER_INPUT' },
        });
      }

      const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      const users = await User.find({
        'economic_profile.city': {
          $regex: `^${escapeRegex(city)}$`,
          $options: 'i',
        },
        'economic_profile.neighborhood': {
          $regex: `^${escapeRegex(neighborhood)}$`,
          $options: 'i',
        },
      });

      if (users.length == 0) {
        throw new GraphQLError('No data for this neighborhood yet', {
          extensions: { code: 'NOT_FOUND' },
        });
      }

      let totalRent = 0;
      let totalInsuranceDeductibles = 0;
      let totalUtilities = 0;
      let totalOther = 0;
      
      let rentCount = 0;
      let insuranceCount = 0;
      let utilitiesCount = 0;
      let otherCount = 0;

      users.forEach((user) => {
        const liabilities = user.economic_profile?.liabilities;
        if(!liabilities) return;

        if (typeof liabilities.rent === 'number' && liabilities.rent >= 0) {
          totalRent += liabilities.rent;
          rentCount++;
        }
        if (typeof liabilities.insuranceDeductibles === 'number' && liabilities.insuranceDeductibles >= 0) {
          totalInsuranceDeductibles += liabilities.insuranceDeductibles;
          insuranceCount++;
        }
        if (typeof liabilities.utilities === 'number' && liabilities.utilities >= 0) {
          totalUtilities += liabilities.utilities;
          utilitiesCount++;
        }
        if (typeof liabilities.other === 'number' && liabilities.other >= 0) {
          totalOther += liabilities.other;
          otherCount++;
        }

        if(rentCount === 0 && insuranceCount === 0 && utilitiesCount === 0 && otherCount === 0){
          throw new GraphQLError('No data for this neighborhood yet', {
            extensions: { code: 'NOT_FOUND' },
          });
        }       
      });

      return {
        rent: rentCount > 0 ? totalRent / rentCount : 0,
        insuranceDeductibles: insuranceCount > 0 ? totalInsuranceDeductibles / insuranceCount : 0,
        utilities: utilitiesCount > 0 ? totalUtilities / utilitiesCount : 0,
        other: otherCount > 0 ? totalOther / otherCount : 0,
      };
    },
  },

  Mutation: {
        addUser: async(_:unknown,__:unknown,context: ResolverContext) =>{
            console.log("register resolver hit");
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
                if(econProf.city !== undefined){
                    if(typeof econProf.city !== 'string' || econProf.city.trim().length === 0){
                        throw new GraphQLError('Invalid City Input',{
                            extensions: {code: 'BAD_USER_INPUT'}
            });
          }
                    inputUser["economic_profile.city"] = econProf.city.trim();
        }
                if(econProf.neighborhood !== undefined){
                    if(typeof econProf.neighborhood !== 'string' || econProf.neighborhood.trim().length === 0){
                        throw new GraphQLError('Invalid Neighborhood Input',{
                            extensions: {code: 'BAD_USER_INPUT'}
            });
          }
                    inputUser["economic_profile.neighborhood"] = econProf.neighborhood.trim();
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
        { $set: inputUser, $setOnInsert: { UUID } },
                { upsert: true, returnDocument: 'after', runValidators: true }
      );

      await setCache(UUID, updated!.toObject());
      return updated;
    },

        removeUser: async(_:unknown,__:unknown, context: ResolverContext) => {
            
            console.log("remove resolver hit");

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
      await cleanKey(UUID);
      return result;
        }
    }
}