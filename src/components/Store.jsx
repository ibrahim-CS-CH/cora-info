import {createContext, useContext,useReducer,useCallback, useMemo} from 'react'
import { useQuery } from '@tanstack/react-query'
function useTeamSource() {
    const {data: team} = useQuery(["team"], () =>fetch('/data.json').then((res)=>res.json()),{
        initialData: [],
    })
    const[{ search}, dispatch]=useReducer((state, action)=>{
        switch(action.type) {
            case"setSearch":
                return {...state, search:action.payload}
        } 
    },{
        search: ""
    })  
    const setSearch = useCallback((search) =>{
        dispatch ({
            type: "setSearch",
            payload: search
        })
    },[])
    const filterTeam = useMemo(() => 
        team.filter((e)=>e.team.name.toLowerCase().includes(search))
    ,[team, search])

    const sortedTeam = useMemo(()=>
        [...filterTeam].sort((a,b)=>a.team.name.localeCompare(b.team.name))
    ,[filterTeam])
    return {team: sortedTeam,search, setSearch};
}
const TeamContext= createContext({
    team: []
});
export function useTeam() {
    return useContext(TeamContext)
}
export const TeamProvider = ({children}) => {
    return (
        <div>
            <TeamContext.Provider value={useTeamSource()}>
                {children}
            </TeamContext.Provider>
        </div>
    )
}