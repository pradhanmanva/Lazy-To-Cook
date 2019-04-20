const EmailAddressValidator = (emailAddressStr) => {
    if (!emailAddressStr || !emailAddressStr.length) return false;
    return (/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(emailAddressStr));
}

const PhoneNumberValidator = (phoneNumberStr)=> {
    if (!phoneNumberStr || !phoneNumberStr.length) return false;
    return (/^[1-9]\d{9}$/.test(phoneNumberStr));
}

const WebAddressValidator = (webAddressStr) => {
    if (!webAddressStr || !webAddressStr.length) return false;
    return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(webAddressStr);
}

const DateValidator = (dateStr) => {
    if(!dateStr || !dateStr.length) return false;
    return /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/.test(dateStr); // mm/dd/yyyy or mm dd yyyy or mm-dd-yyyy
}

const US_STATES = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
const USStateValidator = (stateStr) => {
    if (!stateStr || !stateStr.length) return false;
    return new Set(US_STATES.map((state)=>{return state.toLowerCase();})).has(stateStr.toLowerCase());
}

const USZipcodeValidator = (zipcodeStr) => {
    if (typeof zipcodeStr === "number") {
        zipcodeStr = new String(zipcodeStr);
    }
    if (!zipcodeStr || !zipcodeStr.length) return false;
    return (/^[1-9]\d{4}$/.test(zipcodeStr));
}

const UsernameValidator = (usernameStr) => {
    if (!usernameStr || !usernameStr.length) return false;
    return ((/^[a-zA-Z0-9.]{10}$/.test(usernameStr)) && usernameStr.split(".").length == 2);
}

const PasswordValidator = (passwordStr) => {
    if (!passwordStr || !passwordStr.length) return false;
    return true; // TODO
}

const PriceValidator = (priceStr) => {
    if (typeof priceStr === "number") {
        priceStr = new String(priceStr);
    }
    if (!priceStr || !priceStr.length) return false;
    return (/^[0-9]*\.\d{2}|[0-9]*$/.test(priceStr));
}

module.exports = {
    isEmail : EmailAddressValidator,
    isPhone : PhoneNumberValidator,
    isWebAddress : WebAddressValidator,
    isDate : DateValidator,
    isUSState : USStateValidator,
    isZipcode : USZipcodeValidator,
    isUsername : UsernameValidator,
    isPassword : PasswordValidator,
    isPrice : PriceValidator
}