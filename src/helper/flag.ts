const COUNTRY_RE = /^[a-z]{2}$/i;
const MAGIC_NUMBER = 127462 - 65;

const flag = (country: string) => {
    if (!country || !COUNTRY_RE.test(country)) {
        return '';
    }

    if (String && String.fromCodePoint) {
        return String.fromCodePoint(
            ...country.split('').map(c => MAGIC_NUMBER + c.charCodeAt(0))
        );
    }

    return '';
};

export default flag;
