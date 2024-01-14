import React, { useState, useEffect, useRef } from "react";
import { FaPause, FaPlay } from "react-icons/fa";

const App: React.FC = () => {
    const [chunks, setChunks] = useState([]);
    const [recording, setRecording] = useState(false);
    const videoElement = useRef<HTMLVideoElement>(null);
    const [deviceList, setDeviceList] = useState<MediaDeviceInfo[]>([]);

    useEffect(() => {
        getAllAvailableDevices();
    }, []);

    async function getAllAvailableDevices() {
        const devices = await window.navigator.mediaDevices.enumerateDevices();
        setDeviceList(devices);
    }

    async function prepareSources() {
        if (
            !videoElement.current ||
            !window.navigator ||
            !window.navigator.mediaDevices ||
            !window.navigator.mediaDevices.getUserMedia
        ) {
            console.error("the device is incompatible for video calling");
            return;
        }

        const stream = await window.navigator.mediaDevices.getUserMedia({
            video: {
                width: 1920,
                height: 1080,
                frameRate: 30,
                facingMode: "user",
            },
            audio: true,
        });

        videoElement.current.srcObject = stream;
        videoElement.current.play();
        setRecording(true);
    }

    function stopRecording() {
        if (videoElement.current) videoElement.current.pause();
        setRecording(false);
    }

    return (
        <div className="flex flex-col w-full max-w-full p-6 gap-6">
            <div className="prose mx-auto">
                <h1>Video calling app</h1>
            </div>

            <div className="w-full flex flex-col gap-4 rounded-lg border-2 border-blue-400">
                <video
                    ref={videoElement}
                    autoPlay
                    className="h-auto max-w-[600px]"
                ></video>
            </div>

            <div className="w-full flex items-center justify-center gap-4">
                {!recording && (
                    <button
                        onClick={prepareSources}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white flex items-center justify-center gap-2"
                    >
                        <FaPlay />
                        Start
                    </button>
                )}
                {recording && (
                    <button
                        onClick={stopRecording}
                        className="px-4 py-2 rounded-lg bg-blue-500 text-white flex items-center justify-center gap-2"
                    >
                        <FaPause />
                        Stop
                    </button>
                )}
            </div>
        </div>
    );
};

export default App;
