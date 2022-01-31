const dummyApiCall=(data)=>{
    return new Promise((resolve,reject)=>{
       setTimeout(()=>{
           resolve(data);
       },1500);
    });
};
export default dummyApiCall;