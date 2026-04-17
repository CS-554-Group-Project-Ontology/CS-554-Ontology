import { useContext,useEffect,useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserApi, editUserApi } from "../api";

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

function Mobility(){
    const { currentUser } = useContext(AuthContext);
    const [loading,setLoading] = useState(false);
    const [economicProfile,setEconomicProfile] = useState<EconomicProfile>({
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

    const handleSubmit = async (
        e: React.FormEvent,
        payload: EconomicProfile
    ) => {
        e.preventDefault();
        if (loading)return;
        if (
            payload.income === undefined &&
            payload.address === undefined &&
            !payload.liabilities
        ) {
            return;
        }
        try{
            setLoading(true);
            await editUserApi(payload);
        } catch (error){
            console.error(error);
        }
        finally{
            setLoading(false);
        }
    };

    return(
        <div className="MobilityPage">
            <div className = "mobilityBox">
                <form className="incomeInput" onSubmit={(e)=>handleSubmit(e,{income:Number(economicProfile.income)})}>
                    <h2>Income</h2>
                    <input 
                        type="number"
                        value={economicProfile.income ?? ""} 
                        onChange={(e)=>
                        setEconomicProfile((prev)=>({
                            ...prev,
                            income: e.target.value === "" ? undefined : Number(e.target.value)
                        }))
                    } />
                    <button type="submit" disabled={loading}>
                        {loading?"Saving.":"Save"}
                    </button>
                </form>
            </div>
            <div className = "mobilityBox">
                <form className="addressInput" onSubmit={(e)=>handleSubmit(e,{address:economicProfile.address})}>
                    <h2>Address</h2>
                    <textarea value={economicProfile.address ?? ""} onChange={(e)=>
                        setEconomicProfile((prev)=>({
                            ...prev,
                            address: e.target.value
                        }))
                    } />
                    <button type="submit" disabled={loading}>
                        {loading?"Saving.":"Save"}
                    </button>
                </form>
            </div>
            <div className = "mobilityBox">
                <h2>Liabilities</h2>
                <div className = "liabilitiesBox">
                    <form className="rentInput" onSubmit={(e)=>handleSubmit(e,{liabilities:{rent: Number(economicProfile.liabilities?.rent)}})}>
                        <h2>Rent</h2>
                        <input 
                        type="number"
                        value={economicProfile.liabilities?.rent ?? ""} onChange={(e)=>
                            setEconomicProfile((prev)=>({
                                ...prev,
                                liabilities:{
                                    ...(prev.liabilities|| {}),
                                    rent: e.target.value === "" ? undefined : Number(e.target.value)
                                }
                            }))
                        } />
                        <button type="submit" disabled={loading}>
                            {loading?"Saving.":"Save"}
                        </button>
                    </form>
                </div>
                <div className = "liabilitiesBox">
                    <form className="insuranceInput" onSubmit={(e)=>handleSubmit(e,{liabilities:{insuranceDeductibles: Number(economicProfile.liabilities?.insuranceDeductibles)}})}>
                        <h2>Insurance</h2>
                        <input 
                        type="number"
                        value={economicProfile.liabilities?.insuranceDeductibles ?? ""} onChange={(e)=>
                            setEconomicProfile((prev)=>({
                                ...prev,
                                liabilities:{
                                    ...prev.liabilities,
                                    insuranceDeductibles: e.target.value === "" ? undefined : Number(e.target.value)
                                }
                            }))
                        } />
                        <button type="submit" disabled={loading}>
                            {loading?"Saving.":"Save"}
                        </button>
                    </form>
                </div>
                <div className = "liabilitiesBox">
                    <form className="utilitiesInput" onSubmit={(e)=>handleSubmit(e,{liabilities:{utilities: Number(economicProfile.liabilities?.utilities)}})}>
                        <h2>Utilities</h2>
                        <input 
                        type="number"
                        value={economicProfile.liabilities?.utilities ?? ""} onChange={(e)=>
                            setEconomicProfile((prev)=>({
                                ...prev,
                                liabilities:{
                                    ...prev.liabilities,
                                    utilities: e.target.value === "" ? undefined : Number(e.target.value)
                                }
                            }))
                        } />
                        <button type="submit" disabled={loading}>
                            {loading?"Saving.":"Save"}
                        </button>
                    </form>
                </div>
                <div className = "liabilitiesBox">
                    <form className="otherInput" onSubmit={(e)=>handleSubmit(e,{liabilities:{other: Number(economicProfile.liabilities?.other)}})}>
                        <h2>Other</h2>
                        <input 
                        type="number"
                        value={economicProfile.liabilities?.other ?? ""} onChange={(e)=>
                            setEconomicProfile((prev)=>({
                                ...prev,
                                liabilities:{
                                    ...prev.liabilities,
                                    other: e.target.value === "" ? undefined : Number(e.target.value)
                                }
                            }))
                        } />
                        <button type="submit" disabled={loading}>
                            {loading?"Saving.":"Save"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Mobility;