export interface user{
    name:string,
    surname:String,
    teamId:number,
    positionId:number,
    email: string,
    phone:string
    
}

export interface teams{
    id:number,
    name:string
}

export interface positions{
    id:number,
    name:string,
    teamsId:number
}