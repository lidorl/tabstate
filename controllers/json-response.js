//manipulate the responses before sending them.
//keeps our json responses consistant

exports.ok = function(data){
  return { status: 'ok', data: data};
}

exports.error = function(err){
  return { status: 'error', error: err};
}
