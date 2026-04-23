import { getAuth } from "firebase/auth";

type DBResponse<T> = {
    data?: T;
    errors?: Array<{
        message: string;
        code?: string;
    }>
}

type Liabilities = {
    rent?: number;
    insuranceDeductibles?: number;
    utilities?: number;
    other?: number;
}

type EconomicProfile ={
    income?: number;
    city?: string;
    neighborhood?: string;
    liabilities?: Liabilities;
}

export async function dbRequest<T>(query: string, variables?: Record<string,unknown>): Promise<T>{
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user){
        throw new Error('User not signed in');
    }

    const userToken = await user.getIdToken();

    const response = await fetch('http://localhost:4000/',{
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            Authorization: `TokenHolder ${userToken}`,
        },
        body: JSON.stringify({
            query,
            variables
        }),
    });

    if(!response.ok){
        throw new Error(`Request failed; status ${response.status}`);
    }
    const result: DBResponse<T> = await response.json();

    if (result.errors && result.errors.length > 0){
        throw new Error(result.errors[0].message);
    }

    if (!result.data){
        throw new Error('No Data returned from server');
    }

    return result.data;
}

export async function addUserApi(){
    const data = await dbRequest<{
        addUser: {
            _id: string;
            UUID: string;
        }
    }>(
        `
        mutation AddUser{
            addUser{
                _id
                UUID
            }
        }
        `
    );

    return data.addUser;
}

export async function getUserApi(){
    const data = await dbRequest<{
        getMe:{
            _id: string;
            UUID:string;
            economic_profile: {
                income?: number;
                city?: string;
                neighborhood?: string;
                liabilities?: {
                    rent?: number;
                    insuranceDeductibles?: number;
                    utilities?: number;
                    other?: number;
                };
            };
        };
    }>(
            `
            query GetMe{
                getMe{
                    _id
                    UUID
                    economic_profile {
                        income
                        city
                        neighborhood
                        liabilities {
                            rent
                            insuranceDeductibles
                            utilities
                            other
                        }
                    }
                }
            }
            `
        );
        return data.getMe;
}

export async function getFredSeriesApi(seriesId: string, start?: string, end?: string){
    const data = await dbRequest<{
        fredSeries: {
            seriesId: string;
            observations: Array<{ date: string; value: number | null }>;
        };
    }>(
        `
        query FredSeries($seriesId: String!, $start: String, $end: String){
            fredSeries(seriesId: $seriesId, start: $start, end: $end){
                seriesId
                observations {
                    date
                    value
                }
            }
        }
        `,
        { seriesId, start, end },
    );
    return data.fredSeries;
}

export async function getCostOfLivingByCityAndNeighborhoodApi(city: string, neighborhood: string){
    const data = await dbRequest<{
        getCostOfLivingByCityAndNeighborhood: {
            rent?: number;
            insuranceDeductibles?: number;
            utilities?: number;
            other?: number;
        };
    }>(
            `
            query GetCostOfLivingByCityAndNeighborhood($city: String!, $neighborhood: String!){
                getCostOfLivingByCityAndNeighborhood(city: $city, neighborhood: $neighborhood){
                    rent
                    insuranceDeductibles
                    utilities
                    other
                }
            }
            `,
            { city, neighborhood },
        );
        return data.getCostOfLivingByCityAndNeighborhood;
}

export async function editUserApi(economic_profile: EconomicProfile){
    const data = await dbRequest<{
        editUser:{
            _id: string;
            UUID:string;
            economic_profile: {
                income?: number;
                city?: string;
                neighborhood?: string;
                liabilities?: {
                    rent?: number;
                    insuranceDeductibles?: number;
                    utilities?: number;
                    other?: number;
                };
            };
        };
    }>(
            `
            mutation EditUser($economic_profile: InputEconomicProfile){
                editUser(economic_profile: $economic_profile){
                    _id
                    UUID
                    economic_profile {
                        income
                        city
                        neighborhood
                        liabilities {
                            rent
                            insuranceDeductibles
                            utilities
                            other
                        }
                    }
                }
            }
            `,
            { economic_profile },
        );
        return data.editUser;
}