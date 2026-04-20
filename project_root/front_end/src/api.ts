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
    address?: string;
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
                address?: string;
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
                        address
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

export async function editUserApi(economic_profile: EconomicProfile){
    const data = await dbRequest<{
        editUser:{
            _id: string;
            UUID:string;
            economic_profile: {
                income?: number;
                address?: string;
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
                        address
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