import {toast, ToastContainer} from "react-toastify";
import {useEffect} from "react";
import i18n from "../translation";
import {MqttProvider} from "../mqtt/MqttProvider.tsx";

// @ts-ignore
export function updater<T>(Component: React.ComponentType<any>) {
    return function (props: any) {

        const getLanguage = async () => {
            try {
                const language = localStorage.getItem('language');
                if (language) {
                    await i18n.changeLanguage(language);
                } else {
                    localStorage.setItem('language', 'vi');
                }
            } catch (err: any) {
                toast.error(err.message);
            }
        }

        useEffect(() => {
            getLanguage().then()
        }, []);
        return (
            <MqttProvider>
                <Component {...props} />
                <ToastContainer autoClose={3000} />
            </MqttProvider>
        );
    };
}
