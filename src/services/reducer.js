export const initalState = {
    user: JSON.parse(localStorage.getItem("whatSupToken")),
};

export const actionTypes = {
    SET_USER: "SET_USER",
    UPDATE_USER: "UPDATE_USER"
};

export const reducer = (state,action) =>{
    switch (action.type) {
        case actionTypes.SET_USER:
            console.log("action :",action);
           return{
               ...state,
               user: {
                      displayName: action.user.displayName,
                      email: action.user.email,
                      uid: action.user.uid,
                      lastSeen: new Date(),
                      onlineStatus: true,
                    },
            };   
      
        default:
            return state;
    }
};