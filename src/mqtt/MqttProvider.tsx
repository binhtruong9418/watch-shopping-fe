import {createContext, useContext, useEffect, useState} from 'react';
import useMqttConnection from "./useMqttConnection";

type SubscribeToTopic = (topics: string[], options?: {qos: 0 | 1 | 2}) => void;

type MqttContextType = {
    mqttClient: any;
    mqttData: any;
    mqttStatus: string;
    mqttError: string;
    subscribeToTopic: SubscribeToTopic;
    setDoMqttConnection: (doMqttConnection: boolean) => void;
};

const MqttContext = createContext<MqttContextType>({
    mqttClient: null,
    mqttData: null,
    mqttStatus: 'Disconnected',
    mqttError: '',
    subscribeToTopic: () => {},
    setDoMqttConnection: () => {},
});

export const MqttProvider = ({children}: any) => {
    const [doMqttConnection, setDoMqttConnection] = useState(true);
    const {
        mqttClient,
        mqttData,
        mqttStatus,
        mqttError,
        setMqttError,
        setMqttStatus,
    } = useMqttConnection(doMqttConnection);
    const userInfo = localStorage.getItem('userInfo');
    const jwtToken = localStorage.getItem('jwtToken');

    useEffect(() => {
        if(userInfo && jwtToken) {
            setDoMqttConnection(true)
        } else {
            setDoMqttConnection(false)
        }
    }, [userInfo, jwtToken]);

    const subscribeToTopic: SubscribeToTopic = (topics, {qos = 1} = {qos: 1}) => {
        if (!mqttClient) {
            return;
        }

        for (const topic of topics) {
            mqttClient.subscribe(topic, {qos}, (error: any) => {
                if (error) {
                    setMqttStatus(`TopicError: ${topic}`);
                    setMqttError(
                        `Name: ${error?.name}\nMessage: ${error?.message}\nCode: ${error?.code}`,
                    );
                }
            });
        }
    };

    return (
        <MqttContext.Provider
            value={{
                mqttClient,
                mqttData,
                mqttStatus,
                mqttError,
                subscribeToTopic,
                setDoMqttConnection,
            }}>
            {children}
        </MqttContext.Provider>
    );
};
export const useMqtt = () => useContext(MqttContext);