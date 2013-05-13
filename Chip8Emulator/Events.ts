export class Event {

    private handlers: { (eventArgs: any): void; }[] = [];

    // Constructor
    constructor() {

    }

    // Instance member
    public raise(eventArgs: any = null) {
        this.handlers.forEach((callback) => {
            callback(eventArgs);
        });
    }

    public subscribe(callback: (eventArgs) => void ) {
        this.handlers.push(callback);
    }

}
