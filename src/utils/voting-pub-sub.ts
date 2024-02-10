type Message = {
  pollOptionId: string;
  votes: number;
};

type Subscriber = (message: Message) => void;

export class VotingPubSub {
  private channels: Record<string, Subscriber[]> = {};

  subscribe(id: string, subscriber: Subscriber) {
    if (!this.channels[id]) {
      this.channels[id] = [];
    }

    this.channels[id].push(subscriber);
  }

  publish(id: string, message: Message) {
    if (!this.channels[id]) return;

    this.channels[id].forEach((subscriber) => {
      subscriber(message);
    });
  }
}

export const voting = new VotingPubSub();
