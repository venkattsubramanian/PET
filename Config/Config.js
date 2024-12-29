function jsonConcat(o1, o2) {
    for (var key in o2) {
      o1[key] = o2[key];
    }
    return o1;
  }
  
  const base = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  
  const server = {
    baseURL: "https://api.parentengagementtracker.com",
  };
  
  const config = jsonConcat(base, server);
  
  const combine = {
    //Signup
    login: config.baseURL + "/api/Auth/login",
    signUp: config.baseURL + "/api/Auth/signup",
    getSchool: config.baseURL + "/api/Activities/allSchools",

    // Home  
    feedData: config.baseURL + "/api/UserPosts/GetAllPosts",

    // Like 
    postlike: config.baseURL + "/api/UserPostLike/like",

    // Comment
    getComment: config.baseURL + "/api/Comments/",
    postComment: config.baseURL + "/api/Comments",  
    getCommentCount:  config.baseURL + "/api/Comments/",  
    editComment: config.baseURL + "/api/Comments/Editcomments",
    deleteComment: config.baseURL + "/api/Comments/Deletecomments",

    // Activity
    allActivity: config.baseURL + "/api/Question",
    submitActivities: config.baseURL + "/api/Question/submitQuestion",

    // Event
    getEvent: config.baseURL + "/api/Notification/GetAllEventDatas",

    //Notification 
    getNotification: config.baseURL + "/api/Notification/GetNotificationsByType?eventType=",

     //Profile 
     getProfile: config.baseURL + "/api/Auth/UserIdBaseGetProfile?userID=",

  };
  
  export default jsonConcat(config, combine);