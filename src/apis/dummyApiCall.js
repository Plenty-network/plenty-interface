const dummyApiCall=(data)=>{
    return new Promise((resolve,reject)=>{
       setTimeout(()=>{
           resolve(data);
           if(false){
            reject(false)
           }
       },1500);
    });

};
export default dummyApiCall;