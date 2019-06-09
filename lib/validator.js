


exports.validateField = (field,name,required,extra) => {
    const invalidReg = /\s*'\s*/;
  
    if(required && (!field || field.toString().trim()==='')){
      return {valid: false, msg:"The field '"+name+"' is mandatory"};
    }
  
    if(typeof field!='string' || invalidReg.test(field) || (extra && !extra.test(field))){
      return {valid: false, msg:"The field '"+name+"' is not valid"};
    }
  
    return {valid: true, msg:''};
  
  }

  exports.validateEmail = (email) => {
    return this.validateField(email,'email',true,/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/);
  }

  exports.validateAmount = (field) => {
    const invalidReg = /\s*'\s*/;
  
    if(Number.isNaN(field))
        return {valid: false, msg:"The field amount is mandatory"};

    if(field <= 0)
      return {valid: false, msg:"The field amount is not valid"};
  
    return {valid: true, msg:''};
  
  }
  
  exports.validateDate = (field) => {
    const invalidReg = /\s*'\s*/;
  
    let validation = this.validateField(field,'date',true);
    if(!validation.valid)
      return validation;
    
    if(isNaN(Date.parse(field)))
      return {valid: false, msg:"The field email is not valid"};
  
    return {valid: true, msg:''};
  
  }