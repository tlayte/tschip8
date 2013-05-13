export module chip8 {
    export class Event {
        private handlers: { (...params: any[]): void; }[] = [];
        
        public raise() {
            this.handlers.forEach((callback) => {
                callback(arguments);
            });
        }

        public subscribe(callback: (...params: any[]) => void ) {
            this.handlers.push(callback);
        }
    }
}