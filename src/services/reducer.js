export const initalState = {
    user: JSON.parse(localStorage.getItem("WhatsUpToken")),
    clearNotification: false,
};

export const actionTypes = {
    SET_USER: "SET_USER",
    UPDATE_USER: "UPDATE_USER",
    UPDATE_ONLINE: "ONLINE",
    UPDATE_CLEAR_NOTIFICATIONS: "CLEAR_NOTIFICATION",
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
            console.log("action :",action);
            return{
                ...state,
                user: {
                    ...action.user,
                    onlineStatus: action.user.onlineStatus
                }
            }
        case actionTypes.UPDATE_CLEAR_NOTIFICATIONS:
            console.log("Clear action :",action);
            return{
                ...state,
                clearNotification: !action.clearNotification

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