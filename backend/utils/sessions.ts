import {v4 as uuid} from 'uuid';

interface Session {
    id: string;
    role: string;
};

class Sessions {
    private sessions: Session[] = [];

    add(role: string): string {
        const id = uuid();

        this.sessions.push({
            id,
            role,
        });

        return id;
    };

    isExist(id: string): boolean {
        const foundSession = this.sessions.find(item => item.id === id);

        if(foundSession) return true;
        else return false;
    };

    getRole(id: string): string {
        const foundSession = this.sessions.find(item => item.id === id);

        if(foundSession) return foundSession.role;
        else return undefined;
    };
};

export const session = new Sessions();