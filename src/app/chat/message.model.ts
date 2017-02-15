export class Message {
    username: string
    avatarUrl: string
    time: string
    text: string
    source: string
    id: string

    constructor(username: string, avatarUrl: string, time: string, text: string, source: string, id: string) {
        this.username = username;
        this.avatarUrl = avatarUrl;
        this.time = time;
        this.text = text;
        this.source = source;
        this.id = id;
    }
}
