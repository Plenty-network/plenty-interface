const dummyApiCall=(data)=>{
    return new Promise((resolve,reject)=>{
       setTimeout(()=>{
           if(data){
           resolve(data);
           }else
           {
            reject(data);
           }
       },1500);
    });

};
export default dummyApiCall;