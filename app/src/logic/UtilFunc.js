

export function getHeaderToken(){
    var accessToken = localStorage.getItem('accessToken');
    accessToken = accessToken.replace("Bearer ", "");
    
    var refreshToken = localStorage.getItem('refreshToken');
    refreshToken = refreshToken.replace("Bearer ", "");
    var tokens = {'Authorization':  accessToken, 'Authorization-Refresh' :  refreshToken};
    return tokens;
}

export function checkAuthToken(){
    var accessToken = localStorage.getItem('accessToken');
    if (accessToken == 'null' || accessToken == undefined)
        return false;
    
    var refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken == 'null' || refreshToken == undefined)
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

  // eslint-disable-line eqeqeq