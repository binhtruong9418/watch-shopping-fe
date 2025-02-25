import mqtt from "mqtt";

type CreateMqttClientOptions = {
    setMqttStatus: (status: string) => void;
    setMqttError: (error: string) => void;
    onMessage: (topic: string, message: any) => void;
};

function createMqttClient(
    {
        setMqttStatus,
        setMqttError,
        onMessage,
    }: CreateMqttClientOptions) {

    const host = 'wss.vinhomes.co.uk';
    const protocol = 'wss';

    const uniqueId = `binh-project-2-mqtt-client-${Math.random().toString(36).substring(7)}`;
    const connectUrl = `${protocol}://${host}`;

    return mqtt
        .connect(connectUrl, {
            clientId: uniqueId,
            username: import.meta.env.MQTT_USERNAME,
            password: import.meta.env.MQTT_PASSWORD,
            protocol: 'wss',
            path: '/mqtt',
        })
        .on('connect', () => {
            setMqttStatus('Connected');
            console.log('Connected to MQTT broker')
        })
        .on('error', (error: any) => {
            setMqttStatus('Error');
            setMqttError(
                `Name: ${error?.name}\nMessage: ${error?.message}\nCode: ${error?.code}`,
            );
        })
        .on('disconnect', () => {
            setMqttStatus('Disconnected');
        })
        .on('offline', () => {
            setMqttStatus('Offline');
        })
        .on('reconnect', () => {
            setMqttStatus('Reconnecting');
        })
        .on('close', () => {
            setMqttStatus('Disconnected');
        })
        .on('message', (topic: any, message: any) => {
            onMessage(topic, message);
        });
}

export {createMqttClient};
