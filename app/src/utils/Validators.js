const EmailAddressValidator = (emailAddressStr) => {
    if (!emailAddressStr || !emailAddressStr.length) return false;
    return (/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(emailAddressStr));
};

const PhoneNumberValidator = (phoneNumberStr) => {
    if (!phoneNumberStr || !phoneNumberStr.length) return false;
    return (/^[1-9]\d{9}$/.test(phoneNumberStr));
};

const WebAddressValidator = (webAddressStr) => {
    if (!webAddressStr || !webAddressStr.length) return false;
    return /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(webAddressStr);
};

const DateValidator = (dateStr) => {
    if (!dateStr || !dateStr.length) return false;
    return /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/.test(dateStr); // mm/dd/yyyy or mm dd yyyy or mm-dd-yyyy
};

const US_STATES = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
const USStateValidator = (stateStr) => {
    if (!stateStr || !stateStr.length) return false;
    return new Set(US_STATES.map((state) => {
        return state.toLowerCase();
    })).has(stateStr.toLowerCase());
};

const USZipcodeValidator = (zipcodeStr) => {
    if (typeof zipcodeStr === "number") {
        zipcodeStr = String(zipcodeStr);
    }
    if (!zipcodeStr || !zipcodeStr.length) return false;
    return (/^[1-9]\d{4}$/.test(zipcodeStr));
};

const UsernameValidator = (usernameStr) => {
    if (!usernameStr || !usernameStr.length) return false;
    return ((/^[a-zA-Z0-9.]{4,10}$/.test(usernameStr)) && usernameStr.split(".").length === 2 && usernameStr[usernameStr.length - 1] !== '.');
};

const StrongPasswordValidator = (passwordStr) => {
    if (typeof passwordStr === "number") {
        passwordStr = String(passwordStr);
    }
    if (!passwordStr || !passwordStr.length) return false;
    let hist = {
        uppercase: 0,
        lowercase: 0,
        numeric: 0,
        specialchar: 0
    };
    for (let i = 0; i < passwordStr.length; i++) {
        if (passwordStr[i] >= 'a' && passwordStr[i] <= 'z') {
            hist.lowercase++;
        } else if (passwordStr[i] >= 'A' && passwordStr[i] <= 'Z') {
            hist.uppercase++;
        } else if (passwordStr[i] >= '0' && passwordStr[i] <= '9') {
            hist.numeric++;
        } else {
            hist.specialchar++;
        }
    }
    return (passwordStr.length >= 8 && hist.uppercase > 0 && hist.lowercase > 0 && hist.numeric > 0 && hist.specialchar > 0);
};

const PriceValidator = (priceStr) => {
    if (!priceStr || !priceStr.length) return false;
    return (/^[0-9]*\.\d{2}|[0-9]*$/.test(priceStr));
};

module.exports = {
    isEmail: EmailAddressValidator,
    isPhone: PhoneNumberValidator,
    isWebAddress: WebAddressValidator,
    isDate: DateValidator,
    isUSState: USStateValidator,
    isZipcode: USZipcodeValidator,
    isUsername: UsernameValidator,
    isStrongPassword: StrongPasswordValidator,
    isPrice: PriceValidator
};