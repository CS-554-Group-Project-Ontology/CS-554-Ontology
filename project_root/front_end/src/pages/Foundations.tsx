import { useContext,useEffect,useState } from "react";
import { getUserApi } from "../api";
import { AuthContext } from "../context/AuthContext";
import type { TsEconomicProfile } from "../types";

function Foundations(){
    const { currentUser } = useContext(AuthContext);
    const [loading,setLoading] = useState(false);
    const [economicProfile,setEconomicProfile] = useState<TsEconomicProfile>({
        income: 0,
        address: "",
        liabilities: {
            rent: 0,
            insuranceDeductibles: 0,
            utilities: 0,
            other: 0
        },
    });

    useEffect(()=>{
        const fetchProfile = async () => {
            try{
                if (!currentUser) return;
                const profile = await getUserApi();
                setEconomicProfile({
                    income: profile.economic_profile?.income ?? 0,
                    address: profile.economic_profile?.address ?? "",
                    liabilities: {
                        rent: profile.economic_profile?.liabilities?.rent ?? 0,
                        insuranceDeductibles: profile.economic_profile?.liabilities?.insuranceDeductibles ?? 0,
                        utilities: profile.economic_profile?.liabilities?.utilities ?? 0,
                        other: profile.economic_profile?.liabilities?.other ?? 0
                    },
                });
            }
            catch(e){
                console.error(e);
            }
            finally{
                setLoading(false);
            }
        };
        fetchProfile();
    }, [currentUser]);


    return(
        <div className='container mx-auto flex-1 px-2 py-8 sm:px-4 lg:px-6'>
            <h1 className='text-3xl font-bold mb-4'>
                Foundations
            </h1>
      </div>
    )
}

export default Foundations;