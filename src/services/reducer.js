export const initalState = {
    user: JSON.parse(localStorage.getItem("WhatsUpToken"))
    
};
export const actionTypes = {
    SET_USER: "SET_USER",
    UPDATE_USER: "UPDATE_USER",
    UPDATE_ONLINE: "ONLINE",
    CLEAR_USER: "CLEAR_USER"
};

export const reducer = (state,action) =>{
    switch (action.type) {
        case actionTypes.SET_USER:
           return{
               ...state,
               user: {
                      displayName: action.user.displayName,
                      email: action.user.email,
                      uid: action.user.uid,
                      onlineStatus: action.user.onlineStatus                      
                    },
            };   
        case actionTypes.UPDATE_ONLINE:
            console.log("action : ",action.user);
            return{
                ...state,
                user: {
                    ...action.user,
                    onlineStatus: action.user.onlineStatus
                }
            }
      
        case actionTypes.CLEAR_USER:
            return{
                ...state,
                user: undefined,                
            }
        default:             
            return state;
    }
};