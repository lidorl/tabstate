var _ = {
  get: function(url,next){
    var xhr= new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200){
        next(xhr.response);
      }
    }
    xhr.open('GET', url, true);
    xhr.send(null);
  },
  post: function(url, data, next){
    var xhr= new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status == 200){
        next(xhr.response);
      }
    }
    xhr.open('POST', url, true);
    xhr.send(data);
  }
}

var serverHostName = "http://localhost:3000/";

var dbConnector = {
  get: function(uuid, next){
    var url = serverHostName + 'users/find/' + uuid;
    _.get(url, function(result){
      console.log(result);
      //extreact users data from response
    })
  },
  create: function(next){
    var url = serverHostName + 'users/create';
    _.get(url, function(result){
      console.log(result);
      //need to exrract the new uuid key for the user
    })
  },
  update: function(data, next){

  }
}
