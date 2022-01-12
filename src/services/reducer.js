export const initalState = {
    user: JSON.parse(localStorage.getItem("WhatsUpToken")),
};

export const actionTypes = {
    SET_USER: "SET_USER",
    UPDATE_USER: "UPDATE_USER",
    UPDATE_ONLINE: "ONLINE",
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
            console.log("action :",action);
            return{
                ...state,
                user: {
                    ...action.user,
                    onlineStatus: action.user.onlineStatus
                }
            }
        default:
            return state;
    }
};