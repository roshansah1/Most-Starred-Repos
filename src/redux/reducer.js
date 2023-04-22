

export const dataFromApi = (data = [], action)  => {
     switch(action.type){
        case "getdata" :
        return action.payload
        default :
        return data
     }
      
}