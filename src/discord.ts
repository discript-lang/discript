import { WebSocket } from 'ws';
import fetch, { Response } from 'node-fetch';
class Bot {
    private token: string;
    private applicationId: string;
    private gatewayUrl: string;
    private ws: WebSocket | null;
    private eventHandlers: Record<string, Function>;
    private commands: Map<string, Function>;
    constructor(token: string, applicationId: string) {
        this.token = token;
        this.applicationId = applicationId;
        this.gatewayUrl = 'wss://gateway.discord.gg/?v=10&encoding=json';
        this.ws = null;
        this.eventHandlers = {};
        this.commands = new Map();
    }
    public login(): void {
        this.ws = new WebSocket(this.gatewayUrl);

        this.ws.on('open', () => {
            this.sendIdentifyPayload();
        });

        this.ws.on('close', (code) => {
            console.log(`Disconnected from the Discord Gateway (code: ${code})`);
        });

        this.ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        this.ws.on('message', (message) => {
            try {
                const payload = JSON.parse(message.toString());

                switch (payload.op) {
                    case 10:
                        this.startHeartbeat(payload.d.heartbeat_interval);
                        break;
                    case 11:
                        console.log('Received heartbeat ACK from the gateway');
                        break;
                    case 0:
                        this.handleDispatchPayload(payload);
                        break;
                }
            } catch (error) {
                console.error('Error while parsing the message:', error);
            }
        });
    }
    private sendIdentifyPayload(): void {
        const payload = {
            op: 2,
            d: {
                token: this.token,
                intents: 3276799,
                properties: {
                    $os: 'linux',
                    $browser: 'discript',
                    $device: 'discript',
                },
            },
        };

        this.ws?.send(JSON.stringify(payload), (error) => {
            if (error) {
                console.error('Error while sending the identify payload:', error);
            }
        });
    }
    private startHeartbeat(interval: number): void {
        console.log('Starting heartbeat interval');

        setInterval(() => {
            const payload = {
                op: 1,
                d: null,
            };

            this.ws?.send(JSON.stringify(payload), (error) => {
                if (error) {
                    console.error('Error while sending heartbeat to the gateway:', error);
                } else {
                    console.log('Sent heartbeat to the gateway');
                }
            });
        }, interval);
    }
    private handleDispatchPayload(payload: any): void {
        const { t, d } = payload;

        if (t === 'INTERACTION_CREATE') {
            const { name } = d.data;
            const commandHandler = this.commands.get(name);

            if (commandHandler) {
                const message = {
                    ...d,
                    reply: (content: string, embed: any) => this.replyToInteraction(d, content, embed),
                };

                commandHandler(message);
            }
        } else if (t === 'MESSAGE_CREATE') {
            const messageHandler = this.eventHandlers[t];

            if (messageHandler) {
                const message = {
                    ...d,
                    reply: (content: string, embed: any) => this.replyMessage(d, content, embed),
                };

                messageHandler(message);
            }
        } else {
            if (this.eventHandlers[t]) {
                this.eventHandlers[t](d);
            }
        }
    }
    public on(eventType: string, handler: Function): void {
        this.eventHandlers[eventType] = handler;
    }
    async sendMessage(channelId: string, content: string) {
        const endpoint = `https://discord.com/api/v10/channels/${channelId}/messages`;
        const payload = {
            content,
        };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bot ${this.token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error('Failed to send message:', response.status, response.statusText);
                return;
            }
            const responseData = await response.json();

            console.log('Sent message successfully');
            return responseData
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    }
    async replyMessage(message: any, content: string, embed: any) {
        const endpoint = `https://discord.com/api/v10/channels/${message.channel_id}/messages`;
        const payload: any = {
            content,
            message_reference: {
                message_id: message.id,
                channel_id: message.channel_id,
                guild_id: message.guild_id,
            },
        };

        if (embed) {
            payload.embeds = [embed];
        }

        try {
            const response: Response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bot ${this.token}`,
                },
                body: JSON.stringify(payload),
            });

            console.log(await response.json());
            if (!response.ok) {
                console.error('Failed to send reply:', response.status, response.statusText);
                return;
            }
            console.log('Sent reply successfully');
        } catch (error) {
            console.error('Failed to send reply:', error);
        }
    }
    async setStatus(status: any, type: any, message: any) {
        const payload = {
            op: 3,
            d: {
                since: null,
                game: {
                    name: message,
                    type: type,
                },
                status: status,
                afk: false,
            },
        };

        try {
            if (this.ws) {
                this.ws.send(JSON.stringify(payload));
                console.log('Bot status updated successfully');
            } else {
                console.error('WebSocket connection is not established.');
            }
        } catch (error) {
            console.error('Failed to set bot status:', error);
        }
    }
    async registerCommand(name: string, description: string, options: any, handler: any) {
        const url = `https://discord.com/api/v10/applications/${this.applicationId}/commands`;

        const json = {
            name,
            description,
            options: options, // Add the options parameter to the JSON payload
        };

        const headers = {
            Authorization: `Bot ${this.token}`,
            'Content-Type': 'application/json',
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(json),
            });

            if (!response.ok) {
                console.error('Failed to create global command:', response.status, response.statusText);
                return;
            }

            console.log('Global command created successfully');

            this.commands.set(name, handler);
        } catch (error) {
            console.error('Failed to create global command:', error);
        }
    }
    async replyToInteraction(interaction: any, content: string, embed: any) {
        const endpoint = `https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`;
        const payload = {
            type: 4,
            data: {
                content: content !== undefined ? content : null,
                embeds: embed !== undefined ? [embed] : null,
            }
        };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bot ${this.token}`,
                },
                body: JSON.stringify(payload)
            });

            let resp: any = await response.json()

            if (!response.ok) {
                console.error('Failed to send reply:', response.status, response.statusText, '\n Discord response: ', JSON.stringify(resp));
            }

            console.log('Sent reply successfully');
        } catch (error) {

        }
    }
}
export { Bot };