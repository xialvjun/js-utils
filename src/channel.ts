export class Channel<T> {
  resources: T[] = []
  requests = []
  push(obj: T) {
    const request = this.requests.shift();
    if (request) {
      request.resolve(obj);
      return;
    }
    this.resources.push(obj);
  }
  pull() {
    const resource = this.resources.shift();
    if (resource) {
      return Promise.resolve(resource);
    }
    return new Promise<T>((resolve, reject) => {
      this.requests.push({ resolve, reject });
    });
  }
}
