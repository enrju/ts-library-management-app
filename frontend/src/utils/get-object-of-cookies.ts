export const getObjectOfCookies = () => {
    const arrStr: string[] = (decodeURIComponent(document.cookie)).split('; ');
    const arrStr2D: string[][] = [];

    arrStr.forEach((item: string, index: number) => {
        arrStr2D[index] = item.split('=');
    });

    arrStr2D.forEach((item: string[], index: number) => {
        if(index < arrStr.length - 1) {
            arrStr[index] = '"' + item[0] + '":"' + item[1] + '",';
        } else {
            arrStr[index] = '"' + item[0] + '":"' + item[1] + '"';
        }
    });

    let str: string = "{";
    arrStr.forEach(item => {
        str += item;
    });
    str += "}";

    return JSON.parse(str);
}