export module chip8 {
    export class Event {
        private handlers: { (...params: any[]): void; }[] = [];
        
        public raise(...params: any[]) {
            this.handlers.forEach((callback) => {
                callback.apply(this, params);
            });
        }

        public subscribe(callback: (...params: any[]) => void ) {
            this.handlers.push(callback);
        }
    }
}