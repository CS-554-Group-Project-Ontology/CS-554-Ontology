import { useContext,useEffect,useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/Loading";

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
    const [economicProfile,setEconomicProfile] = useState<EconomicProfile>({
        income: 0,
        address: " ",
        liabilities: {
            rent: 0,
            insuranceDeductibles: 0,
            utilities: 0,
            other: 0
        },
    });

    useEffect(()=>{
        const profile = getUserById
    })

    return(
        <div className="MobilityPage">

        </div>
    )
}

export default Mobility;