export const freelancersDataReducer = (state = [], action) => {
    switch (action.type) {
      case "TALENTS_DATA":
        return action.payload;
      default:
        return state;
    }
  };
  