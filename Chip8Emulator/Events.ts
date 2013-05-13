export class Event {

    private handlers: { (eventArgs): void; }[] = [];

    // Constructor
    constructor() {

    }

    // Instance member
    public raise(eventArgs: any) {
        this.handlers.forEach((callback) => {
            callback(eventArgs);
        });
    }

    public subscribe(callback: (eventArgs) => void ) {
        this.handlers.push(callback);
    }

}
