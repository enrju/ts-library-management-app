import {hash, compare} from 'bcrypt';

export const hashText = async (text: string): Promise<any> => {
    const result = await hash(text, 10);

    return result;
}

export const checkHash = async (text: string, hash: string): Promise<any> => {
    const result = await compare(text, hash);

    if(result) return true;
    else return false;
}