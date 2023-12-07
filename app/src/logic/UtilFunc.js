
export function getHeaderToken(){
    var accessToken = localStorage.getItem('accessToken');
    if (accessToken == null)
        return;
    accessToken = accessToken.replace("Bearer ", "");
    
    var refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken == null)
        return;
   
    refreshToken = refreshToken.replace("Bearer ", "");
    var tokens = {'Authorization':  accessToken, 'Authorization-Refresh' :  refreshToken};
    return tokens;
}

export function checkAuthToken(){
    var accessToken = localStorage.getItem('accessToken');
    if (accessToken === null)
        return false;
    
    var refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken === null)
        return false;

    return true;
}

export function printError(request, textStatus, error){
    console.log(JSON.stringify(request));
    console.log(JSON.stringify(textStatus));
    console.log(JSON.stringify(error));
}

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  export function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}


  // eslint-disable-line eqeqeq