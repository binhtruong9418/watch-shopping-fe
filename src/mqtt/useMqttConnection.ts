import {useState, useEffect} from 'react';
import {createMqttClient} from "./mqttService.ts";
import {MqttClient} from "mqtt";

function useMqttConnection(doMqttConnection: any) {
    const [mqttStatus, setMqttStatus] = useState('Disconnected');
    const [mqttError, setMqttError] = useState<any>(null);
    const [mqttData, setMqttData] = useState({});
    const [mqttClient, setMqttClient] = useState<MqttClient | null>(null);

    useEffect(() => {
        if (!doMqttConnection) {
            return;
        }

        const client = createMqttClient({
            setMqttStatus,
            setMqttError,
            onMessage: (topic, message) => {
                setMqttData(() => ({
                    message,
                    topic,
                }));
            },
        });

        setMqttClient(client);

        return () => {
            if (client) {
                client.end();
            }
        };
    }, [doMqttConnection]);

    return {
        mqttClient,
        mqttData,
        mqttStatus,
        mqttError,
        setMqttStatus,
        setMqttError,
    };
}

export default useMqttConnection;